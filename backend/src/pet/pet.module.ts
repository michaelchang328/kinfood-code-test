import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { Pet } from './entities/pet.entity';
import { S3Service } from '../s3/s3.service';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';

@Module({
  imports: [AuthModule, MikroOrmModule.forFeature([Pet])],
  controllers: [PetController],
  providers: [PetService, S3Service],
})
export class PetModule {}
