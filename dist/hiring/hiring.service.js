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
let HiringService = class HiringService {
    constructor(hiringAdapter, hiringRepository) {
        this.hiringAdapter = hiringAdapter;
        this.hiringRepository = hiringRepository;
    }
    async saveHiringDetails(dto) {
        try {
            const internalMessage = dto.id
                ? 'Hiring details updated successfully'
                : 'Hiring details created successfully';
            const hiringEntity = this.hiringAdapter.convertDtoToEntity(dto);
            await this.hiringRepository.save(hiringEntity);
            return new common_response_1.CommonResponse(true, 65152, internalMessage);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getHiringDetails(req) {
        try {
            const hiring = await hiring_entity_1.HiringEntity.find({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
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
    async uploadResume(hiringId, file) {
        try {
            const hiring = await hiring_entity_1.HiringEntity.findOne({ where: { id: hiringId } });
            if (!hiring) {
                throw new error_response_1.ErrorResponse(404, 'Hiring record not found');
            }
            const filePath = (0, path_1.join)(__dirname, '../../uploads/resumes', `${hiringId}-${Date.now()}.pdf`);
            await fs.promises.writeFile(filePath, file.buffer);
            hiring.resumePath = filePath;
            await this.hiringRepository.save(hiring);
            return new common_response_1.CommonResponse(true, 200, 'Resume uploaded successfully', { resumePath: filePath });
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
        ])
            .where(`hiring.company_code = "${req.companyCode}"`)
            .andWhere(`hiring.unit_code = "${req.unitCode}"`);
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
};
exports.HiringService = HiringService;
exports.HiringService = HiringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hiring_adapter_1.HiringAdapter,
        hiring_repo_1.HiringRepository])
], HiringService);
//# sourceMappingURL=hiring.service.js.map