import { HttpException, Injectable, OnModuleInit } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { logContext } from 'src/common/helpers/log'
import { scopesApisList } from './scope/scopesApis'
import { taskList } from './scope/taskLists'
import { apiTasksList } from './scope/apiTask'
import { authGuard } from './scope/authGruardApi'
import { functionMarch } from './scope/functions'

@Injectable()
export class UamService implements OnModuleInit {
  private readonly loggers = new Logger(UamService.name)

  constructor(private readonly repos: PrismaService) {}
  onModuleInit() {}

  async getDiviceId(userId: string): Promise<String> {
    const logctx = logContext(UamService, this.getDiviceId)
    try {
      const { deviceId } = await this.repos.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          deviceId: true,
        },
      })
      this.loggers.debug({ deviceId }, logctx)
      return deviceId
    } catch (error) {
      throw new HttpException('Internal Server Error', 500)
    }
  }

  async getScopes(body: any): Promise<string[]> {
    const logctx = logContext(UamService, this.getScopes)
    const scopeList = await this.repos.authGuardApis.findUnique({
      where: {
        name: body.data.method,
      },
      select: {
        scopesApis: {
          select: {
            apiTasks: {
              select: {
                tasks: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    const scopes =
      scopeList?.scopesApis?.apiTasks.map((t) => t.tasks.name) ?? []
    this.loggers.debug({ services: body.data.method, scopes }, logctx)
    return scopes
  }

  async createScopesApis() {
    const logctx = logContext(UamService, this.createScopesApis)
    try {
      const scopesApisCreateMany = await this.repos.scopesApis.createMany({
        data: scopesApisList,
        skipDuplicates: true,
      })
      if (scopesApisCreateMany.count !== scopesApisList.length) {
        const cal =
          scopesApisList.length -
          (scopesApisList.length - scopesApisCreateMany.count)
        this.loggers.debug(
          `create skip duplicate scopesApis success:${cal}`,
          logctx,
        )
        return `skip: ${cal}`
      } else {
        this.loggers.debug(
          `create scopesApis success:${scopesApisCreateMany.count}`,
          logctx,
        )
        return `all: ${scopesApisCreateMany.count}`
      }
    } catch (error) {
      this.loggers.error({ error }, logctx)
    }
  }

  async createFunctions() {
    const logctx = logContext(UamService, this.createFunctions)
    await this.repos.functions.createMany({
      data: functionMarch,
      skipDuplicates: true,
    })
  }

  async createTasks() {
    const logctx = logContext(UamService, this.createScopesApis)
    try {
      taskList.map(async (e) => {
        const functionId = await this.repos.functions.findUnique({
          where: {
            name: e.functionName,
          },
        })
        const res = await this.repos.tasks.findUnique({
          where: {
            name: e.name,
          },
        })
        if (!res) {
          await this.repos.tasks.create({
            data: {
              name: e.name,
              description: e.description,
              functionId: functionId.id,
            },
          })
        }
      })
      return 'success'
    } catch (error) {}
  }

  async createApisTask() {
    const logctx = logContext(UamService, this.createScopesApis)
    try {
      apiTasksList.map(async (e) => {
        const scope = await this.repos.scopesApis.findUnique({
          where: {
            name: e.scopesName,
          },
        })
        const tasks = await this.repos.tasks.findMany({
          where: {
            name: {
              in: e.taskName,
            },
          },
        })

        tasks.map(async (e) => {
          await this.repos.apiTasks.createMany({
            data: {
              name: `${scope.name}_${e.name}_${scope.service}`,
              scopesApisId: scope.id,
              taskId: e.id,
            },
            skipDuplicates: true,
          })
        })
      })

      return 'pass'
    } catch (error) {}
  }

  async selectApitask() {
    const logctx = logContext(UamService, this.createScopesApis)
    try {
      const response = await this.repos.apiTasks.findMany({
        select: {
          id: true,
          scopesApis: {
            select: {
              id: true,
              name: true,
            },
          },
          tasks: {
            select: {
              name: true,
              description: true,
            },
          },
        },
      })
      return response
    } catch (error) {}
  }

  async createauthGuard() {
    const logctx = logContext(UamService, this.createScopesApis)
    try {
      authGuard.map(async (e) => {
        const scopeApis = await this.repos.scopesApis.findUnique({
          where: {
            name: e.scopesName,
          },
        })
        const authGuard = await this.repos.authGuardApis.findUnique({
          where: {
            name: e.name,
          },
        })
        if (!authGuard) {
          await this.repos.authGuardApis.create({
            data: {
              name: e.name,
              class: e.class,
              type: e.type === 'MUTATION' ? 'MUTATION' : 'QUERY',
              scopesApisId: scopeApis.id,
            },
          })
        }
      })
      return 'pass'
    } catch (error) {}
  }

  async createNewUam() {
    await this.createScopesApis()
    await this.createFunctions()
    await this.createTasks()

    await this.createauthGuard()
    await this.createApisTask()
  }

  async createUserAccess() {}

  async createUserStarter({ shopName, descriptionShop, createdBy, email }) {
    console.log({ shopName, descriptionShop, createdBy, email })
    //check Dup
    const shops = await this.repos.shops.findUnique({
      where: {
        name: shopName,
      },
    })
    if (shops) {
      throw new HttpException('duplicate', 400)
    }
    const createShop = await this.repos.shops.create({
      data: {
        name: shopName,
        description: descriptionShop,
        createdBy: createdBy,
        updatedBy: createdBy,
      },
      select: {
        id: true,
        name: true,
      },
    })

    const createGroup = await this.repos.groups.create({
      data: {
        name: 'SuperAdmin' + '|' + createShop.name,
        shopsId: createShop.id,
      },
      select: {
        id: true,
        name: true,
      },
    })

    const functions = await this.repos.functions.findMany()

    const mapFn = functions.map((f) => {
      return {
        name: createGroup.name + '_' + f.name,
        functionId: f.id,
        groupId: createGroup.id,
        create: true,
        view: true,
        update: true,
      }
    })

    const createGroupFunction = await this.repos.groupFunctions.createMany({
      data: mapFn,
      skipDuplicates: true,
    })

    const tasks = await this.repos.tasks.findMany()

    const mapTask = tasks.map((t) => {
      return {
        name: createGroup.name + '_' + t.name,
        groupId: createGroup.id,
        taskId: t.id,
        shopsId: createShop.id,
        createdBy: createdBy,
        updatedBy: createdBy,
      }
    })

    const createGroupTasks = await this.repos.groupTasks.createMany({
      data: mapTask,
      skipDuplicates: true,
    })
    const saltRounds = 10

    const hash = await bcrypt.hash('password', saltRounds)

    // const createUserAccessOauth = await this.repos.mailAccess.create({
    //   data: {
    //     email: email,
    //     role: createGroup.id,
    //     shopsId: createShop.id,
    //     isRegistered: false,
    //     createdBy: createdBy,
    //     updatedBy: createdBy,
    //   },
    // })

    const createUser = await this.repos.users.create({
      data: {
        role: createGroup.id,
        shopsId: createShop.id,
        username: email.split('@')[0],
        isRegistered: false,
        email: email,
        createdBy: createdBy,
        updatedBy: createdBy,
      },
    })
    return 'pass'
    //group_task_group_function
  }
}
