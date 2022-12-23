import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';

@Module({
  providers: [MeetingsService, PrismaService],
  controllers: [MeetingsController],
  imports: [UsersModule],
})
export class MeetingsModule {}
