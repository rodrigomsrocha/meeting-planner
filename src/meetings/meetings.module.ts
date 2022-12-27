import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { MeetingsGateway } from './gateways/meetings.gateway';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';

@Module({
  providers: [MeetingsService, PrismaService, MeetingsGateway],
  controllers: [MeetingsController],
  imports: [UsersModule],
})
export class MeetingsModule {}
