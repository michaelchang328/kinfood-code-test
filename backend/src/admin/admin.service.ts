import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/LoginAdmin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: EntityRepository<Admin>,
    private readonly jwtService: JwtService,
  ) {}
  async createAdmin(createAdminDto: CreateAdminDto) {
    try {
      const admin = new Admin();
      admin.username = createAdminDto.username;
      admin.role = createAdminDto.role;
      admin.encryptedPassword = await bcrypt.hash(
        createAdminDto.encryptedPassword,
        10,
      );

      await this.adminRepository.persistAndFlush(admin);
      return {
        status: HttpStatus.OK,
        message: 'Admin has been created successfully.',
      };
    } catch (e) {
      throw new HttpException(
        'Something went wrong, pleace contact us.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByUsername(username: string): Promise<Admin | null> {
    return await this.adminRepository.findOneOrFail({
      username: username,
    });
  }

  async validateAdmin(loginAdminDto: LoginAdminDto) {
    const admin = await this.findByUsername(loginAdminDto.username);
    if (
      admin &&
      (await bcrypt.compare(loginAdminDto.password, admin.encryptedPassword))
    ) {
      return admin;
    }
    return null;
  }

  async loginAdmin(admin: Admin) {
    const payload = {
      id: admin.id,
      role: admin.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getAdmins() {
    return await this.adminRepository.findAll();
  }
}
