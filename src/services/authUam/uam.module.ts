import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { UamService } from './uam.service'
import { UamController } from './uam.controller'
import { DiviceGuard } from './device.guard'
import { AuthGrpcService } from './uamGrpc.service'

@Module({
  controllers: [UamController, AuthGrpcService],
  providers: [PrismaService, UamService, DiviceGuard],
})
export class UamModule {}
