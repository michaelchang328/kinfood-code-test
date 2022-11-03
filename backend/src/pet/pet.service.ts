import { EntityRepository } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from '../category/entities/category.entity';
import { Store } from '../store/entities/store.entity';
import { CreatePetDto } from './dto/createPet.dto';
import { Pet } from './entities/pet.entity';
import { Image } from '../s3/entities/image.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EditPetDto } from './dto/editPet.dto';
import { User } from '../user/entities/user.entity';
import { CategoryService } from '../category/category.service';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: EntityRepository<Pet>,
    @InjectRepository(Store)
    private readonly storeRepository: EntityRepository<Store>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    @InjectRepository(Image)
    private readonly imageRepository: EntityRepository<Image>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly categoryService: CategoryService,
  ) {}

  async createPet(createPetDto: CreatePetDto) {
    try {
      const pet = new Pet();
      pet.age = createPetDto.age;
      pet.breed = createPetDto.breed;
      pet.weight = createPetDto.weight;
      pet.colour = createPetDto.colour;
      pet.name = createPetDto.name;
      pet.description = createPetDto.description;

      if (createPetDto.categories.length) {
        for (const category_id of createPetDto.categories) {
          const category = await this.categoryRepository.findOne({
            id: category_id,
          });
          pet.categories.add(category);
        }
      }
      const store = await this.storeRepository.findOneOrFail({
        id: createPetDto.store_id,
      });
      pet.store = store;

      if (createPetDto.images.length) {
        for (const imageUrl of createPetDto.images) {
          const newImage = new Image();
          newImage.url = imageUrl;
          newImage.pet = pet;
          pet.pet_images.add(newImage);
        }
      }
      await this.petRepository.persistAndFlush(pet);

      return {
        status: HttpStatus.OK,
        message: 'Pet has been updated successfully.',
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async editPet(editPetDto: EditPetDto) {
    try {
      const pet = await this.petRepository.findOneOrFail(
        { id: editPetDto.id },
        {
          populate: ['store', 'categories', 'pet_images'],
        },
      );
      pet.age = editPetDto.age;
      pet.breed = editPetDto.breed;
      pet.weight = editPetDto.weight;
      pet.colour = editPetDto.colour;
      pet.name = editPetDto.name;
      pet.description = editPetDto.description;

      let removeImages: string[] = [];
      if (editPetDto.removeImages) {
        removeImages = JSON.parse(editPetDto.removeImages);
      }
      let removeCategories: string[] = [];
      if (editPetDto.removeImages) {
        removeCategories = JSON.parse(editPetDto.removeCategories);
      }

      if (editPetDto.categories && editPetDto.categories.length) {
        for (const category_id of editPetDto.categories) {
          const category = await this.categoryRepository.findOne({
            id: category_id,
          });
          pet.categories.add(category);
        }
      }
      if (removeCategories.length) {
        for (const category_id of removeCategories) {
          const removedCategory = await this.categoryRepository.findOne({
            id: category_id,
          });
          pet.categories.remove(removedCategory);
        }
      }
      const store = await this.storeRepository.findOneOrFail({
        id: editPetDto.store_id,
      });
      pet.store = store;

      if (editPetDto.images && editPetDto.images.length) {
        for (const imageUrl of editPetDto.images) {
          const newImage = new Image();
          newImage.url = imageUrl;
          newImage.pet = pet;
          pet.pet_images.add(newImage);
        }
      }
      if (removeImages.length) {
        for (const imageId of removeImages) {
          const removeImage = await this.imageRepository.findOneOrFail({
            id: imageId,
          });
          pet.pet_images.remove(removeImage);
        }
      }

      await this.petRepository.persistAndFlush(pet);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getPetById(id: string) {
    try {
      return await this.petRepository.findOneOrFail(
        { id: id },
        {
          populate: ['store', 'categories', 'pet_images'],
        },
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getPetsByPreference(userId: string) {
    try {
      const user = await this.userRepository.findOneOrFail(
        { id: userId },
        { populate: ['preferences'] },
      );
      let finalResult: Pet[] = [];
      if (user.preferences.length > 0) {
        for (const preference of user.preferences) {
          const pets = await this.categoryService.getPetByCategory(
            preference.id,
          );

          for (const pet of pets[0].pets) {
            finalResult.push(pet);
          }
        }
        return finalResult;
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
