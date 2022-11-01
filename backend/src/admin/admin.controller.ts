import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Public } from '../auth/public.guard';
import { IUser, Role, User } from '../auth/user.decorator';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { LoginAdminDto } from './dto/LoginAdmin.dto';
import * as bcrypt from 'bcrypt';
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  async createAdmin(
    @User() user: IUser,
    @Body() createAdminDto: CreateAdminDto,
  ) {
    try {
      if (user.role === Role.editor) {
        throw new UnauthorizedException(
          'Editor is not allowed to create any role.',
        );
      }

      if (
        createAdminDto.role === Role.super_admin &&
        user.role !== Role.super_admin
      ) {
        throw new UnauthorizedException(
          'Super admin can only be created by super admin.',
        );
      }

      return await this.adminService.createAdmin(createAdminDto);
    } catch (e) {
      throw new HttpException(
        'Something went wrong, pleace contact us.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async validateAdmin(loginAdminDto: LoginAdminDto) {
    const admin = await this.adminService.findByUsername(
      loginAdminDto.username,
    );
    if (
      admin &&
      (await bcrypt.compare(loginAdminDto.password, admin.encryptedPassword))
    ) {
      return admin;
    }
    return null;
  }

  @Public()
  @Post('login')
  async loginAdmin(@Body() loginAdminDto: LoginAdminDto) {
    console.log('loginAdminDto: ', loginAdminDto);
    const admin = await this.validateAdmin(loginAdminDto);
    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }
    return await this.authService.loginAdmin(admin);
  }

  @Get()
  async getAdmins(@User() user: IUser) {
    if (user.role === Role.normal_user) {
      throw new UnauthorizedException('Only admins are allowed.');
    }

    return await this.adminService.getAdmins();
  }
}
