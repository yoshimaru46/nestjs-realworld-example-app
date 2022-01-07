import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/users.decorator';
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

  // Get Current User
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async findMe(@User() user): Promise<UserRO> {
    return await this.userService.findByEmail(user.email);
  }

  // Update User
  @UseGuards(JwtAuthGuard)
  @Put('user')
  async update(@User() user, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(user.userId, userData);
  }
}
