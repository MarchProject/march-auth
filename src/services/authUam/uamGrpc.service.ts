import { Metadata } from '@grpc/grpc-js'
import { GrpcAuthGuard, logContext } from '@march/core'
import {
  Controller,
  Injectable,
  Logger,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { auth } from 'src/types/grpc/proto/auth'
// import { GrpcAuthGuard } from './grpc.guard'

@Injectable()
@Controller()
export class AuthGrpcService implements OnModuleInit {
  private readonly loggers = new Logger(AuthGrpcService.name)

  constructor(private readonly repos: PrismaService) {}
  onModuleInit() {}

  // @UseGuards(GrpcAuthGuard)
  @GrpcMethod(AuthGrpcService.name, 'createSubUser')
  async createSubUser(
    data: auth.CreateSubUserRequest,
    metadata: Metadata,
  ): Promise<auth.CreateSubUserResponse> {
    const logctx = logContext(AuthGrpcService, this.createSubUser)
    this.loggers.debug({ data, metadata: metadata.getMap() }, logctx)

    try {
      const group = await this.repos.groups.findUnique({
        where: {
          id: data.role,
        },
      })

      const shop = await this.repos.shops.findUnique({
        where: {
          id: data.shopId,
        },
      })

      if (group && shop) {
        const create = await this.repos.users.create({
          data: {
            shopsId: shop.id,
            email: data.email,
            username: data.username,
            role: group.id,
            createdBy: data.userId,
            updatedBy: data.userId,
          },
        })

        return {
          id: create.id,
        }
      } else {
        return {
          id: null,
        }
      }
    } catch (error) {
      return {
        id: null,
      }
    }
  }

  @GrpcMethod(AuthGrpcService.name, 'getPermission')
  async getPermission(
    req: auth.GetPermissionrRequest,
    metadata: Metadata,
  ): Promise<auth.GetPermissionResponse> {
    const shop = await this.repos.shops.findUnique({
      where: {
        id: req.shopsId,
      },
      include: {
        groups: {
          include: {
            groupFunctions: true,
            groupTasks: true,
          },
        },
        users: {
          select: {
            id: true,
            role: true,
            shopsId: true,
            username: true,
            email: true,
            picture: true,
            createdBy: true,
          },
        },
      },
    })

    const functions = await this.repos.functions.findMany()
    const tasks = await this.repos.tasks.findMany()
    return { shop, functions, tasks } as unknown as auth.GetPermissionResponse
  }
}