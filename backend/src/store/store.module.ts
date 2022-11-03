import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { Store } from './entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Image } from '../s3/entities/image.entity';
import { Pet } from '../pet/entities/pet.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Store, Image, Pet])],
  controllers: [StoreController],
  providers: [StoreService, S3Service],
})
export class StoreModule {}
