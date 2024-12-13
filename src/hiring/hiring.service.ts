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
@Injectable()
export class HiringService {
    constructor(private readonly hiringAdapter: HiringAdapter,
        private readonly hiringRepository: HiringRepository
    ) { }
    async saveHiringDetails(dto: HiringDto): Promise<CommonResponse> {
        try {
            const internalMessage = dto.id
                ? 'Hiring details updated successfully'
                : 'Hiring details created successfully';
            const hiringEntity = this.hiringAdapter.convertDtoToEntity(dto);
            await this.hiringRepository.save(hiringEntity);
            return new CommonResponse(true, 65152, internalMessage);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }



    async getHiringDetails(req: HiringIdDto): Promise<CommonResponse> {
        try {
            const hiring = await HiringEntity.find({ where: { id: req.id } });
            if (!hiring.length) {
                throw new ErrorResponse(404, 'Hiring record not found');
            }
            return new CommonResponse(true, 200, 'Hiring details fetched successfully', hiring);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async deleteHiringDetails(req: HiringIdDto): Promise<CommonResponse> {
        const hiring = await HiringEntity.findOne({ where: { id: req.id } });
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

    async uploadResume(hiringId: number, file: Express.Multer.File): Promise<CommonResponse> {
        try {
            const hiring = await HiringEntity.findOne({ where: { id: hiringId } });

            if (!hiring) {
                throw new ErrorResponse(404, 'Hiring record not found');
            }

            const filePath = join(__dirname, '../../uploads/resumes', `${hiringId}-${Date.now()}.pdf`);
            await fs.promises.writeFile(filePath, file.buffer);

            hiring.resumePath = filePath;
            await this.hiringRepository.save(hiring);

            return new CommonResponse(true, 200, 'Resume uploaded successfully', { resumePath: filePath });
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
