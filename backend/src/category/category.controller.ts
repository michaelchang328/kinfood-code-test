import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/public.guard';
import { User, IIdentity, Role } from '../auth/user.decorator';
import { S3Service } from '../s3/s3.service';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { EditCategoryDto } from './dto/editCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('category_image'))
  async createCategroy(
    @User() user: IIdentity,
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() category_image?: Express.Multer.File,
  ) {
    try {
      if (user.role === Role.normal_user) {
        throw new UnauthorizedException(
          'User is not allowed to create any category.',
        );
      }
      let imageUrl: string;
      if (category_image) {
        imageUrl = (await this.s3Service.upload(category_image)).Location;
      }
      return await this.categoryService.createCategory({
        ...createCategoryDto,
        imageUrl,
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('edit')
  @UseInterceptors(FileInterceptor('category_image'))
  async editCategroyById(
    @User() user: IIdentity,
    @Body() editCategoryDto: EditCategoryDto,
    @UploadedFile() category_image?: Express.Multer.File,
  ) {
    try {
      if (user.role === Role.normal_user) {
        throw new UnauthorizedException(
          'User is not allowed to edit any category.',
        );
      }
      let imageUrl: string;
      if (category_image) {
        imageUrl = (await this.s3Service.upload(category_image)).Location;
      }
      return await this.categoryService.editCategory({
        ...editCategoryDto,
        imageUrl,
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('delete')
  async deleteCategroyById(
    @User() user: IIdentity,
    @Body() body: { id: string },
  ) {
    try {
      if (user.role === Role.normal_user) {
        throw new UnauthorizedException(
          'User is not allowed to delete any category.',
        );
      }
      return await this.categoryService.deleteCategory(body.id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Get()
  async getAllCategories() {
    return await this.categoryService.getAll();
  }

  @Public()
  @Get(':id')
  async getPetByCategoryId(@Param('id') id: string) {
    return await this.categoryService.getPetByCategory(id);
  }
}
