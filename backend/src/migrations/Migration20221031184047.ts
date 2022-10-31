import { Migration } from '@mikro-orm/migrations';

export class Migration20221031184047 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "admin" ("id" varchar(255) not null, "created_at" jsonb not null, "updated_at" jsonb not null, "username" varchar(255) not null, "encrypted_password" varchar(255) not null, constraint "admin_pkey" primary key ("id"));');
    this.addSql('alter table "admin" add constraint "admin_username_unique" unique ("username");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "admin" cascade;');
  }

}
