import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async getUserAddresses(@Request() req) {
    return await this.addressService.getUserAddresses(req.user.id);
  }
}
