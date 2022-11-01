import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Admin } from '../../src/admin/entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../../src/auth/user.decorator';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const createFirstAdmin = em.create(Admin, {
      username: 'admin',
      encryptedPassword: await bcrypt.hash('admin', 10),
      role: Role.super_admin,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // em.persist(createFirstAdmin);
    // await new AuthorFactory(orm.em).createOne();
  }
}
