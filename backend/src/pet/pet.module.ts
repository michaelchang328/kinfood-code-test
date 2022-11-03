import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Pet } from './entities/pet.entity';
import { S3Service } from '../s3/s3.service';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { Store } from '../store/entities/store.entity';
import { Image } from '../s3/entities/image.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Pet, Store, Image, Category])],
  controllers: [PetController],
  providers: [PetService, S3Service],
})
export class PetModule {}
