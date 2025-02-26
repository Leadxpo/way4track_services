import { Injectable } from '@nestjs/common';
import { NotificationEnum } from 'src/notifications/entity/notification.entity';
import { NotificationService } from 'src/notifications/notification.service';
import { ProductEntity } from 'src/product/entity/product.entity';
import { CommonResponse } from '../models/common-response';
import { PaymentStatus } from 'src/product/dto/payment-status.enum';
import { TechnicianWorksDto } from 'src/technician-works/dto/technician-works.dto';
import { DispatchDto } from './dto/dispatch.dto';
import { DispatchRepository } from './repo/dispatch.repo';
import { DispatchAdapter } from './dispatch.adapter';
import { ErrorResponse } from 'src/models/error-response';
import { DispatchEntity } from './entity/dispatch.entity';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { ClientRepository } from 'src/client/repo/client.repo';
import { SubDealerRepository } from 'src/sub-dealer/repo/sub-dealer.repo';
import { ProductAssignRepository } from 'src/product-assign/repo/product-assign.repo';

@Injectable()
export class DispatchService {
    constructor(

        private readonly repo: DispatchRepository,
        private readonly adapter: DispatchAdapter,
        private readonly staffRepository: StaffRepository,
        private readonly clientRepository: ClientRepository,
        private readonly subDealerRepository: SubDealerRepository,
        private readonly productAssignRepo: ProductAssignRepository,
    ) { }

    async updateDispatchDetails(dto: DispatchDto): Promise<CommonResponse> {
        try {
            const Dispatch = await this.repo.findOne({
                where: { id: dto.id }
            });

            if (!Dispatch) {
                throw new Error('Work Allocation not found');
            }

            const updatedDispatch = this.adapter.convertDtoToEntity(dto);

            Object.assign(Dispatch, updatedDispatch);


            await this.repo.save(Dispatch);

            return new CommonResponse(true, 200, 'Work allocation updated successfully with product details');
        } catch (error) {
            console.error(`Error updating work allocation: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update work allocation: ${error.message}`);
        }
    }

    async createDispatchDetails(dto: DispatchDto): Promise<CommonResponse> {
        try {
            const newDispatch = await this.adapter.convertDtoToEntity(dto);

            if (dto.staffId) {
                const staff = await this.staffRepository.findOne({ where: { staffId: dto.staffId } });
                if (!staff) throw new Error(`Staff with ID ${dto.staffId} not found`);
                newDispatch.staffId = staff;
            }

            if (dto.assignedProductsId) {
                const assignedProducts = await this.productAssignRepo.findOne({ where: { id: dto.assignedProductsId } });
                if (!assignedProducts) throw new Error(`Staff with ID ${dto.assignedProductsId} not found`);
                newDispatch.assignedProductsId = assignedProducts;
            }

            if (dto.clientId) {
                const client = await this.clientRepository.findOne({ where: { clientId: dto.clientId } });
                if (!client) throw new Error(`Client with ID ${dto.clientId} not found`);
                newDispatch.clientId = client;
            }

            if (dto.subDealerId) {
                const subDealer = await this.subDealerRepository.findOne({ where: { subDealerId: dto.subDealerId } });
                if (!subDealer) throw new Error(`Sub-dealer with ID ${dto.subDealerId} not found`);
                newDispatch.subDealerId = subDealer;
            }

            await this.repo.insert(newDispatch);
            return new CommonResponse(true, 200, 'Work allocation and technician details created successfully');
        } catch (error) {
            console.error(`Error creating work allocation details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create work allocation details: ${error.message}`);
        }
    }


    async handleDispatchDetails(dto: DispatchDto): Promise<CommonResponse> {

        if (dto.id && dto.id !== null) {
            return await this.updateDispatchDetails(dto);
        } else {
            return await this.createDispatchDetails(dto);
        }
    }

    async deleteDispatch(req: HiringIdDto): Promise<CommonResponse> {
        try {
            const allocation = await this.repo.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!allocation) {
                return new CommonResponse(false, 404, 'Work Allocation not found');
            }
            await this.repo.delete(req.id);
            return new CommonResponse(true, 200, 'Work Allocation deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getDispatchDetailsById(req: HiringIdDto): Promise<CommonResponse> {
        try {
            const allocation = await this.repo.findOne({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staffId', 'clientId', 'subDealerId', 'assignedProductsId']
            });

            if (!allocation) {
                return new CommonResponse(false, 404, 'Work Allocation not found');
            } else {

                return new CommonResponse(true, 200, 'Work Allocation fetched successfully', allocation);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getDispatchDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const allocation = await this.repo.find({
                where: { companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staffId', 'clientId', 'subDealerId']
            });
            console.log(allocation,
                ">>>>>>>>>"
            )
            if (!allocation) {
                return new CommonResponse(false, 404, 'Work Allocation not found');
            } else {
                const data = await this.adapter.convertEntityToDto(allocation)
                console.log(data, "???")
                return new CommonResponse(true, 200, 'Work Allocation fetched successfully', data);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getDispatchData(req: {
        fromDate?: string;
        toDate?: string;
        transportId?: string;
        companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        try {
            const allocation = await this.repo.getDispatchData(req);
            if (!allocation) {
                return new CommonResponse(false, 404, 'Work Allocation not found');
            } else {
                return new CommonResponse(true, 200, 'Work Allocation fetched successfully', allocation);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
