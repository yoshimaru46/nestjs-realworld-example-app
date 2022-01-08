import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    const res = await this.prisma.tag.findMany();
    const tags = res.map((t: Tag) => t.name);
    return { tags };
  }
}
