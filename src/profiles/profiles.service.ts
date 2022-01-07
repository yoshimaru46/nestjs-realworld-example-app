import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProfileRO } from 'src/profiles/profiles.interface';

const profileSelect = {
  username: true,
  bio: true,
  image: true,
  id: true,
};

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findProfile(userId: number, username: string): Promise<any> {
    const followed = await this.prisma.user.findUnique({
      where: { username },
      select: profileSelect,
    });

    if (!followed) {
      throw new HttpException(
        { errors: { user: 'not found' } },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const meFollowing = await this.prisma.user.findMany({
      where: {
        AND: [
          {
            id: followed.id,
          },
          {
            followedBy: {
              some: { id: +userId },
            },
          },
        ],
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = followed;
    const profile = {
      ...rest,
      following: Array.isArray(meFollowing) && meFollowing.length > 0,
    };

    return { profile };
  }

  async follow(userId: string, username: string): Promise<any> {
    if (!username) {
      throw new HttpException(
        'Follower username not provided.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const followed = await this.prisma.user.findUnique({
      where: { username },
      select: profileSelect,
    });

    if (!followed) {
      throw new HttpException(
        'User to follow not found.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.user.update({
      where: { id: +userId },
      data: {
        following: {
          connect: {
            id: followed.id,
          },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = followed;
    const profile = {
      ...rest,
      following: true,
    };

    return { profile };
  }

  async unFollow(userId: number, username: string): Promise<ProfileRO> {
    if (!username) {
      throw new HttpException(
        'Follower username not provided.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const followed = await this.prisma.user.findUnique({
      where: { username },
      select: profileSelect,
    });

    if (!followed) {
      throw new HttpException(
        'User to follow not found.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.user.update({
      where: { id: +userId },
      data: {
        following: {
          disconnect: {
            id: followed.id,
          },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = followed;
    const profile = {
      ...rest,
      following: false,
    };

    return { profile };
  }
}
