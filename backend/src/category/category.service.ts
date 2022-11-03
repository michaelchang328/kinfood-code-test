import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IIdentity } from '../auth/user.decorator';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { EditCategoryDto } from './dto/editCategory.dto';
import { Category } from './entities/category.entity';
import { Image } from '../s3/entities/image.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    @InjectRepository(Image)
    private readonly imageRepository: EntityRepository<Image>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const category = new Category();
      category.category_name = createCategoryDto.category_name;

      if (createCategoryDto.imageUrl) {
        const newImage = new Image();
        newImage.url = createCategoryDto.imageUrl;
        newImage.category = category;
        await this.imageRepository.persistAndFlush(newImage);
        category.image = newImage;
      }
      await this.categoryRepository.persistAndFlush(category);
      return {
        status: HttpStatus.OK,
        message: 'Category has been created successfully.',
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async editCategory(editCategoryDto: EditCategoryDto) {
    try {
      const category = await this.categoryRepository.findOneOrFail({
        id: editCategoryDto.id,
      });
      category.category_name = editCategoryDto.category_name;

      if (editCategoryDto.pets) {
        category.pets = editCategoryDto.pets;
      }

      if (editCategoryDto.imageUrl) {
        const newImage = new Image();
        newImage.url = editCategoryDto.imageUrl;
        newImage.category = category;
        await this.imageRepository.persistAndFlush(newImage);
      }

      await this.categoryRepository.persistAndFlush(category);
      return {
        status: HttpStatus.OK,
        message: 'Category has been edited successfully.',
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteCategory(id: string) {
    return await this.categoryRepository.removeAndFlush({ id: id });
  }

  async getAll(userId?: string) {
    try {
      if (userId) {
        // return user preferences
      }
      return await this.categoryRepository.findAll();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getPetByCategory(id: string) {
    try {
      return await this.categoryRepository.find(
        { id: id },
        {
          populate: ['pets'],
        },
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
