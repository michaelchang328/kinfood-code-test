import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '../auth/user.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
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

  async updateUserById(updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOneOrFail({
        id: updateUserDto.id,
      });

      user.dateOfBirth = updateUserDto.dateOfBirth;
      user.lastName = updateUserDto.lastName;
      user.firstName = updateUserDto.firstName;
      user.encryptedPassword = updateUserDto.encryptedPassword;
      if (updateUserDto.preferences.length) {
        for (const preference of updateUserDto.preferences) {
          const addPerference = await this.categoryRepository.findOneOrFail({
            id: preference,
          });
          user.preferences.add(addPerference);
        }
      }
      user.dateOfBirth = updateUserDto.dateOfBirth;

      await this.userRepository.persistAndFlush(user);
      return {
        status: HttpStatus.OK,
        message: 'User has been updated successfully.',
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
