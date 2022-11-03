import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { IIdentity, Role, User } from '../auth/user.decorator';
import { CreatePetDto } from './dto/createPet.dto';
import { PetService } from './pet.service';

@Controller('pet')
export class PetController {
  constructor(
    private readonly petService: PetService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('pet_images'))
  async createPet(
    @User() user: IIdentity,
    @Body() createPetDto: CreatePetDto,
    @UploadedFiles() pet_images: Array<Express.Multer.File>,
  ) {
    if (user.role === Role.normal_user) {
      throw new UnauthorizedException('User is not allowed to create any pet.');
    }
    let images: string[] = [];
    if (pet_images) {
      for (const store_image of pet_images) {
        const storeImageUrl = await this.s3Service.upload(store_image);
        images.push(storeImageUrl.Location);
      }
    }

    await this.petService.createPet({ ...createPetDto, categories: JSON.parse(createPetDto.categories), images: images });
    return {
      status: HttpStatus.OK,
      message: 'Pet has been created successfully.',
    };
  }
}
