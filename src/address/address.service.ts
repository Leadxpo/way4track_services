import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { AddressRepository } from './repo/address-repo';
import { AddressAdapter } from './address.adapter';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressEntity } from './entity/address.entity';

@Injectable()
export class AddressService {
    constructor(
        private readonly addressRepository: AddressRepository,
        private readonly addressAdapter: AddressAdapter,
    ) { }

    async handleCreateAddress(dto: CreateAddressDto): Promise<CommonResponse> {
        try {
            let entity: AddressEntity;
            if (dto.id) {
                entity = await this.addressRepository.findOne({ where: { id: dto.id } });
                if (!entity) return new CommonResponse(false, 404, 'Address not found');
                Object.assign(entity, this.addressAdapter.toEntity(dto));
                await this.addressRepository.save(entity);
                return new CommonResponse(true, 200, 'Address updated');
            } else {
                entity = this.addressAdapter.toEntity(dto);
                await this.addressRepository.save(entity);
                return new CommonResponse(true, 201, 'Address created');
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async deleteAddress(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const existing = await this.addressRepository.findOne({ where: { id: dto.id } });
            if (!existing) return new CommonResponse(false, 404, 'Address not found');
            await this.addressRepository.delete({ id: dto.id });
            return new CommonResponse(true, 200, 'Address deleted');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getAddressList(): Promise<CommonResponse> {
        try {
            const data = await this.addressRepository.find({ relations: ['client'] });
            return new CommonResponse(true, 200, 'Address list fetched', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getAddressById(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const entity = await this.addressRepository.findOne({ where: { id: dto.id }, relations: ['client'] });
            if (!entity) return new CommonResponse(false, 404, 'Address not found');
            return new CommonResponse(true, 200, 'Address fetched', this.addressAdapter.toResponse(entity));
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
