import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.craeteUser(createUserDto);
    return user;
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getUser({
      where: { email: loginDto.email },
    });

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (user && passwordMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserModel) {
    const payload = {
      name: user.name,
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
