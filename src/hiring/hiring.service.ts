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
import { Storage } from '@google-cloud/storage';
import { HiringStatus } from './enum/hiring-status.enum';

@Injectable()
export class HiringService {
    private storage: Storage;
    private bucketName: string;
    constructor(private readonly hiringAdapter: HiringAdapter,
        private readonly hiringRepository: HiringRepository
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async saveHiringDetails(dto: HiringDto, resumeFile?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let resumePath: string | undefined;
            let entity: HiringEntity;
            if (dto.id) {
                entity = await this.hiringRepository.findOne({ where: { id: dto.id } });
                if (!entity) {
                    throw new ErrorResponse(404, 'details not found');
                }
                // Merge updated details
                entity = this.hiringRepository.merge(entity, dto);
                // If a new photo is uploaded, delete the existing file from GCS
                if (resumeFile && entity.resumePath) {
                    const existingFilePath = entity.resumePath.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                    const file = this.storage.bucket(this.bucketName).file(existingFilePath);

                    try {
                        await file.delete();
                        console.log(`Deleted old file from GCS: ${existingFilePath}`);
                    } catch (error) {
                        console.error(`Error deleting old file from GCS: ${error.message}`);
                    }
                }

            } else {
                // For new branches, convert DTO to Entity
                entity = this.hiringAdapter.convertDtoToEntity(dto);
                console.log(entity, ";;;;;;;;;")
            }


            if (resumeFile) {
                const bucket = this.storage.bucket(this.bucketName);
                const uniqueFileName = `resumes/${Date.now()}-${resumeFile.originalname}`;
                const file = bucket.file(uniqueFileName);

                await file.save(resumeFile.buffer, {
                    contentType: resumeFile.mimetype,
                    resumable: false,
                });

                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                resumePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
                entity.resumePath = resumePath;
            }
            console.log(entity, "//////")
            await this.hiringRepository.save(entity);

            const internalMessage = dto.id
                ? 'Hiring details updated successfully'
                : 'Hiring details created successfully';

            return new CommonResponse(true, 65152, internalMessage, { resumePath: resumePath });
        } catch (error) {
            console.error('Error saving hiring details:', error);

            // Handle TypeORM QueryFailedError (e.g., unique constraint, null value, etc.)
            const code = error.driverError?.code;
            let errorMessage = 'Database error occurred.';
            let field = '';

            switch (code) {
                case '23505': // unique_violation
                    field = error.driverError.detail?.match(/\(([^)]+)\)/)?.[1] || '';
                    errorMessage = 'Duplicate entry found.';
                    break;
                case '23502': // not_null_violation
                    field = error.driverError.column || '';
                    errorMessage = 'A required field is missing.';
                    break;
                case '23503': // foreign_key_violation
                    field = error.driverError.constraint || '';
                    errorMessage = 'Invalid reference to another table.';
                    break;
            }

            throw new ErrorResponse(400, `${errorMessage} ${field ? 'Field: ' + field : ''}`);
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
            const hiring = await this.hiringRepository.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode },
                order: {
                    createdAt: 'DESC'  // <- this is what adds the descending sort
                } });
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

    async getHiringSearchDetails(req: HiringFilterDto): Promise<CommonResponse> {
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
                'hiring.hiring_level AS hiringLevel',
            ])
            .where('hiring.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('hiring.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.status) {
            query.andWhere('hiring.status = :status', { status: req.status });
        }

        if (req.hiringId) {
            query.andWhere('hiring.id = :hiringId', { hiringId: req.hiringId });
        }

        if (req.candidateName) {
            query.andWhere('hiring.candidate_name LIKE :candidateName', {
                candidateName: `%${req.candidateName}%`,
            });
        }

        const result = await query.getRawMany();

        return new CommonResponse(true, 200, 'Hiring details retrieved successfully', result);
    }


    async getCandidatesStatsLast30Days(req: CommonReq): Promise<{ totalAttended: number, totalQualified: number }> {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Query to get total candidates attended and total qualified candidates
        const result = await this.hiringRepository
            .createQueryBuilder('hiring')
            .select('COUNT(*) AS totalAttended')
            .addSelect('SUM(CASE WHEN hiring.status = :qualifiedStatus THEN 1 ELSE 0 END) AS totalQualified')
            .where('hiring.created_at > :thirtyDaysAgo')
            .andWhere('hiring.company_code = :companyCode')
            .andWhere('hiring.unit_code = :unitCode')
            .setParameters({
                thirtyDaysAgo: thirtyDaysAgo.toISOString(),
                companyCode: req.companyCode,
                unitCode: req.unitCode,
                qualifiedStatus: HiringStatus.QUALIFIED,  // Ensure the status is referred here correctly
            })
            .getRawOne();

        // Parsing the results to ensure they are returned as numbers
        return {
            totalAttended: parseInt(result.totalAttended, 10) || 0,
            totalQualified: parseInt(result.totalQualified, 10) || 0,
        };
    }



    async getHiringTodayDetails(req: CommonReq) {
        const timezoneOffset = new Date().getTimezoneOffset(); // in minutes (positive = behind UTC, negative = ahead of UTC)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);  // Set to midnight in local time
        startOfDay.setMinutes(startOfDay.getMinutes() - timezoneOffset); // Adjust for the timezone offset

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);  // Set to the end of the day in local time
        endOfDay.setMinutes(endOfDay.getMinutes() - timezoneOffset);  // Set to the end of the day

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
                'hiring.hiring_level AS hiringLevel',
            ])
            .where('hiring.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('hiring.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('hiring.created_at BETWEEN :startOfDay AND :endOfDay', {
                startOfDay: startOfDay.toISOString(),
                endOfDay: endOfDay.toISOString(),
            });

        const result = await query.getRawMany();
        return result;
    }

    // async getHiringTodayDetails(req: CommonReq) {
    //     const timezoneOffset = 5.5 * 60;  // Timezone offset in minutes (for UTC+5:30)
    //     const startOfDay = new Date();
    //     startOfDay.setHours(0, 0, 0, 0);  // Set to midnight in local time
    //     startOfDay.setMinutes(startOfDay.getMinutes() - timezoneOffset);  // Adjust for the timezone offset

    //     const endOfDay = new Date();
    //     endOfDay.setHours(23, 59, 59, 999);  // Set to the end of the day in local time
    //     endOfDay.setMinutes(endOfDay.getMinutes() - timezoneOffset);  // Adjust for the timezone offset

    //     const query = this.hiringRepository.createQueryBuilder('hiring')
    //         .select([
    //             'hiring.id AS hiringId',
    //             'hiring.candidate_name AS candidateName',
    //             'hiring.phone_number AS phoneNumber',
    //             'hiring.email AS email',
    //             'hiring.address AS address',
    //             'hiring.qualifications AS qualifications',
    //             'hiring.resume_path AS resumePath',
    //             'hiring.date_of_upload AS dateOfUpload',
    //             'hiring.status AS status',
    //             'hiring.company_code AS companyCode',
    //             'hiring.unit_code AS unitCode',
    //             'hiring.hiring_level AS hiringLevel',
    //         ])
    //         .where('hiring.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('hiring.unit_code = :unitCode', { unitCode: req.unitCode })
    //         .andWhere('hiring.created_at BETWEEN :startOfDay AND :endOfDay', {
    //             startOfDay: startOfDay.toISOString(),
    //             endOfDay: endOfDay.toISOString(),
    //         });

    //     const result = await query.getRawMany();
    //     return result;
    // }




}
