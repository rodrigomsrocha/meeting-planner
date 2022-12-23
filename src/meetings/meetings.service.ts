import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MeetingsService {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
  ) {}

  async createMeeting(userId: string, data: Prisma.MeetingCreateInput) {
    const userExists = await this.userService.getUser({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException('User does not exist');
    }

    return await this.prismaService.meeting.create({
      data,
    });
  }
}
