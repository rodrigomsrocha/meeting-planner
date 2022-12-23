import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './database/prisma.service';
import { MeetingsModule } from './meetings/meetings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, AuthModule, MeetingsModule],
  providers: [PrismaService],
})
export class AppModule {}
