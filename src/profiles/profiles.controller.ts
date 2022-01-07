import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileRO } from 'src/profiles/profiles.interface';
import { ProfilesService } from 'src/profiles/profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getProfile(
    @Request() req,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    const { userId } = req.user;
    return await this.profileService.findProfile(userId, username);
  }
}
