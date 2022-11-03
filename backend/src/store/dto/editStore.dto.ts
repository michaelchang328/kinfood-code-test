import { CreateStoreDto } from './createStore.dto';

export class EditStoreDto extends CreateStoreDto {
  id: string;

  removePets?: string;

  removeImages?: string;
}
