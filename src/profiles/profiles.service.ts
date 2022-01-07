import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

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
}
