import { IsNotEmpty } from 'class-validator';
import { CreateAdminDto } from './createAdmin.dto';

export class EditAdminDto extends CreateAdminDto {
  @IsNotEmpty()
  id!: string;
}
