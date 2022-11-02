import { BaseEntity } from '../../entities/baseEntity.entity';
import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { Pet } from '../../pet/entities/pet.entity';

@Entity({ tableName: 'category' })
export class Category extends BaseEntity {
  @Property()
  category_name!: string;

  @ManyToMany(() => Pet, 'categories', { owner: true, nullable: true })
  pets = new Collection<Pet>(this);
}
