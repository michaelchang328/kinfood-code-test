import { FloatType } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty()
  breed!: string;

  @IsNotEmpty()
  weight!: FloatType;

  @IsNotEmpty()
  colour!: string;

  description?: string;

  name?: string;

  age?: number;

  store_id: string;

  categories?: string;

  images?: string[];
}
