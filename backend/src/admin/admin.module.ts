import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
@Module({
  imports: [AuthModule, MikroOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService, JwtService, AuthService],
})
export class AdminModule {}
