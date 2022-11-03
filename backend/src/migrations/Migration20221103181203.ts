import { Migration } from '@mikro-orm/migrations';

export class Migration20221103181203 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "encrypted_password" varchar(255) not null, "role" varchar(255) not null default \'normal_user\', "first_name" varchar(255) not null, "last_name" varchar(255) not null, "date_of_birth" timestamptz(0) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('alter table "category" add column "user_id" varchar(255) null;');
    this.addSql('alter table "category" add constraint "category_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "category" drop constraint "category_user_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('alter table "category" drop column "user_id";');
  }

}
