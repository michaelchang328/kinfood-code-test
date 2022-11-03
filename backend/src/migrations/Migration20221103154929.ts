import { Migration } from '@mikro-orm/migrations';

export class Migration20221103154929 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pet" alter column "weight" type varchar(255) using ("weight"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pet" alter column "weight" type int using ("weight"::int);');
  }

}
