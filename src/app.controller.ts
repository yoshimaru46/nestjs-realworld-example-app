import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  // Registration
  @Post('users')
  async register(
    @Body()
    userData: {
      user: { username: string; email: string; password: string };
    },
  ): Promise<User> {
    const { user } = userData;
    return this.authService.register(user);
  }

  // Authentication
  @UseGuards(LocalAuthGuard)
  @Post('users/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('articles')
  getProfile(@Request() req) {
    return req.user;
  }
}
