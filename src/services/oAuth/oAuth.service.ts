import { HttpException, Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { logContext } from 'src/common/helpers/log'
import * as common from 'src/types'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { authParams, configOAtuh } from './constant'

@Injectable()
export class OAuthService implements OnModuleInit {
  private readonly loggers = new Logger(OAuthService.name)

  constructor(
    private readonly repos: PrismaService, // private jwtService: JwtService, // @InjectRedis() private readonly redis: Redis,
  ) {}
  onModuleInit() {}

  async oAuthUrl(): Promise<string> {
    const logctx = logContext(OAuthService, this.oAuthUrl)
    const url = `${configOAtuh.authUrl}?${authParams}`
    this.loggers.debug({ url }, logctx)
    return url
  }
}
