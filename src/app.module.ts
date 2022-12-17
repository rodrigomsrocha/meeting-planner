import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './database/prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule {}
