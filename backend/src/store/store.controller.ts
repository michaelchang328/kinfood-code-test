import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/public.guard';
import { IIdentity, Role, User } from '../auth/user.decorator';
import { S3Service } from '../s3/s3.service';
import { CreateStoreDto } from './dto/createStore.dto';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('store_images'))
  async createStore(
    @User() user: IIdentity,
    @Body() createStoreDto: CreateStoreDto,
    @UploadedFiles() store_images: Array<Express.Multer.File>,
  ) {
    try {
      if (user.role === Role.normal_user) {
        throw new UnauthorizedException(
          'User is not allowed to create any store.',
        );
      }
      let images: string[] = [];
      if (store_images) {
        for (const store_image of store_images) {
          const storeImageUrl = await this.s3Service.upload(store_image);
          images.push(storeImageUrl.Location);
        }
        return await this.storeService.createStore({
          ...createStoreDto,
          store_images: images,
        });
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Get('/?')
  async getStores(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    return await this.storeService.getStores({
      latitude: latitude,
      longitude: longitude,
    });
  }
}
