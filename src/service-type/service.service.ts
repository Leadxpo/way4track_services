import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { ServiceTypeAdapter } from './service.adapter';
import { ServiceTypeRepository } from './repo/service.repo';
import { ServiceTypeDto } from './dto/service.dto';
import { ServiceTypeEntity } from './entity/service.entity';


@Injectable()
export class ServiceTypeService {
    constructor(
        private readonly serviceTypeAdapter: ServiceTypeAdapter,
        private readonly serviceTypeRepository: ServiceTypeRepository,
    ) {

    }
    async handleServiceTypeDetails(dto: ServiceTypeDto): Promise<CommonResponse> {
        try {

            if (dto.id) {
                return await this.updateServiceTypeDetails(dto);
            } else {
                console.log("+++++++")
                return await this.createServiceTypeDetails(dto);
            }
        } catch (error) {
            console.error(`Error handling ServiceType details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to handle ServiceType details: ${error.message}`);
        }
    }


    async createServiceTypeDetails(dto: ServiceTypeDto, filePaths?: Record<string, string | null>): Promise<CommonResponse> {
        try {
            const entity = this.serviceTypeAdapter.convertDtoToEntity(dto);

            console.log(entity, "entity")
            await this.serviceTypeRepository.insert(entity);
            return new CommonResponse(true, 201, 'ServiceType details created successfully');
        } catch (error) {
            console.error(`Error creating ServiceType details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create ServiceType details: ${error.message}`);
        }
    }

    async updateServiceTypeDetails(dto: ServiceTypeDto): Promise<CommonResponse> {
        try {
            const existingVehicleType = await this.serviceTypeRepository.findOne({ where: { id: dto.id } });

            if (!existingVehicleType) {
                throw new Error('VehicleType not found');
            }

            await this.serviceTypeRepository.update(dto.id, {
                name: dto.name,
                duration: dto.duration,
                companyCode: dto.companyCode,
                unitCode: dto.unitCode,
                description: dto.description,
            });

            return new CommonResponse(true, 200, 'VehicleType details updated successfully');
        } catch (error) {
            console.error(`Error updating VehicleType details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update VehicleType details: ${error.message}`);
        }
    }

    async deleteServiceTypeDetails(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const ServiceType = await this.serviceTypeRepository.findOne({
                where: {
                    id: dto.id,
                    companyCode: dto.companyCode,
                    unitCode: dto.unitCode
                }
            });

            if (!ServiceType) {
                return new CommonResponse(false, 404, 'ServiceType not found');
            }

            await this.serviceTypeRepository.delete({ id: dto.id });

            return new CommonResponse(true, 200, 'ServiceType details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async getServiceTypeDetailsById(req: HiringIdDto): Promise<CommonResponse> {
        try {
            console.log(req, "+++++++++++")

            const ServiceType = await this.serviceTypeRepository.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });

            if (!ServiceType) {
                return new CommonResponse(false, 404, 'ServiceType not found');
            }
            else {
                return new CommonResponse(true, 200, 'ServiceType details fetched successfully', ServiceType);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getServiceTypeDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const ServiceType = await this.serviceTypeRepository.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!ServiceType) {
                return new CommonResponse(false, 404, 'ServiceType not found');
            }
            else {
                const data = this.serviceTypeAdapter.convertEntityToDto(ServiceType)
                return new CommonResponse(true, 200, 'ServiceType details fetched successfully', data);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getServiceTypeNamesDropDown(): Promise<CommonResponse> {
        const data = await this.serviceTypeRepository.find({ select: ['name', 'id'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }

}
