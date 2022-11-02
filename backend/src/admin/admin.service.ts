import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: EntityRepository<Admin>,
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

  async getAdmins() {
    return await this.adminRepository.findAll();
  }
}
