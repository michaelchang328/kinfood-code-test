import { BaseEntity } from '../../entities/baseEntity.entity';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Pet } from '../../pet/entities/pet.entity';
import { Image } from '../../s3/entities/image.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ tableName: 'category' })
export class Category extends BaseEntity {
  @Unique({ name: 'category_name_unique' })
  @Property()
  category_name!: string;

  @ManyToMany(() => Pet, 'categories', { owner: true, nullable: true })
  pets = new Collection<Pet>(this);

  @OneToOne(() => Image, (image) => image.category, {
    owner: true,
    orphanRemoval: true,
  })
  image: Image;

  @ManyToOne({ nullable: true })
  user?: User;
}
