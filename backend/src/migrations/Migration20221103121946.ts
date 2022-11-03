import { Migration } from '@mikro-orm/migrations';

export class Migration20221103121946 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "category" add constraint "category_name_unique" unique ("category_name");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "category" drop constraint "category_name_unique";');
  }

}
