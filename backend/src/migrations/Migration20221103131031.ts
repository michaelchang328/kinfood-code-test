import { Migration } from '@mikro-orm/migrations';

export class Migration20221103131031 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "category" add column "image_id" varchar(255) not null;');
    this.addSql('alter table "category" add constraint "category_image_id_foreign" foreign key ("image_id") references "image" ("id") on update cascade;');
    this.addSql('alter table "category" add constraint "category_image_id_unique" unique ("image_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "category" drop constraint "category_image_id_foreign";');

    this.addSql('alter table "category" drop constraint "category_image_id_unique";');
    this.addSql('alter table "category" drop column "image_id";');
  }

}
