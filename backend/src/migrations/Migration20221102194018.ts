import { Migration } from '@mikro-orm/migrations';

export class Migration20221102194018 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "admin" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "encrypted_password" varchar(255) not null, "role" varchar(255) not null, constraint "admin_pkey" primary key ("id"));');
    this.addSql('alter table "admin" add constraint "admin_username_unique" unique ("username");');

    this.addSql('create table "category" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "category_name" varchar(255) not null, constraint "category_pkey" primary key ("id"));');

    this.addSql('create table "store" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "store_name" varchar(255) not null, "description" varchar(255) not null, "longitude" varchar(255) not null, "latitude" varchar(255) not null, "published" boolean not null default false, constraint "store_pkey" primary key ("id"));');
    this.addSql('alter table "store" add constraint "store_name_unique" unique ("store_name");');

    this.addSql('create table "pet" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "breed" varchar(255) not null, "weight" int not null, "colour" varchar(255) not null, "description" varchar(255) null, "name" varchar(255) null, "age" int null, "store_id" varchar(255) not null, constraint "pet_pkey" primary key ("id"));');

    this.addSql('create table "category_pets" ("category_id" varchar(255) not null, "pet_id" varchar(255) not null, constraint "category_pets_pkey" primary key ("category_id", "pet_id"));');

    this.addSql('create table "image" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "url" varchar(255) not null, "store_id" varchar(255) null, "pet_id" varchar(255) null, constraint "image_pkey" primary key ("id"));');

    this.addSql('alter table "pet" add constraint "pet_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade;');

    this.addSql('alter table "category_pets" add constraint "category_pets_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "category_pets" add constraint "category_pets_pet_id_foreign" foreign key ("pet_id") references "pet" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "image" add constraint "image_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete set null;');
    this.addSql('alter table "image" add constraint "image_pet_id_foreign" foreign key ("pet_id") references "pet" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "category_pets" drop constraint "category_pets_category_id_foreign";');

    this.addSql('alter table "pet" drop constraint "pet_store_id_foreign";');

    this.addSql('alter table "image" drop constraint "image_store_id_foreign";');

    this.addSql('alter table "category_pets" drop constraint "category_pets_pet_id_foreign";');

    this.addSql('alter table "image" drop constraint "image_pet_id_foreign";');

    this.addSql('drop table if exists "admin" cascade;');

    this.addSql('drop table if exists "category" cascade;');

    this.addSql('drop table if exists "store" cascade;');

    this.addSql('drop table if exists "pet" cascade;');

    this.addSql('drop table if exists "category_pets" cascade;');

    this.addSql('drop table if exists "image" cascade;');
  }

}
