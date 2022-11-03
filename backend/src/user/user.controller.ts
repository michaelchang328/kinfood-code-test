import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LoginAdminDto } from 'src/admin/dto/LoginAdmin.dto';
import { Public } from '../auth/public.guard';
import { IIdentity, Role, User } from '../auth/user.decorator';
import { S3Service } from '../s3/s3.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByUsername(loginUserDto.username);
    if (
      user &&
      (await bcrypt.compare(loginUserDto.password, user.encryptedPassword))
    ) {
      return user;
    }
    return null;
  }

  @Public()
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return await this.authService.loginUser(user);
  }

  @Put('update')
  async updateUser(
    @User() user: IIdentity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (user.role !== Role.normal_user) {
      throw new UnauthorizedException(
        'Only user can update herself / himself.',
      );
    }
    return await this.userService.updateUserById(updateUserDto);
  }
}
