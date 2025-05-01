import {
  CreateSecretCommand,
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'
import { fromIni } from '@aws-sdk/credential-provider-ini'
import { Injectable, NotFoundException } from '@nestjs/common'

type Secrets = Record<string, string>

@Injectable()
export class AwsService {
  private readonly secretsManagerClient = new SecretsManagerClient({
    region: 'us-east-1',
    credentials: fromIni({ profile: 'create-only-user' }),
  })

  async getSecretManager(secretId: string): Promise<Secrets> {
    return await this.createCommandGetSecret(secretId)
  }

  async createSecretManager(secretId: string) {
    const command = new CreateSecretCommand({
      Name: secretId,
      SecretString: JSON.stringify({
        username: 'admin',
        password: 'admin',
      }),
    })
    const response = await this.secretsManagerClient.send(command)
    return response
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
