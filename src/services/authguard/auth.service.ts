import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { Logger } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { logContext } from 'src/common/helpers/log'
import * as common from 'src/types'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { jwtToken } from './jwt'
import * as qs from 'querystring'
import { configOAtuh } from '../oAuth/constant'
import axios from 'axios'
import { get } from 'lodash'

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly loggers = new Logger(AuthService.name)

  constructor(
    private readonly repos: PrismaService, // private jwtService: JwtService, // @InjectRedis() private readonly redis: Redis,
  ) {}
  onModuleInit() {}

  async signInOAuth(code: string): Promise<common.Token> {
    const logctx = logContext(AuthService, this.signInOAuth)
    if (!code) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    const data = qs.stringify({
      client_id: configOAtuh.clientId,
      client_secret: configOAtuh.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: configOAtuh.redirectUrl,
    })

    this.loggers.debug({ data }, logctx)
    try {
      const { data: dataOAuth } = await axios.post(configOAtuh.tokenUrl, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      this.loggers.debug({ dataOAuth }, logctx)

      const tokenDecode = jwt.decode(dataOAuth.id_token) as any
      this.loggers.debug({ tokenDecode }, logctx)
      await this.revokeToken(dataOAuth.access_token, dataOAuth.refresh_token)
      const userFirst = await this.repos.users.findUnique({
        where: {
          email: tokenDecode.email,
        },
        select: {
          id: true,
          isRegistered: true,
          deleted: true,
        },
      })
      this.loggers.debug({ userFirst }, logctx)
      if (!userFirst?.id || userFirst.deleted) {
        throw new HttpException('Unauthorized No Access', HttpStatus.UNAUTHORIZED)
      }

      await this.repos.users.update({
        where: {
          id: userFirst.id,
        },
        data: {
          username: tokenDecode.name,
          isRegistered: true,
          picture: tokenDecode.picture,
        },
      })

      const user = await this.repos.users.findUnique({
        where: {
          email: tokenDecode.email,
        },
        select: {
          id: true,
          username: true,
          password: true,
          shopsId: true,
          isRegistered: true,
          picture: true,
          shops: {
            select: {
              name: true,
            },
          },
          deviceId: true,
          groups: {
            select: {
              id: true,
              name: true,
              groupFunctions: {
                select: {
                  functions: {
                    select: {
                      name: true,
                    },
                  },
                  create: true,
                  view: true,
                  update: true,
                },
              },
            },
          },
        },
      })
      return await this.genToken(logctx, user)
    } catch (error) {
      this.loggers.error(error, `[MarchERR] signInOAuth error`, logctx)
      throw new HttpException(
        get(error, 'message', 'Internal Error'),
        get(error, 'status', 500),
      )
    }
  }

  private async revokeToken(access_token: string, refresh_token: string) {
    const token = [access_token, refresh_token]
    try {
      token.forEach(async (e) => {
        const response = await axios.post(
          `${configOAtuh.revokeTokenUrl}?token=${e}`,
        )
      })
    } catch (error) {
      this.loggers.error(error, `[MarchERR] revokeToken error`)
    }
  }

  private async genToken(logctx: string, user: any) {
    const deviceId = uuidv4()
    this.loggers.debug({ deviceId, user }, logctx)
    const page = await this.addPage(user.groups.groupFunctions)
    const tasks = await this.addTask(user.groups.id, user.shopsId)
    const access_token = jwt.sign(
      {
        role: user.groups.name.split('|')[0].toUpperCase(),
        info: {
          functions: user.groups.groupFunctions.map((e) => e.functions.name),
          page: page,
          tasks: tasks,
        },
        deviceId,
        userId: user.id,
        shopsId: user.shopsId,
        shopName: user.shops.name,
        userName: user.username,
        picture: user.picture,
      },
      jwtToken.secret,
      {
        expiresIn: '1d',
      },
    )
    this.loggers.debug({ access_token }, logctx)
    const refresh_token = jwt.sign(
      { id: user.id, deviceId },
      jwtToken.refresh,
      {
        expiresIn: '7d',
      },
    )
    this.loggers.debug({ refresh_token: refresh_token.length }, logctx)
    //save refresh token to user.db
    await this.repos.users.update({
      where: { id: user.id },
      data: {
        deviceId,
        refreshToken: refresh_token,
      },
    })
    return {
      access_token,
      refresh_token,
      userId: user.id,
      username: user.username,
    }
  }

  async createUser(
    username: string,
    password: string,
  ): Promise<common.CreateResponse> {
    const logctx = logContext(AuthService, this.createUser)

    const check = await this.repos.users.findMany({
      where: {
        username,
      },
    })
    if (check.length > 0) {
      throw new HttpException('username already exists', 409)
    }

    const saltRounds = 10

    const hash = await bcrypt.hash(password, saltRounds)

    const result = await this.repos.users.create({
      data: {
        username,
        password: hash,
        role: '1', //ADMIN
        shopsId: '927b92eb-49a9-4de2-832c-b90203c5ad85',
        createdBy: 'system',
        updatedBy: 'system',
      },
    })

    this.loggers.debug({ hash }, logctx)
    return result as common.CreateResponse
  }

  async validLogin(username: string, password: string) {
    try {
      const checkLogin = await this.repos.users.findFirst({
        where: {
          username,
        },
        select: {
          id: true,
          username: true,
          password: true,
          shopsId: true,
          shops: {
            select: {
              name: true,
            },
          },
          deviceId: true,
          groups: {
            select: {
              id: true,
              name: true,
              groupFunctions: {
                select: {
                  functions: {
                    select: {
                      name: true,
                    },
                  },
                  create: true,
                  view: true,
                  update: true,
                },
              },
            },
          },
        },
      })
      this.loggers.debug({ valid: checkLogin }, 'tt')
      if (!checkLogin) {
        throw new HttpException('wrong username or password', 403)
      }
      const checkPassword = await bcrypt.compare(password, checkLogin?.password)

      if (!checkPassword) {
        throw new HttpException('wrong username or password', 403)
      }
      return checkLogin
    } catch (error) {
      throw new HttpException('wrong username or password', 403)
    }
  }

  addPage = async (groupFunctions: any) => {
    return groupFunctions.reduce((acc, item) => {
      const { functions, create, view, update } = item
      const { name } = functions

      const values = []
      if (create) values.push('CREATE')
      if (view) values.push('VIEW')
      if (update) values.push('UPDATE')

      acc[name] = values

      return acc
    }, {})
  }

  async addTask(groupId: string, shopsId: string) {
    const logctx = logContext(AuthService, this.addTask)
    this.loggers.debug({ shopsId, groupId }, logctx)
    try {
      const taskList = await this.repos.groupTasks.findMany({
        where: {
          groupId,
          shopsId,
        },
        select: {
          tasks: true,
        },
      })
      this.loggers.debug({ taskList }, logctx)
      const tasks = taskList.map((t) => {
        return t.tasks.name
      })
      this.loggers.debug({ tasks }, logctx)
      return tasks
    } catch (error) {
      this.loggers.error({ error }, logctx)
      throw new HttpException('Internal Server Error', 500)
    }
  }

  async login(username: string, password: string): Promise<common.Token> {
    const logctx = logContext(AuthService, this.login)
    try {
      const user = await this.validLogin(username, password)
      this.loggers.debug({ valid: user }, logctx)
      return await this.genToken(logctx, user)
    } catch (error) {
      this.loggers.debug(error, logctx)
      throw new HttpException('wrong username or password', 403)
    }
  }

  async tokenExpire(refreshToken: string): Promise<common.Token> {
    const logctx = logContext(AuthService, this.tokenExpire)
    try {
      const verifyRefresh = jwt.verify(refreshToken, jwtToken.refresh)
      const { id, deviceId }: any = jwt.decode(refreshToken)
      const getDataAccess = await this.repos.users.findUnique({
        where: { id },
        select: {
          role: true,
          id: true,
          username: true,
          refreshToken: true,
          deviceId: true,
          picture: true,
          shopsId: true,
          shops: {
            select: {
              name: true,
            },
          },
          groups: {
            select: {
              id: true,
              name: true,
              groupFunctions: {
                select: {
                  functions: {
                    select: {
                      name: true,
                    },
                  },
                  create: true,
                  view: true,
                  update: true,
                },
              },
            },
          },
        },
      })
      this.loggers.debug({ getDataAccess, verifyRefresh }, logctx)

      if (
        getDataAccess.refreshToken !== refreshToken ||
        getDataAccess.deviceId !== deviceId
      ) {
        await this.repos.users.update({
          where: {
            id: id,
          },
          data: {
            deviceId: null,
          },
        })
        throw new HttpException('Unauthorized', 401)
      }
      //check user.db db.refreshtoken === refreshToken ? else logout
      //add check user deleted?
      const page = await this.addPage(getDataAccess.groups.groupFunctions)
      const tasks = await this.addTask(
        getDataAccess.groups.id,
        getDataAccess.shopsId,
      )
      const access_token = jwt.sign(
        {
          role: getDataAccess.groups.name.split('|')[0].toUpperCase(),
          info: {
            functions: getDataAccess.groups.groupFunctions.map(
              (e) => e.functions.name,
            ),
            page,
            tasks,
          },
          picture: getDataAccess.picture,
          deviceId: getDataAccess.deviceId,
          userId: getDataAccess.id,
          shopsId: getDataAccess.shopsId,
          shopName: getDataAccess.shops.name,
          userName: getDataAccess.username,
        },
        jwtToken.secret,
        {
          expiresIn: '1d',
        },
      )
      this.loggers.debug({ refreshToken, verifyRefresh, id }, logctx)

      // await this.repos.users.update({
      //   where: { id: getDataAccess.id },
      //   data: {
      //     deviceId,
      //   },
      // })
      return { access_token }
    } catch (error) {
      throw new HttpException('Unauthorized', 401)
    }
  }

  async signOut(
    userId: string,
    access_token: string,
  ): Promise<common.SignOutResponse> {
    const logctx = logContext(AuthService, this.signOut)
    try {
      //TODO set blacklist refreshToken redis
      const decode: any = jwt.decode(access_token)
      // const tokenExpire = decode?.exp
      // const token_key = `bl_${access_token}`
      // await this.redis.set(token_key, access_token)
      // await this.redis.expireat(token_key, tokenExpire)
      const deleteRefresh = await this.repos.users.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken: null,
          deviceId: null,
        },
        select: {
          id: true,
        },
      })
      this.loggers.debug({ deleteRefresh, decode }, logctx)
      return {
        id: deleteRefresh.id,
      }
    } catch (error) {
      throw new HttpException('Internal Server Error', 500)
    }
  }

  async testRedis(): Promise<String> {
    // await this.redis.set('key', 'Redis data!')
    // const redisData = await this.redis.get('key')
    // await this.redisService.getRedis()
    // this.redis.expireat()
    return (Math.floor(new Date().getTime() / 1000.0) + 30).toString()
  }

  async verifyAccessToken(
    token: string,
  ): Promise<common.VerifyAccessTokenResponse> {
    const logctx = logContext(AuthService, this.verifyAccessToken)
    try {
      const verify = jwt.verify(token, jwtToken.secret)
      this.loggers.debug({ verify }, 'verify success', logctx)
      return {
        success: true,
      }
    } catch (error) {
      this.loggers.debug({ error }, 'verify failed', logctx)
      return {
        success: false,
      }
    }
  }
}
