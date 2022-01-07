import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
  ) {
    const { user } = userData;
    return this.authService.register(user);
  }

  // Authentication
  @Post('users/login')
  async login(
    @Body()
    userData: {
      user: { email: string; password: string };
    },
  ) {
    const { user } = userData;
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('articles')
  getProfile(@Request() req) {
    return req.user;
  }
}
