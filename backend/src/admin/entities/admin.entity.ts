import { Entity, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/baseEntity.entity';

@Entity({ tableName: 'admin' })
export class Admin extends BaseEntity {
  @Unique({ name: 'admin_username_unique' })
  @Property()
  username!: string;

  @Property()
  encryptedPassword!: string;
}
