import { Logger } from '@nestjs/common';
import { Options } from '@mikro-orm/core';
import { Admin } from './admin/entities/admin.entity';

const logger = new Logger('MikroORM');
const config = {
  entities: [Admin],
  dbName: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  type: 'postgresql',
  debug: true,
  logger: logger.log.bind(logger),
  allowGlobalContext: true,
  disableForeignKeys: false,
} as Options;

export default config;
