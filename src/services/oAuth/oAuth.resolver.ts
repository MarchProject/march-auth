import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { Inject, Logger, UseGuards } from '@nestjs/common'
import { logContext } from 'src/common/helpers/log'
import * as common from 'src/types'
import { UserAuthGuard, uamAuthRole } from '@march/core'
import { OAuthService } from './oAuth.service'

@Resolver()
export class OAuthResolver {
  private readonly loggers = new Logger(OAuthResolver.name)

  constructor() {}
  @Inject(OAuthService) private oAuthService: OAuthService

  @Mutation(() => String, { name: 'oAuthUrl' })
  async oAuthUrl(): Promise<string> {
    const logctx = logContext(OAuthResolver, this.oAuthUrl)
    const user = 'name'
    this.loggers.debug({ user }, logctx)

    return await this.oAuthService.oAuthUrl()
  }
}
