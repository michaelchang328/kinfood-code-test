import {
  Collection,
  Entity,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Category } from '../../category/entities/category.entity';
import { Role } from '../../auth/user.decorator';
import { BaseEntity } from '../../entities/baseEntity.entity';

@Entity({ tableName: 'user' })
export class User extends BaseEntity {
  @Unique({ name: 'user_username_unique' })
  @Property()
  username!: string;

  @Property()
  encryptedPassword!: string;

  @Property({ default: Role.normal_user })
  role!: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  dateOfBirth!: Date;

  @OneToMany(() => Category, (category) => category.user, { nullable: true })
  preferences = new Collection<Category>(this);
}
