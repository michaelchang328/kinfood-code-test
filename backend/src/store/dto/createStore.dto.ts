import { IsNotEmpty } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  store_name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  longitude: string;

  @IsNotEmpty()
  latitude: string;

  store_images?: string[];
}
