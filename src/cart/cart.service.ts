// service/cart.service.ts

import { Injectable } from '@nestjs/common';
import { CartRepository } from './repo/cart-repo';
import { CreateCartDto } from './dto/cart.dto';
import { CartAdapter } from './adapter/cart-.adapter';
import { CommonResponse } from 'src/models/common-response';
import { CartEntity } from './entity/cart.entity';
import { ErrorResponse } from 'src/models/error-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';

@Injectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly cartAdapter: CartAdapter,
    ) { }

    async handlecreateCart(dto: CreateCartDto): Promise<CommonResponse> {
        try {
            let entity: CartEntity;
            if (dto.id) {
                entity = await this.cartRepository.findOne({ where: { id: dto.id } });
                if (!entity) return new CommonResponse(false, 404, 'cart not found');
                Object.assign(entity, this.cartAdapter.toEntity(dto));
                await this.cartRepository.save(entity);
                return new CommonResponse(true, 200, 'Cart updated');
            } else {
                entity = this.cartAdapter.toEntity(dto);
                await this.cartRepository.save(entity);
                return new CommonResponse(true, 201, 'Cart created');
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async deleteCartDetails(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const existing = await this.cartRepository.findOne({ where: { id: dto.id } });
            if (!existing) return new CommonResponse(false, 404, 'Cart not found');
            await this.cartRepository.delete({ id: dto.id });
            return new CommonResponse(true, 200, 'Cart deleted');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getCartsByCompanyAndUnit(): Promise<CommonResponse> {
        try {
            const data = await this.cartRepository.find({ relations: ['device', 'client'] });
            return new CommonResponse(true, 200, 'Cart list fetched', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getCartDetailsById(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const entity = await this.cartRepository.findOne({ where: { id: dto.id }, relations: ['device', 'client'] });
            if (!entity) return new CommonResponse(false, 404, 'Cart not found');
            return new CommonResponse(true, 200, 'Cart fetched', this.cartAdapter.toResponse(entity));
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
