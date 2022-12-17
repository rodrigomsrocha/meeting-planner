import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AddressService {
  constructor(private prismaService: PrismaService) {}

  async getUserAddresses(userId: string) {
    const addresses = await this.prismaService.address.findMany({
      where: { userId },
    });

    return addresses;
  }
}
