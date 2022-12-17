import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

@Module({
  providers: [AddressService, PrismaService],
  controllers: [AddressController],
})
export class AddressModule {}
