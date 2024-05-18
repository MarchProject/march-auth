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
        const user = await this.repos.users.findUnique({
          where: {
            email: data.email,
          },
        })

        if (user && !user.deleted) {
          return {
            id: null,
          }
        }

        if (user && user.deleted) {
          const updateUser = await this.repos.users.update({
            where: {
              id: user.id,
            },
            data: {
              deleted: false,
              username: user.username
                .replace('removed_', '')
                .replace('revoked_', ''),
            },
          })

          return {
            id: updateUser.id,
          }
        }

        const create = await this.repos.users.create({
          data: {
            shopsId: shop.id,
            email: data.email,
            username: data.username,
            isRegistered: false,
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

  @GrpcMethod(AuthGrpcService.name, 'revokeSubUser')
  async revokeSubUser(
    data: auth.RemoveSubUserRequest,
    metadata: Metadata,
  ): Promise<auth.CreateSubUserResponse> {
    const logctx = logContext(AuthGrpcService, this.revokeSubUser)
    this.loggers.debug({ data, metadata: metadata.getMap() }, logctx)

    try {
      const user = await this.repos.users.findUnique({
        where: { id: data.userId },
      })

      if (user.isRegistered || user.deleted) {
        return {
          id: null,
        }
      }

      if (user && !user.isSuperAdmin) {
        const revoked = await this.repos.users.update({
          where: {
            id: user.id,
          },
          data: {
            deleted: true,
            username: 'revoked_' + user.username,
            isRegistered: false,
            updatedBy: data.updatedBy,
          },
        })

        return {
          id: revoked.id,
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

  @GrpcMethod(AuthGrpcService.name, 'removeSubUser')
  async removeSubUser(
    data: auth.RemoveSubUserRequest,
    metadata: Metadata,
  ): Promise<auth.CreateSubUserResponse> {
    const logctx = logContext(AuthGrpcService, this.removeSubUser)
    this.loggers.debug({ data, metadata: metadata.getMap() }, logctx)

    try {
      const user = await this.repos.users.findUnique({
        where: { id: data.userId },
      })

      if (!user.isRegistered || user.deleted) {
        return {
          id: null,
        }
      }

      if (user && !user.isSuperAdmin) {
        const removed = await this.repos.users.update({
          where: {
            id: user.id,
          },
          data: {
            username: 'removed_' + user.username,
            deleted: true,
            isRegistered: false,
            deviceId: null,
            updatedBy: data.updatedBy,
          },
        })

        return {
          id: removed.id,
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

  @GrpcMethod(AuthGrpcService.name, 'updateRoleUser')
  async updateRoleUser(
    input: auth.UpdateRoleUserRequest,
    metadata: Metadata,
  ): Promise<auth.CreateSubUserResponse> {
    const logctx = logContext(AuthGrpcService, this.updateRoleUser)

    this.loggers.debug({ input, metadata: metadata.getMap() }, logctx)

    try {
      const user = await this.repos.users.findUnique({
        where: {
          id: input.userId,
        },
      })

      const role = await this.repos.groups.findUnique({
        where: {
          id: input.role,
        },
      })

      if (
        !user ||
        user.isSuperAdmin ||
        user.deleted ||
        !user.isRegistered ||
        !role ||
        role?.name?.split('|')[0] === 'SuperAdmin'
      ) {
        return {
          id: null,
        }
      }

      if (role.shopsId !== user.shopsId) {
        return {
          id: null,
        }
      }

      const updated = await this.repos.users.update({
        where: {
          id: input.userId,
        },
        data: {
          role: input.role,
        },
      })

      return {
        id: updated.id,
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
          where: {
            deleted: false,
          },
          select: {
            id: true,
            role: true,
            shopsId: true,
            username: true,
            isSuperAdmin: true,
            isRegistered: true,
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
