import {
  CreateSecretCommand,
  GetSecretValueCommand,
  ResourceNotFoundException,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'
import { fromIni } from '@aws-sdk/credential-provider-ini'
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

type Secrets = Record<string, string>

@Injectable()
export class AwsService {
  private readonly secretsManagerClient = new SecretsManagerClient({
    region: 'us-east-1',
    credentials: fromIni({ profile: 'default' }),
  })

  async getSecretManager(secretId: string): Promise<Secrets> {
    const command = new GetSecretValueCommand({
      SecretId: secretId,
      VersionStage: 'AWSCURRENT',
    })

    const result = await this.secretsManagerClient
      .send(command)
      .catch((error: ResourceNotFoundException) => {
        if (error.name === 'ResourceNotFoundException')
          throw new NotFoundException(`Secret "${secretId}" not found`)

        throw new InternalServerErrorException(
          'Error getting secret: ' + error.message,
        )
      })

    if (!result.SecretString) {
      throw new NotFoundException('Secret exists but is empty')
    }

    return JSON.parse(result.SecretString) as Secrets
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
