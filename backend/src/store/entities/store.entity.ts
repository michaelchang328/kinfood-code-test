import {
  Collection,
  Entity,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Pet } from '../../pet/entities/pet.entity';
import { BaseEntity } from '../../entities/baseEntity.entity';
import { Image } from '../../s3/entities/image.entity';

@Entity({ tableName: 'store' })
export class Store extends BaseEntity {
  @Unique({ name: 'store_name_unique' })
  @Property()
  store_name!: string;

  @Property()
  description!: string;

  @Property()
  longitude!: string;

  @Property()
  latitude!: string;

  @Property({ default: false })
  published: boolean;

  @OneToMany(() => Pet, (pet) => pet.store, { nullable: true })
  pets = new Collection<Pet>(this);

  @OneToMany(() => Image, (image) => image.store, { nullable: true })
  store_images = new Collection<Image>(this);
}
