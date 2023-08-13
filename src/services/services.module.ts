import { Module } from '@nestjs/common'
import { AuthModule } from './authguard/auth.module'
import { UamModule } from './authUam/uam.module'
import { OAuthModule } from './oAuth/oAuth.module'

@Module({
  imports: [AuthModule, UamModule, OAuthModule],
})
export class ServicesModule {}
