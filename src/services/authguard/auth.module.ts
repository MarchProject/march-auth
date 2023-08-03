import { Module } from '@nestjs/common'
import { AuthResolver } from './auth.resolver'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { AuthService } from './auth.service'
@Module({
  // imports: [
  //   RedisModule.forRoot({
  //     config: {
  //       url: 'redis://0.0.0.0:6379',
  //       password: 'mypassword',
  //     },
  //   }),
  // ],
  // imports: [
  //   PassportModule.register({ defaultStrategy: 'jwt' }),
  //   JwtModule.register({
  //     secret: jwtToken.secret,
  //     signOptions: { expiresIn: '3600' },
  //   }),
  // ],
  // imports: [UserAuthGuard],
  controllers: [],
  providers: [
    AuthResolver,
    PrismaService,
    AuthService,
  ],
})
export class AuthModule {}
