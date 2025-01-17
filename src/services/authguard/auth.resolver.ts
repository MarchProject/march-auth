import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { Inject, Logger, UseGuards } from '@nestjs/common'
import { logContext } from 'src/common/helpers/log'
import * as common from 'src/types'
import { AuthService } from './auth.service'
import { UserAuthGuard, uam } from '@march/core'

@Resolver()
export class AuthResolver {
  private readonly loggers = new Logger(AuthResolver.name)

  constructor() {}
  @Inject(AuthService) private authService: AuthService
  // @InjectRedis() private readonly redis: Redis

  @Mutation(() => common.Token, { name: 'signIn' })
  async signIn(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<common.Token> {
    const logctx = logContext(AuthResolver, this.signIn)
    const user = 'name'
    this.loggers.debug({ user, username }, logctx)

    return await this.authService.login(username, password)
  }

  @Mutation(() => common.Token, { name: 'signInOAuth' })
  async signInOAuth(@Args('code') code: string): Promise<common.Token> {
    const logctx = logContext(AuthResolver, this.signInOAuth)
    const user = 'name'
    this.loggers.debug({ user, code }, logctx)

    return await this.authService.signInOAuth(code)
  }

  @Mutation(() => common.Token, { name: 'tokenExpire' })
  async tokenExpire(
    @Args('refreshToken') refreshToken: string,
  ): Promise<common.Token> {
    const logctx = logContext(AuthResolver, this.tokenExpire)

    this.loggers.debug({}, logctx)

    return await this.authService.tokenExpire(refreshToken)
  }

  // @UseGuards(new UserAuthGuard(uam.AnyAdminScope))
  @Mutation(() => common.CreateResponse, { name: 'createUser' })
  async createUser(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<common.CreateResponse> {
    const logctx = logContext(AuthResolver, this.createUser)
    const user = 'name'
    this.loggers.debug({ user, username }, logctx)
    const result = await this.authService.createUser(username, password)
    return result
  }

  @UseGuards(new UserAuthGuard(uam.AnyAdminScope))
  @Mutation(() => String, { name: 'redis' })
  async TestRedis(@Args('test') test: string): Promise<String> {
    const logctx = logContext(AuthResolver, this.TestRedis)
    const user = 'hi'
    // await this.redis.set('key2', 'Redis data!')
    this.loggers.debug({ test }, logctx)

    // return await this.authService.testRedis()

    return '123'
  }

  @UseGuards(new UserAuthGuard(uam.AnyAdminScope))
  @Mutation(() => String, { name: 'signOut' })
  async signOut(
    @Args('id') id: string,
    @Context('request') req,
  ): Promise<common.SignOutResponse> {
    const logctx = logContext(AuthResolver, this.signOut)
    //set blacklist refreshToken redis
    const access_token = req.headers.authorization
    this.loggers.debug({ id, access_token }, logctx)

    return await this.authService.signOut(id, access_token)
  }

  @UseGuards(new UserAuthGuard(uam.AnyAdminScope))
  @Mutation(() => String, { name: 'verifyAccessToken' })
  async verifyAccessToken(
    @Args('token') token: string,
  ): Promise<common.VerifyAccessTokenResponse> {
    const logctx = logContext(AuthResolver, this.verifyAccessToken)

    this.loggers.debug({ token }, logctx)

    return await this.authService.verifyAccessToken(token)
  }
}
