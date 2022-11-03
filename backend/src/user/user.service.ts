import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '../auth/user.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      user.lastName = createUserDto.lastName;
      user.firstName = createUserDto.firstName;
      user.role = Role.normal_user;
      user.username = createUserDto.username;
      user.encryptedPassword = await bcrypt.hash(
        createUserDto.encryptedPassword,
        10,
      );
      user.dateOfBirth = createUserDto.dateOfBirth;
      if (createUserDto.preferences) {
        for (const preference of createUserDto.preferences) {
          user.preferences.add(preference);
        }
      }
      await this.userRepository.persistAndFlush(user);

      return {
        status: HttpStatus.OK,
        message: 'User has been created successfully.',
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOneOrFail({
      username: username,
    });
  }
}
