// service/cart.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './repo/cart-repo';
import { CreateCartDto, DeleteDto } from './dto/cart.dto';
import { CartAdapter } from './adapter/cart-.adapter';
import { CommonResponse } from 'src/models/common-response';
import { CartEntity } from './entity/cart.entity';
import { ErrorResponse } from 'src/models/error-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { In } from 'typeorm';

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

    async deleteCartDetails(dto: DeleteDto): Promise<CommonResponse> {
        const ids = dto.ids ?? (dto.id ? [dto.id] : []);

        if (!ids.length) {
            throw new BadRequestException('No valid Cart IDs provided');
        }

        // Find all existing IDs from the database
        const existingOrders = await this.cartRepository.find({
            where: { id: In(ids) },
            select: ['id'], // Only select the ID for efficiency
        });

        const foundIds = existingOrders.map(order => order.id);
        const notFoundIds = ids.filter(id => !foundIds.includes(id));

        // Delete only the found IDs
        if (foundIds.length > 0) {
            await this.cartRepository.delete({ id: In(foundIds) });
        }

        // Construct response message
        const deletedCount = foundIds.length;
        const message = `${deletedCount} Cart(s) deleted.` +
            (notFoundIds.length > 0 ? ` Some Cart(s) not found: [${notFoundIds.join(', ')}]` : '');

        return new CommonResponse(true, 200, message);
    }


    // async deleteCartDetails(dto: DeleteDto): Promise<CommonResponse> {
    //     const ids = dto.ids ?? (dto.id ? [dto.id] : []);

    //     if (!ids.length) {
    //         throw new BadRequestException('No valid Cart IDs provided');
    //     }

    //     const existing = await this.cartRepository.findOne({ where: { id: In(ids) } });
    //     if (!existing) return new CommonResponse(false, 404, 'Cart not found');

    //     const result = await this.cartRepository.delete(
    //         { id: In(ids) },
    //     );

    //     if (result.affected === 0) {
    //         throw new NotFoundException('Carts not found');
    //     }
    //     return new CommonResponse(true, 200, 'cart(s) deleted successfully');

    // }

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
