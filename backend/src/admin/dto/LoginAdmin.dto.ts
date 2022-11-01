import { IsNotEmpty } from 'class-validator';

export class LoginAdminDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
