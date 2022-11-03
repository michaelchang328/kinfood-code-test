import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IIdentity, Role } from '../auth/user.decorator';
import { Image } from '../s3/entities/image.entity';
import { CreateStoreDto } from './dto/createStore.dto';
import { GetStoresDto } from './dto/getStores.dto';
import { Store } from './entities/store.entity';
import { getDistance } from 'geolib';
import { EditStoreDto } from './dto/editStore.dto';
import { Pet } from '../pet/entities/pet.entity';

interface SortedStores extends Store {
  distance: number;
}

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: EntityRepository<Store>,
    @InjectRepository(Pet)
    private readonly petRepository: EntityRepository<Pet>,
    @InjectRepository(Image)
    private readonly imageRepository: EntityRepository<Image>,
  ) {}

  async createStore(createStoreDto: CreateStoreDto) {
    try {
      const store = new Store();
      store.store_name = createStoreDto.store_name;
      store.description = createStoreDto.description;
      store.latitude = createStoreDto.latitude;
      store.longitude = createStoreDto.longitude;

      let pets: string[] = [];
      if (createStoreDto.pets) {
        pets = JSON.parse(createStoreDto.pets);
      }

      if (createStoreDto.pets && createStoreDto.pets.length) {
        for (const petId of pets) {
          const pet = await this.petRepository.findOne({ id: petId });
          store.pets.add(pet);
        }
      }

      await this.storeRepository.persistAndFlush(store);
      if (createStoreDto.store_images) {
        for (let imageUrl of createStoreDto.store_images) {
          const newImage = new Image();
          newImage.url = imageUrl;
          newImage.store = store;
          store.store_images.add(newImage);
        }
      }
      return { status: HttpStatus.OK, store: store };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getStores(getStroesDto?: GetStoresDto) {
    const stores = await this.storeRepository.findAll();
    if (getStroesDto.latitude && getStroesDto.longitude) {
      // Sort by stores location according to current location
      let sortedStores: SortedStores[] = [];
      for (const store of stores) {
        const distance = getDistance(
          {
            latitude: getStroesDto.latitude,
            longitude: getStroesDto.longitude,
          },
          {
            latitude: store.latitude,
            longitude: store.longitude,
          },
        );
        sortedStores.push({ ...store, distance: distance / 1000 });
      }

      return sortedStores.sort((a, b) => {
        if (a.distance < b.distance) return -1;
      });
    }
    return stores;
  }

  async getPetByStoreId(id: string) {
    try {
      return await this.storeRepository.find(
        { id: id },
        {
          populate: ['pets'],
        },
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async editStoreById(editStoreDto: EditStoreDto) {
    try {
      const store = await this.storeRepository.findOneOrFail({
        id: editStoreDto.id,
      });
      store.store_name = editStoreDto.store_name;
      store.description = editStoreDto.description;
      store.latitude = editStoreDto.latitude;
      store.longitude = editStoreDto.longitude;

      let removeImages: string[] = [];
      if (editStoreDto.removeImages) {
        removeImages = JSON.parse(editStoreDto.removeImages);
      }
      let removePets: string[] = [];
      if (editStoreDto.removeImages) {
        removePets = JSON.parse(editStoreDto.removePets);
      }

      if (editStoreDto.pets && editStoreDto.pets.length) {
        for (const petId of editStoreDto.pets) {
          const pet = await this.petRepository.findOne({
            id: petId,
          });
          store.pets.add(pet);
        }
      }
      if (removeImages.length) {
        for (const imageId of removeImages) {
          const removeImage = await this.imageRepository.findOneOrFail({
            id: imageId,
          });
          store.store_images.remove(removeImage);
        }
      }
      await this.storeRepository.persistAndFlush(store);
      return {
        status: HttpStatus.OK,
        message: 'Store has been updated successfully.',
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
