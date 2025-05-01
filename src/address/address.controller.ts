// controller/address.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';


@Controller('address')
export class AddressController {
    constructor(private readonly service: AddressService) { }

    @Post('handleCreateAddress')
    async handleCreateAddress(@Body() dto: CreateAddressDto): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.service.handleCreateAddress(dto);
        } catch (error) {
            console.error('Error saving address details:', error);
            return new CommonResponse(false, 500, 'Error saving address details');
        }
    }

    @Post('deleteAddress')
    async deleteAddress(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.deleteAddress(dto);
        } catch (error) {
            console.error('Error deleting address details:', error);
            return new CommonResponse(false, 500, 'Error deleting address details');
        }
    }

    @Post('getAddressList')
    async getAddressList(): Promise<CommonResponse> {
        try {
            return await this.service.getAddressList();
        } catch (error) {
            console.error('Error fetching address list:', error);
            return new CommonResponse(false, 500, 'Error fetching address list');
        }
    }

    @Post('getAddressById')
    async getAddressById(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.getAddressById(dto);
        } catch (error) {
            console.error('Error fetching address details by ID:', error);
            return new CommonResponse(false, 500, 'Error fetching address details by ID');
        }
    }
}
