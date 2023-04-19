import { Module } from '@nestjs/common'
import { AuthModule } from './authguard/auth.module'

@Module({
  imports: [AuthModule],
})
export class ServicesModule {}
