import { Property } from '@mikro-orm/core';
import { User } from '../entities/user.entity';

export class UpdateUserDto {
  @Property()
  username!: string;

  @Property()
  id!: string;

  @Property()
  encryptedPassword!: string;

  @Property({ nullable: true })
  role?: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  dateOfBirth!: Date;

  @Property()
  preferences?: string[];
}
