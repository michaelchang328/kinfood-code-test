import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Pet } from './entities/pet.entity';
import { S3Service } from '../s3/s3.service';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { Store } from '../store/entities/store.entity';
import { Image } from '../s3/entities/image.entity';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { CategoryService } from '../category/category.service';

@Module({
  imports: [MikroOrmModule.forFeature([Pet, Store, Image, Category, User])],
  controllers: [PetController],
  providers: [PetService, S3Service, CategoryService],
})
export class PetModule {}
