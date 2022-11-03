import { Collection } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';
import { Pet } from '../../pet/entities/pet.entity';

export class EditCategoryDto {
  @IsNotEmpty()
  category_name: string;

  @IsNotEmpty()
  id: string;

  pets?: Collection<Pet, object>;

  imageUrl?: string;
}
