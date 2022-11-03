import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { IIdentity, Role, User } from '../auth/user.decorator';
import { CreatePetDto } from './dto/createPet.dto';
import { PetService } from './pet.service';
import { EditPetDto } from './dto/editPet.dto';
import { Public } from '../auth/public.guard';

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

    await this.petService.createPet({
      ...createPetDto,
      categories: createPetDto.categories
        ? JSON.parse(createPetDto.categories)
        : null,
      images: images,
    });
    return {
      status: HttpStatus.OK,
      message: 'Pet has been created successfully.',
    };
  }

  @Put('edit')
  @UseInterceptors(FilesInterceptor('pet_images'))
  async editPetById(
    @User() user: IIdentity,
    @Body() editPetDto: EditPetDto,
    @UploadedFiles() pet_images: Array<Express.Multer.File>,
  ) {
    if (user.role === Role.normal_user) {
      throw new UnauthorizedException('User is not allowed to edit any pet.');
    }
    let images: string[] = [];
    if (pet_images) {
      for (const store_image of pet_images) {
        const storeImageUrl = await this.s3Service.upload(store_image);
        images.push(storeImageUrl.Location);
      }
    }

    await this.petService.editPet({
      ...editPetDto,
      categories: editPetDto.categories
        ? JSON.parse(editPetDto.categories)
        : null,
      images: images,
    });
    return {
      status: HttpStatus.OK,
      message: 'Pet has been edited successfully.',
    };
  }

  @Get('preferences')
  async getPetsByPreference(@User() user: IIdentity) {
    return await this.petService.getPetsByPreference(user.id);
  }

  @Public()
  @Get(':id')
  async getPetById(@Param('id') id: string) {
    return await this.petService.getPetById(id);
  }
}
