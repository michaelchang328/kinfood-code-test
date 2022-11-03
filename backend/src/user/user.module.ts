import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { Image } from '../s3/entities/image.entity';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [AuthModule, MikroOrmModule.forFeature([User, Category])],
  controllers: [UserController],
  providers: [UserService, JwtService, AuthService],
})
export class UserModule {}
