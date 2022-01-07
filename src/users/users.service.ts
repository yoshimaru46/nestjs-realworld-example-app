import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    userWhereInput: Prisma.UserWhereInput,
  ): Promise<LoginUserDto | undefined> {
    const user = await this.prisma.user.findFirst({
      where: userWhereInput,
    });
    return {
      ...user,
      image: 'TODO', // TODO
      token: null,
    };
  }

  async createUser(data: Prisma.UserCreateInput): Promise<RegisterUserDto> {
    const user = await this.prisma.user.create({
      data,
    });

    return {
      ...user,
      image: null,
      token: null,
    };
  }
}
