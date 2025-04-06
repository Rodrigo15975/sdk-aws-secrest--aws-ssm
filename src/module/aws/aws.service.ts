import { Injectable, NotFoundException } from '@nestjs/common'
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'

type Secrets = Record<string, string>

@Injectable()
export class AwsService {
  private readonly secretsManagerClient = new SecretsManagerClient({
    region: 'us-east-1',
  })

  async getSecretManager(secretId: string): Promise<Secrets> {
    return await this.createCommandGetSecret(secretId)
  }
  private async createCommandGetSecret(SecretId: string) {
    const command = new GetSecretValueCommand({
      SecretId,
      VersionStage: 'AWSCURRENT',
    })
    const response = await this.secretsManagerClient.send(command)
    if (response.SecretString)
      return JSON.parse(response.SecretString) as Secrets
    throw new NotFoundException('Secret not found')
  }
}
