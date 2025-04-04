import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { VehicleTypeAdapter } from './vehicle-type.adapter';
import { VehicleTypeRepository } from './repo/vehicle-type.repo';
import { VehicleTypeDto } from './dto/vehicle-type.dto';
import { VehicleTypeEntity } from './entity/vehicle-type.entity';


@Injectable()
export class VehicleTypeService {
    constructor(
        private readonly vehicleTypeAdapter: VehicleTypeAdapter,
        private readonly vehicleTypeRepository: VehicleTypeRepository,
    ) {

    }
    async handleVehicleTypeDetails(dto: VehicleTypeDto): Promise<CommonResponse> {
        try {

            if (dto.id) {
                return await this.updateVehicleTypeDetails(dto);
            } else {
                console.log("+++++++")
                return await this.createVehicleTypeDetails(dto);
            }
        } catch (error) {
            console.error(`Error handling VehicleType details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to handle VehicleType details: ${error.message}`);
        }
    }


    async createVehicleTypeDetails(dto: VehicleTypeDto, filePaths?: Record<string, string | null>): Promise<CommonResponse> {
        try {
            const entity = this.vehicleTypeAdapter.convertDtoToEntity(dto);

            console.log(entity, "entity")
            await this.vehicleTypeRepository.insert(entity);
            return new CommonResponse(true, 201, 'VehicleType details created successfully');
        } catch (error) {
            console.error(`Error creating VehicleType details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create VehicleType details: ${error.message}`);
        }
    }

    async updateVehicleTypeDetails(dto: VehicleTypeDto): Promise<CommonResponse> {
        try {
            const existingVehicleType = await this.vehicleTypeRepository.findOne({ where: { id: dto.id } });

            if (!existingVehicleType) {
                throw new Error('VehicleType not found');
            }

            await this.vehicleTypeRepository.update(dto.id, {
                name: dto.name,
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


    async deleteVehicleTypeDetails(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const VehicleType = await this.vehicleTypeRepository.findOne({
                where: {
                    id: dto.id,
                    companyCode: dto.companyCode,
                    unitCode: dto.unitCode
                }
            });

            if (!VehicleType) {
                return new CommonResponse(false, 404, 'VehicleType not found');
            }

            await this.vehicleTypeRepository.delete({ id: VehicleType.id });

            return new CommonResponse(true, 200, 'VehicleType details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async getVehicleTypeDetailsById(req: HiringIdDto): Promise<CommonResponse> {
        try {
            console.log(req, "+++++++++++")

            const VehicleType = await this.vehicleTypeRepository.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });

            if (!VehicleType) {
                return new CommonResponse(false, 404, 'VehicleType not found');
            }
            else {
                return new CommonResponse(true, 200, 'VehicleType details fetched successfully', VehicleType);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getVehicleTypeDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const VehicleType = await this.vehicleTypeRepository.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!VehicleType) {
                return new CommonResponse(false, 404, 'VehicleType not found');
            }
            else {
                const data = this.vehicleTypeAdapter.convertEntityToDto(VehicleType)
                return new CommonResponse(true, 200, 'VehicleType details fetched successfully', data);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getVehicleTypeNamesDropDown(): Promise<CommonResponse> {
        const data = await this.vehicleTypeRepository.find({ select: ['name', 'id'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }

}
