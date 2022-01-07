import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { CreateArticleDto } from 'src/articles/dto/create-article.dto';
import { PrismaService } from 'src/prisma.service';

const articleAuthorSelect = {
  email: true,
  username: true,
  bio: true,
  image: true,
  followedBy: { select: { id: true } },
};

const articleInclude = {
  author: { select: articleAuthorSelect },
  favoritedBy: { select: { id: true } },
};

// map dynamic value "following" (is the current user following this author)
const mapAuthorFollowing = (userId, { followedBy, ...rest }) => ({
  ...rest,
  following:
    Array.isArray(followedBy) && followedBy.map((f) => f.id).includes(userId),
});

// map dynamic values "following" and "favorited" (from favoritedBy)
const mapDynamicValues = (userId, { favoritedBy, author, ...rest }) => ({
  ...rest,
  favorited:
    Array.isArray(favoritedBy) && favoritedBy.map((f) => f.id).includes(userId),
  favoritesCount: Array.isArray(favoritedBy) ? favoritedBy.length : 0,
  author: mapAuthorFollowing(userId, author),
});

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  private buildFindAllQuery(
    query,
  ): Prisma.Enumerable<Prisma.ArticleWhereInput> {
    const queries = [];

    if ('tag' in query) {
      queries.push({
        tagList: {
          has: query.tag,
        },
      });
    }

    if ('author' in query) {
      queries.push({
        author: {
          username: {
            equals: query.author,
          },
        },
      });
    }

    if ('favorited' in query) {
      queries.push({
        favoritedBy: {
          some: {
            username: {
              equals: query.favorited,
            },
          },
        },
      });
    }

    return queries;
  }

  async findAll(userId: number, query): Promise<any> {
    const andQueries = this.buildFindAllQuery(query);
    let articles = await this.prisma.article.findMany({
      where: { AND: andQueries },
      orderBy: { createdAt: 'desc' },
      include: articleInclude,
      ...('limit' in query ? { take: +query.limit } : {}),
      ...('offset' in query ? { skip: +query.offset } : {}),
    });
    const articlesCount = await this.prisma.article.count({
      where: { AND: andQueries },
      orderBy: { createdAt: 'desc' },
    });

    articles = (articles as any).map((a) => mapDynamicValues(userId, a));

    return { articles, articlesCount };
  }

  async findFeed(userId: number, query): Promise<any> {
    const where = {
      author: {
        followedBy: { some: { id: +userId } },
      },
    };
    let articles = await this.prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: articleInclude,
      ...('limit' in query ? { take: +query.limit } : {}),
      ...('offset' in query ? { skip: +query.offset } : {}),
    });
    const articlesCount = await this.prisma.article.count({
      where,
      orderBy: { createdAt: 'desc' },
    });

    articles = (articles as any).map((a) => mapDynamicValues(userId, a));

    return { articles, articlesCount };
  }

  async create(userId: number, payload: CreateArticleDto): Promise<any> {
    const data = {
      ...payload,
      slug: this.slugify(payload.title),
      tagList: payload.tagList,
      author: {
        connect: { id: userId },
      },
    };
    let article: any = await this.prisma.article.create({
      data,
      include: articleInclude,
    });

    article = mapDynamicValues(userId, article);

    return { article };
  }

  private slugify(title: string) {
    return (
      slugify(title, { replacement: '-', lower: true, trim: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
