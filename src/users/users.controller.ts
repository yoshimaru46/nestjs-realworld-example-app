import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
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
  async findMe(@Request() req): Promise<UserRO> {
    return await this.userService.findByEmail(req.user.email);
  }

  // Update User
  @UseGuards(JwtAuthGuard)
  @Put('user')
  async update(@Request() req, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(req.user.userId, userData);
  }
}
