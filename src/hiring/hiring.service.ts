import { Injectable } from '@nestjs/common';
import { HiringEntity } from './entity/hiring.entity';
import { HiringDto } from './dto/hiring.dto';
import { HiringAdapter } from './hiring.adapter';
import { ErrorResponse } from 'src/models/error-response';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from './dto/hiring-id.dto';
import { HiringRepository } from './repo/hiring.repo';
import { join } from 'path';
import * as fs from 'fs';
import { HiringFilterDto } from './dto/hiring-filter.dto';
import { CommonReq } from 'src/models/common-req';
@Injectable()
export class HiringService {
    constructor(private readonly hiringAdapter: HiringAdapter,
        private readonly hiringRepository: HiringRepository
    ) { }
    async saveHiringDetails(dto: HiringDto, file?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let resumePath: string | undefined;

            if (file) {
                resumePath = await this.uploadResume(file);
            }
            let entity: HiringEntity;

            if (dto.id) {
                entity = await this.hiringRepository.findOne({ where: { id: dto.id } });

                if (!entity) {
                    throw new ErrorResponse(404, 'details not found');
                }
                // Merge updated details
                entity = this.hiringRepository.merge(entity, dto);

            } else {
                // For new branches, convert DTO to Entity
                entity = this.hiringAdapter.convertDtoToEntity(dto);
            }
            if (resumePath) {
                entity.resumePath = resumePath; // Set the file path in the entity
            }
            await this.hiringRepository.save(entity);

            const internalMessage = dto.id
                ? 'Hiring details updated successfully'
                : 'Hiring details created successfully';

            return new CommonResponse(true, 65152, internalMessage, { resumePath: resumePath });
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async uploadResume(file: Express.Multer.File): Promise<string> {
        try {
            const filePath = join(__dirname, '../../uploads/resumes', `${Date.now()}.pdf`);

            await fs.promises.writeFile(filePath, file.fieldname);

            return filePath;
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getHiringDetailsById(req: HiringIdDto): Promise<CommonResponse> {
        try {
            const hiring = await HiringEntity.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!hiring) {
                throw new ErrorResponse(404, 'Hiring record not found');
            }
            return new CommonResponse(true, 200, 'Hiring details fetched successfully', hiring);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getHiringDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const hiring = await HiringEntity.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!hiring.length) {
                throw new ErrorResponse(404, 'Hiring record not found');
            }
            return new CommonResponse(true, 200, 'Hiring details fetched successfully', hiring);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async deleteHiringDetails(req: HiringIdDto): Promise<CommonResponse> {
        const hiring = await HiringEntity.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
        try {
            if (!hiring) {
                throw new ErrorResponse(404, 'Hiring record not found');
            }
            await HiringEntity.remove(hiring);
            return new CommonResponse(true, 200, 'hiring details deleted successfully');
        }
        catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }




    async getHiringSearchDetails(req: HiringFilterDto) {
        const query = this.hiringRepository.createQueryBuilder('hiring')
            .select([
                'hiring.id AS hiringId',
                'hiring.candidate_name AS candidateName',
                'hiring.phone_number AS phoneNumber',
                'hiring.email AS email',
                'hiring.address AS address',
                'hiring.qualifications AS qualifications',
                'hiring.resume_path AS resumePath',
                'hiring.date_of_upload AS dateOfUpload',
                'hiring.status AS status',
                'hiring.company_code AS companyCode',
                'hiring.unit_code AS unitCode',
            ])
            .where(`hiring.company_code = "${req.companyCode}"`)
            .andWhere(`hiring.unit_code = "${req.unitCode}"`)

        if (req.hiringId) {
            query.andWhere('hiring.id = :hiringId', { hiringId: req.hiringId });
        }

        if (req.candidateName) {
            query.andWhere('hiring.candidate_name LIKE :candidateName', {
                candidateName: `%${req.candidateName}%`,
            });
        }

        if (req.status) {
            query.andWhere('hiring.status = :status', { status: req.status });
        }

        const result = await query.getRawMany();
        return result;
    }
}
