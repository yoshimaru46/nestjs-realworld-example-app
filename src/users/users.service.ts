import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UserRO } from 'src/users/users.interface';

const select = {
  email: true,
  username: true,
  bio: true,
  // image: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(payload: LoginUserDto): Promise<any> {
    const _user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    const errors = { User: 'email or password wrong' };

    if (!_user) {
      throw new HttpException({ errors }, 401);
    }

    const authenticated = _user.password === payload.password;

    if (!authenticated) {
      throw new HttpException({ errors }, 401);
    }

    const token = this.jwtService.sign({ sub: _user.id, email: _user.email });

    // delete password
    const { password, ...user } = _user;

    return {
      user: { token, ...user },
    };
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    const { username, email, password } = dto;

    // check uniqueness of username/email
    const userNotUnique = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userNotUnique) {
      const errors = { username: 'Username and email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = {
      username,
      email,
      password, // TODO make hashed
    };
    const user = await this.prisma.user.create({ data, select });

    return { user };
  }
}
