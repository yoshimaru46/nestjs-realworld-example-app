import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UserRO } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  // Registration
  @Post('')
  async create(
    @Body('user')
    userData: CreateUserDto,
  ) {
    return this.userService.create(userData);
  }

  // Authentication
  @Post('/login')
  async login(
    @Body('user')
    loginUserDto: LoginUserDto,
  ): Promise<UserRO> {
    return this.userService.login(loginUserDto);
  }
}
