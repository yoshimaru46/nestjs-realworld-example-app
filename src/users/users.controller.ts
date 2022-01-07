import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UserRO } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Controller('')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  // Registration
  @Post('users')
  async create(
    @Body('user')
    userData: CreateUserDto,
  ) {
    return this.userService.create(userData);
  }

  // Authentication
  @Post('users/login')
  async login(
    @Body('user')
    loginUserDto: LoginUserDto,
  ): Promise<UserRO> {
    return this.userService.login(loginUserDto);
  }

  // Get Current User
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async findMe(@Request() req): Promise<UserRO> {
    console.log('req.user', req.user);
    return await this.userService.findByEmail(req.user.email);
  }
}
