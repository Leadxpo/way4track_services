import { Injectable } from '@nestjs/common';
import { PromocodeAdapter } from './promo.adapter';
import { PromocodeDto } from './dto/promo.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { PromocodesRepository } from './repo/promo.repo';
import {PromoEntity } from './entity/promo.entity';

@Injectable()
export class PromocodeService {
    constructor(
        private readonly promocodeAdapter: PromocodeAdapter,
        private readonly promocodeRepository: PromocodesRepository,
    ) { }

    async updatePromocodeDetails(dto: PromocodeDto): Promise<CommonResponse> {
        try {
            const existingPromocode = await this.promocodeRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
            });

            if (!existingPromocode) {
                return new CommonResponse(false, 4002, 'Promocode not found for the provided ID.');
            }

            // Update the promocode details
            Object.assign(existingPromocode, this.promocodeAdapter.convertDtoToEntity(dto));
            await this.promocodeRepository.save(existingPromocode);

            return new CommonResponse(true, 200, 'Promocode details updated successfully', existingPromocode);
        } catch (error) {
            console.error(`Error updating promocode details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update promocode details: ${error.message}`);
        }
    }

    async createPromocodeDetails(dto: PromocodeDto): Promise<CommonResponse> {
        try {
            console.error('Promocode DTO:', dto);


            const newPromocode = this.promocodeAdapter.convertDtoToEntity(dto);
            const lastPromocode = await this.promocodeRepository
                .createQueryBuilder("promocode")
                .select("MAX(promocode.id)", "max")
                .getRawOne();

            const nextId = (lastPromocode.max ?? 0) + 1;
            newPromocode.promocode = `Promocode-${nextId.toString().padStart(5, '0')}`;


            // newPromocode.promocodeNumber = `Promocode-${(await this.promocodeRepository.count() + 1).toString().padStart(5, '0')}`;


            console.log('New Promocode Data:', newPromocode);
            await this.promocodeRepository.insert(newPromocode); // 

            // Handle notifications after the promocode is saved


            return new CommonResponse(true, 65152, ' Details and Permissions Created Successfully');

        } catch (error) {
            console.error(`Error creating promocode details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create promocode details: ${error.message}`);
        }
    }

    async handlePromocodeDetails(dto: PromocodeDto): Promise<CommonResponse> {

        if (dto.id) {
            // If an ID is provided, update the promocode details
            return await this.updatePromocodeDetails(dto);
        } else {
            // If no ID is provided, create a new promocode record
            return await this.createPromocodeDetails(dto);
        }
    }

    async deletePromocodeDetails(req: {id:number;companyCode: string;unitCode: string}): Promise<CommonResponse> {
        try {
            const promocode = await this.promocodeRepository.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });

            if (!promocode) {
                return new CommonResponse(false, 404, 'Promocode not found');
            }

            await this.promocodeRepository.delete(promocode.id);
            return new CommonResponse(true, 200, 'Promocode details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getPromocodeDetailsById(req: {id:number;companyCode: string;unitCode: string}): Promise<CommonResponse> {
        try {
            const promocode = await this.promocodeRepository.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['staff', 'branch', 'subDealerId', 'subDealerStaffId', 'designationRelation'] });

            if (!promocode) {
                return new CommonResponse(false, 404, 'Promocode not found');
            }

            return new CommonResponse(true, 200, 'Promocode details fetched successfully', promocode);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getPromocodeDetails(req: { promocode?: string; companyCode: string; unitCode: string }): Promise<CommonResponse> {
        const PromocodeData = await this.promocodeRepository.getPromocodeDetails(req)
        if (!PromocodeData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", PromocodeData)
        }

    }
}
