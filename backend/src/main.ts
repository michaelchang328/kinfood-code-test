import { NestFactory } from '@nestjs/core';
import { MikroORM } from '@mikro-orm/core';
import { AppModule } from './app.module';
import config from './mikro-orm.config';
import { EntityManager } from '@mikro-orm/postgresql';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/v1');
  const orm = await MikroORM.init(config);
  orm.em as EntityManager;
  await app.listen(3000);
}
bootstrap();
