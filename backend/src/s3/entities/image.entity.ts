import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { Pet } from '../../pet/entities/pet.entity';
import { Store } from '../../store/entities/store.entity';
import { BaseEntity } from '../../entities/baseEntity.entity';
import { Category } from '../../category/entities/category.entity';

@Entity({ tableName: 'image' })
export class Image extends BaseEntity {
  @Property()
  url!: string;

  @ManyToOne({ entity: () => Store, fieldName: 'store_id', nullable: true })
  store?: Store;

  @ManyToOne({ entity: () => Pet, fieldName: 'pet_id', nullable: true })
  pet?: Pet;

  @OneToOne(() => Category, (category) => category.image)
  category?: Category;
}
