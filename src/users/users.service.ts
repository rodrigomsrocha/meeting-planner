import { ConflictException, Injectable } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async craeteUser({
    email,
    password,
    ...rest
  }: CreateUserDto): Promise<UserModel> {
    const userAlreadyExists = await this.getUser({ where: { email } });
    if (userAlreadyExists) throw new ConflictException('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.create({
      data: {
        email,
        ...rest,
        password: hashedPassword,
      },
    });
  }

  async getUser(query: object): Promise<UserModel | undefined> {
    return this.prisma.user.findFirst(query);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }
}
