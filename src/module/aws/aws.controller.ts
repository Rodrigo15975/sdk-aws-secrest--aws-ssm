import { Controller, Get, Param, Query } from '@nestjs/common'
import { AwsService } from './aws.service'

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Get('secret/:secretId')
  async getSecret(@Param('secretId') secretId: string) {
    const secrets = await this.awsService.getSecretManager(secretId)
    console.log({
      secrets,
    })
    return secrets
  }
  @Get('createSecret')
  async createSecret(@Query('secretId') secretId: string) {
    const secrets = await this.awsService.createSecretManager(secretId)
    console.log({
      secrets,
    })
    return secrets
  }
}
