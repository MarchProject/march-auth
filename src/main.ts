import { NestFactory } from '@nestjs/core'
import { json, urlencoded } from 'express'
import { AppModule } from './app.module'
import { CorsOptions } from 'apollo-server-express'
import { ConfigService } from '@march/core'
// import { graphqlUploadExpress } from 'graphql-upload'
const config = ConfigService.load()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))
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
