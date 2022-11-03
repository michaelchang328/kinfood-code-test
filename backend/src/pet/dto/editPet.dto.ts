import { CreatePetDto } from './createPet.dto';

export class EditPetDto extends CreatePetDto {
  id: string;

  removeCategories?: string;

  removeImages?: string;
}
