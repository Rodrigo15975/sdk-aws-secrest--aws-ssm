import { Logger, Module } from '@nestjs/common'
import { AwsModule } from './module/aws/aws.module'
import { AwsService } from './module/aws/aws.service'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './module/users/users.module'
import { PrismaModule } from 'nestjs-prisma'

@Module({
  imports: [
    AwsModule,
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private readonly awsService: AwsService) {}

  async onModuleInit() {
    const secrets = await this.awsService.getSecretManager(
      'nestjs-db-credentials',
    )
    for (const [key, value] of Object.entries(secrets)) {
      if (!process.env[key]) {
        process.env[key] = value
        Logger.debug('Assigning secret: ' + key + ' = ' + value)
      } else {
        Logger.debug('Secret already assigned: ' + key + ' = ' + value)
        process.env[key] = value
      }
    }
  }
}
