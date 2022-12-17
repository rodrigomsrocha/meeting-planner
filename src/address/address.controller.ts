import { Controller, Get, Param } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get(':userId')
  async getUserAddresses(@Param('userId') userId: string) {
    return await this.addressService.getUserAddresses(userId);
  }
}
