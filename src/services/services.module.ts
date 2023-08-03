import { Module } from '@nestjs/common'
import { AuthModule } from './authguard/auth.module'
import { UamModule } from './authUam/uam.module'

@Module({
  imports: [AuthModule, UamModule],
})
export class ServicesModule {}
