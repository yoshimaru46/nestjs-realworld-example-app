import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/users.decorator';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Get()
  root(): string {
    return 'Hello World!';
  }

  // Authentication
  @UseGuards(LocalAuthGuard)
  @Post('users/login')
  async login(@User() user: { email: string; password: string }) {
    return this.authService.login(user);
  }
}
