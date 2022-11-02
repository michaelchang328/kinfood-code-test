import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Store } from '../../store/entities/store.entity';
import { BaseEntity } from '../../entities/baseEntity.entity';
import { Image } from '../../s3/entities/image.entity';
import { Category } from '../../category/entities/category.entity';

@Entity({ tableName: 'pet' })
export class Pet extends BaseEntity {
  @Property()
  breed!: string;

  @Property()
  weight!: number;

  @Property()
  colour!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  age?: number;

  @ManyToOne({ entity: () => Store, fieldName: 'store_id' })
  store!: Store;

  @OneToMany(() => Image, (image) => image.pet, { nullable: true })
  pet_images = new Collection<Image>(this);

  @ManyToMany(() => Category, (category) => category.pets, { nullable: true })
  categories = new Collection<Category>(this);
}
