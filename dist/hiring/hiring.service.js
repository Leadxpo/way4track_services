"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiringService = void 0;
const common_1 = require("@nestjs/common");
const hiring_entity_1 = require("./entity/hiring.entity");
const hiring_adapter_1 = require("./hiring.adapter");
const error_response_1 = require("../models/error-response");
const common_response_1 = require("../models/common-response");
const hiring_repo_1 = require("./repo/hiring.repo");
const path_1 = require("path");
const fs = require("fs");
const storage_1 = require("@google-cloud/storage");
const hiring_status_enum_1 = require("./enum/hiring-status.enum");
let HiringService = class HiringService {
    constructor(hiringAdapter, hiringRepository) {
        this.hiringAdapter = hiringAdapter;
        this.hiringRepository = hiringRepository;
        this.storage = new storage_1.Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    async saveHiringDetails(dto, resumeFile) {
        try {
            let resumePath;
            let entity;
            console.log(dto, ":::::::::::::::::");
            if (dto.id) {
                entity = await this.hiringRepository.findOne({ where: { id: dto.id } });
                console.log(entity, ">>>>>>>>>");
                if (!entity) {
                    throw new error_response_1.ErrorResponse(404, 'details not found');
                }
                entity = this.hiringRepository.merge(entity, dto);
                if (resumeFile && entity.resumePath) {
                    const existingFilePath = entity.resumePath.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                    const file = this.storage.bucket(this.bucketName).file(existingFilePath);
                    try {
                        await file.delete();
                        console.log(`Deleted old file from GCS: ${existingFilePath}`);
                    }
                    catch (error) {
                        console.error(`Error deleting old file from GCS: ${error.message}`);
                    }
                }
            }
            else {
                entity = this.hiringAdapter.convertDtoToEntity(dto);
                console.log(entity, ";;;;;;;;;");
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
            console.log(entity, "//////");
            await this.hiringRepository.save(entity);
            const internalMessage = dto.id
                ? 'Hiring details updated successfully'
                : 'Hiring details created successfully';
            return new common_response_1.CommonResponse(true, 65152, internalMessage, { resumePath: resumePath });
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async uploadResume(file) {
        try {
            const filePath = (0, path_1.join)(__dirname, '../../uploads/resumes', `${Date.now()}.pdf`);
            await fs.promises.writeFile(filePath, file.fieldname);
            return filePath;
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getHiringDetailsById(req) {
        try {
            const hiring = await hiring_entity_1.HiringEntity.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!hiring) {
                throw new error_response_1.ErrorResponse(404, 'Hiring record not found');
            }
            return new common_response_1.CommonResponse(true, 200, 'Hiring details fetched successfully', hiring);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getHiringDetails(req) {
        try {
            const hiring = await this.hiringRepository.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!hiring.length) {
                throw new error_response_1.ErrorResponse(404, 'Hiring record not found');
            }
            return new common_response_1.CommonResponse(true, 200, 'Hiring details fetched successfully', hiring);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async deleteHiringDetails(req) {
        const hiring = await hiring_entity_1.HiringEntity.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
        try {
            if (!hiring) {
                throw new error_response_1.ErrorResponse(404, 'Hiring record not found');
            }
            await hiring_entity_1.HiringEntity.remove(hiring);
            return new common_response_1.CommonResponse(true, 200, 'hiring details deleted successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getHiringSearchDetails(req) {
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
        console.log(req.status, "????????");
        const result = await query.getRawMany();
        console.log(result, "PPPPPPPPPPP");
        return new common_response_1.CommonResponse(true, 200, 'Hiring details retrieved successfully', result);
    }
    async getCandidatesStatsLast30Days(req) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
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
            qualifiedStatus: hiring_status_enum_1.HiringStatus.QUALIFIED,
        })
            .getRawOne();
        return {
            totalAttended: parseInt(result.totalAttended, 10) || 0,
            totalQualified: parseInt(result.totalQualified, 10) || 0,
        };
    }
    async getHiringTodayDetails(req) {
        const timezoneOffset = new Date().getTimezoneOffset();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        startOfDay.setMinutes(startOfDay.getMinutes() - timezoneOffset);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        endOfDay.setMinutes(endOfDay.getMinutes() - timezoneOffset);
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
};
exports.HiringService = HiringService;
exports.HiringService = HiringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hiring_adapter_1.HiringAdapter,
        hiring_repo_1.HiringRepository])
], HiringService);
//# sourceMappingURL=hiring.service.js.map