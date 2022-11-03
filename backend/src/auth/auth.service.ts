import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async loginAdmin(admin: Admin) {
    const payload = {
      id: admin.id,
      role: admin.role,
    };
    return {
      status: HttpStatus.OK,
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async loginUser(user: User) {
    const payload = {
      id: user.id,
      role: user.role,
    };
    return {
      status: HttpStatus.OK,
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
