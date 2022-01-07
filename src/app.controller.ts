import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root(): string {
    return 'Hello World!';
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('articles')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
