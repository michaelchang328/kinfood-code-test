import { EntityRepository } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from '../category/entities/category.entity';
import { Store } from '../store/entities/store.entity';
import { CreatePetDto } from './dto/createPet.dto';
import { Pet } from './entities/pet.entity';
import { Image } from '../s3/entities/image.entity';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: EntityRepository<Pet>,
    @InjectRepository(Store)
    private readonly storeRepository: EntityRepository<Store>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
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
          console.log('category: ', category)
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
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
