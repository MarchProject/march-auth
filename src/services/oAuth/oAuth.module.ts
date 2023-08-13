import { Module } from '@nestjs/common'
import { GoogleStrategy } from './google.strategy'
import { OAuthService } from './oAuth.service'
import { OAuthResolver } from './oAuth.resolver'
import { PrismaService } from 'src/common/prisma/prisma.service'

@Module({
  imports: [],
  controllers: [],
  providers: [OAuthService, GoogleStrategy, OAuthResolver, PrismaService],
})
export class OAuthModule {}
