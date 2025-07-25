import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { SubDealerStaffAdapter } from './sub-dealer-staff.adapter';
import { SubDealerStaffRepository } from './repo/sub-dealer-staff.repo';
import { CreateSubDealerStaffDto } from './dto/sub-dealer-staff.dto';
import { StaffSearchDto } from 'src/staff/dto/staff-search.dto';
import { LoginDto } from 'src/login/dto/login.dto';



@Injectable()
export class SubDealerStaffService {
    constructor(
        private readonly adapter: SubDealerStaffAdapter,
        private readonly repo: SubDealerStaffRepository,
    ) {

    }
    async handleSubDealerStaffDetails(dto: CreateSubDealerStaffDto): Promise<CommonResponse> {
        try {

            if (dto.id) {
                return await this.updateSubDealerStaffDetails(dto);
            } else {
                console.log("+++++++")
                return await this.createSubDealerStaffDetails(dto);
            }
        } catch (error) {
            console.error(`Error handling SubDealerStaff details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to handle SubDealerStaff details: ${error.message}`);
        }
    }


    async createSubDealerStaffDetails(dto: CreateSubDealerStaffDto, filePaths?: Record<string, string | null>): Promise<CommonResponse> {
        try {
            const entity = this.adapter.toEntity(dto);

            console.log(entity, "entity")
            await this.repo.insert(entity);
            return new CommonResponse(true, 201, 'SubDealerStaff details created successfully');
        } catch (error) {
            console.error(`Error creating SubDealerStaff details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create SubDealerStaff details: ${error.message}`);
        }
    }

    async updateSubDealerStaffDetails(dto: CreateSubDealerStaffDto): Promise<CommonResponse> {
        try {
            const existingStaff = await this.repo.findOne({ where: { id: dto.id } });

            if (!existingStaff) {
                throw new Error('SubDealerStaff not found');
            }

            await this.repo.update(dto.id, {
                name: dto.name,
                companyCode: dto.companyCode,
                unitCode: dto.unitCode,
                description: dto.description,
                gender: dto.gender,
                dob: dto.dob,
                email: dto.email,
                phoneNumber: dto.phoneNumber,
                alternateNumber: dto.alternateNumber,
                staffId: dto.staffId,
                password: dto.password,
                aadharNumber: dto.aadharNumber,
                panCardNumber: dto.panCardNumber,
                address: dto.address,
            });

            return new CommonResponse(true, 200, 'SubDealerStaff details updated successfully');
        } catch (error) {
            console.error(`Error updating SubDealerStaff details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update SubDealerStaff details: ${error.message}`);
        }
    }


    async deleteSubDealerStaffDetails(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const SubDealerStaff = await this.repo.findOne({
                where: {
                    id: dto.id,
                    companyCode: dto.companyCode,
                    unitCode: dto.unitCode
                }
            });

            if (!SubDealerStaff) {
                return new CommonResponse(false, 404, 'SubDealerStaff not found');
            }

            await this.repo.delete({ id: SubDealerStaff.id });

            return new CommonResponse(true, 200, 'SubDealerStaff details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async getSubDealerStaffDetailsById(req: HiringIdDto): Promise<CommonResponse> {
        try {
            console.log(req, "+++++++++++")

            const SubDealerStaff = await this.repo.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['subDealerId'] });

            if (!SubDealerStaff) {
                return new CommonResponse(false, 404, 'SubDealerStaff not found');
            }
            else {
                return new CommonResponse(true, 200, 'SubDealerStaff details fetched successfully', SubDealerStaff);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getSubDealerStaffDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const SubDealerStaff = await this.repo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode }, 
                relations: ['subDealerId'],
                order: {
                    createdAt: 'DESC'  // <- this is what adds the descending sort
                } });
            if (!SubDealerStaff) {
                return new CommonResponse(false, 404, 'SubDealerStaff not found');
            }
            else {
                // const data = this.adapter.toResponseDtoList(SubDealerStaff)
                return new CommonResponse(true, 200, 'SubDealerStaff details fetched successfully', SubDealerStaff);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getSubDealerStaffNamesDropDown(): Promise<CommonResponse> {
        const data = await this.repo.find({ select: ['name', 'id'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }

    async getSubDealerStaffSearchDetails(req: StaffSearchDto) {
        const staffData = await this.repo.getSubDealerStaffSearchDetails(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }

    async getSubDealerStaffLogin(req: LoginDto): Promise<CommonResponse> {
        try {
            const subDealerStaff = await this.repo.findOne({ where: { staffId: req.staffId, password: req.password, companyCode: req.companyCode, unitCode: req.unitCode },relations:['subDealerId'] });
            if (!subDealerStaff) {
                return new CommonResponse(false, 404, 'subDealerStaff not found');
            }
            //   const resDto = this.subDealerStaffAdapter.convertEntityToDto(subDealerStaff);

            return new CommonResponse(true, 200, 'subDealerStaff details fetched successfully', subDealerStaff);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
