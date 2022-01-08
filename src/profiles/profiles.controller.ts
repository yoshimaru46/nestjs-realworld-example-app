import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileRO } from 'src/profiles/profiles.interface';
import { ProfilesService } from 'src/profiles/profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Get(':username')
  async getProfile(
    @Request() req,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    const { userId } = req.user;
    return await this.profileService.findProfile(userId, username);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':username/follow')
  @HttpCode(200)
  async follow(
    @Request() req,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    const { userId } = req.user;
    return await this.profileService.follow(userId, username);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username/follow')
  async unFollow(
    @Request() req,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    const { userId } = req.user;
    return await this.profileService.unFollow(userId, username);
  }
}
