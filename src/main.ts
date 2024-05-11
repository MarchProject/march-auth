import { NestFactory } from '@nestjs/core'
import { json, urlencoded } from 'express'
import { AppModule } from './app.module'
import { CorsOptions } from 'apollo-server-express'
import { ConfigService, authGrpcPackageName, authProtoPath } from '@march/core'
import { GrpcOptions, Transport } from '@nestjs/microservices'
// import { graphqlUploadExpress } from 'graphql-upload'
const config = ConfigService.load()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const grpcUrl = `0.0.0.0:${config.auth.grpc.port}`
  const grpcServer = app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      url: grpcUrl,
      package: [authGrpcPackageName],
      protoPath: [authProtoPath],
    },
  })
  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))
  console.log({
    grpcServer,
    grpcUrl,
  })
  await grpcServer.listen()
  // app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))
  const options: CorsOptions = {
    origin: 'http://0.0.1.0:3500',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    optionsSuccessStatus: 204,
    credentials: true,
  }
  app.enableCors(options)

  await app.listen(config.auth.rest.port)
  console.log(`Application is running on: ${await app.getUrl()}`)
  const url = `http://0.0.0.0:${config.auth.rest.port}/graphql`
  console.log(url)
}
bootstrap()
