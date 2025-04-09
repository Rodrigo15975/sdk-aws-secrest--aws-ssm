import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  create() {
    return this.prismaService.user.create({
      data: {
        name: 'Ready',
      },
    })
  }

  findAll() {
    Logger.debug(this.configService.get('DB_USER'))
    console.log(this.configService.get('DB_PASSWORD'))
    return this.prismaService.user.create({
      data: {
        name: 'Rodrigo',
        profile: {
          connectOrCreate: {
            create: {},
            where: {
              user_id: '',
            },
          },
        },
      },
      include: {
        profile: true,
      },
    })
  }
}
