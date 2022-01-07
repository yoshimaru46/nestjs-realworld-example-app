import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleRO, ArticlesRO } from 'src/articles/articles.interface';
import { ArticlesService } from 'src/articles/articles.service';
import { CreateArticleDto } from 'src/articles/dto/create-article.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.decorator';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  async findAll(
    @User('userId') userId: number,
    @Query() query,
  ): Promise<ArticlesRO> {
    return await this.articleService.findAll(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @User('userId') userId: number,
    @Body('article') articleData: CreateArticleDto,
  ) {
    return this.articleService.create(userId, articleData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('feed')
  async getFeed(
    @User('userId') userId: number,
    @Query() query,
  ): Promise<ArticlesRO> {
    return await this.articleService.findFeed(userId, query);
  }

  @Get(':slug')
  async findOne(
    @User('userId') userId: number,
    @Param('slug') slug,
  ): Promise<ArticleRO> {
    return await this.articleService.findOne(userId, slug);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':slug')
  async update(
    @User('userId') userId: number,
    @Param('slug') slug,
    @Body('article') articleData: CreateArticleDto,
  ) {
    // TODO: update slug also when title gets changed
    return this.articleService.update(userId, slug, articleData);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':slug/favorite')
  async favorite(@User('userId') userId: number, @Param('slug') slug) {
    console.log({ userId, slug });

    return this.articleService.favorite(userId, slug);
  }
}
