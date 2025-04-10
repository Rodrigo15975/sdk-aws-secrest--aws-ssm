import { Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateSecretCommand,
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'
import { fromIni } from '@aws-sdk/credential-provider-ini'

type Secrets = Record<string, string>

type TypeCommand = 'create' | 'put'

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
  private typeCommandCreate(type: TypeCommand) {
    if (type === 'put') {
      return new PutSecretValueCommand({
        SecretId: 'test',
        SecretString: JSON.stringify({
          username: 'admin',
          password: 'admin',
        }),
      })
    }
  }
  private typeCommandFunction() {}

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
