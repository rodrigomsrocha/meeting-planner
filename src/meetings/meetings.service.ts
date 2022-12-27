import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateMeetingDto } from './dtos/create-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
  ) {}

  async createMeeting(userId: string, data: CreateMeetingDto) {
    const userExists = await this.userService.getUser({
      id: userId,
    });

    if (!userExists) {
      throw new NotFoundException('User does not exist');
    }

    return await this.prismaService.meeting.create({
      data: {
        ...data,
        host: {
          connect: { id: userId },
        },
      },
    });
  }

  async getUserMeetings(userId: string) {
    const userExists = await this.userService.getUser({
      id: userId,
    });

    if (!userExists) {
      throw new NotFoundException('User does not exist');
    }

    return await this.prismaService.meeting.findMany({
      where: {
        OR: [
          {
            userId,
          },
          {
            guests: {
              some: { id: userId },
            },
          },
        ],
      },
    });
  }

  async inviteUser(guestId: string, meetingId: string) {
    const guest = await this.userService.getUser({ id: guestId });

    return await this.prismaService.meeting.update({
      where: { id: meetingId },
      data: {
        guests: {
          connectOrCreate: {
            where: { id: guestId },
            create: { ...guest },
          },
        },
      },
    });
  }
}
