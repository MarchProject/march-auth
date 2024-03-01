import { Controller, UseGuards, Request, Body, Post } from '@nestjs/common'
import { UamService } from './uam.service'
import { DiviceGuard } from './device.guard'

@Controller('auth')
export class UamController {
  constructor(private readonly uamService: UamService) {}

  @UseGuards(DiviceGuard)
  @Post('diviceId')
  async getDiviceId(@Request() req, @Body() body: any): Promise<any> {
    const userId = req?.userId
    const deviceId = await this.uamService.getDiviceId(userId)
    const scopes = await this.uamService.getScopes(body)
    return {
      deviceId: deviceId,
      scopes: scopes,
    }
  }

  @Post('createNewUam')
  async createScopesApis(): Promise<any> {
    return await this.uamService.createNewUam()
  }

  @Post('createUserStarter')
  async createUserStarter(@Body() body: any): Promise<any> {
    return await this.uamService.createUserStarter({
      shopName: body.data.shopName,
      descriptionShop: body.data.descriptionShop,
      createdBy: body.data.createdBy,
      email: body.data.email,
    })
  }

  @Post('updateRoleSuperAdmin')
  async updateRoleSuperAdmin(@Body() body: any): Promise<any> {
    return await this.uamService.updateRoleSuperAdmin()
  }

  // @Post('createUserAccess')
  // async createUserAccessOauth(@Body() body: any): Promise<any> {
  //   return await this.uamService.createUserAccess({
  //     shopName: body.data.shopName,
  //     descriptionShop: body.data.descriptionShop,
  //     createdBy: body.data.createdBy,
  //     username: body.data.username,
  //   })
  // }
}
