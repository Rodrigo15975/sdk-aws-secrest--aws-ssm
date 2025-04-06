import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'nestjs-prisma'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        name: 'Ready',
        profile: {
          connectOrCreate: {
            create: {},
            where: {
              user_id: '',
            },
          },
        },
      },
    })
  }

  findAll() {
    console.log(this.configService.get('DB_USER'))
    console.log(this.configService.get('DB_PASSWORD'))
    return this.prismaService.user.create({
      data: {
        name: 'Rodrigo',
      },
      include: {
        profile: true,
      },
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
