import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: Prisma.UserCreateInput) {
    const createdUser = await this.usersService.createUser(user);
    return {
      user: {
        ...createdUser,
        token: this.jwtService.sign(createdUser),
      },
    };
  }

  async login(user: Prisma.UserWhereInput) {
    const existingUser = await this.usersService.findOne(user);
    if (!existingUser) {
      throw new UnauthorizedException();
    }
    return {
      user: {
        ...existingUser,
        token: this.jwtService.sign(existingUser),
      },
    };
  }
}
