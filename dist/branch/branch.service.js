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
exports.BranchService = void 0;
const storage_1 = require("@google-cloud/storage");
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const branch_adapter_1 = require("./branch.adapter");
const branch_repo_1 = require("./repo/branch.repo");
let BranchService = class BranchService {
    constructor(adapter, branchRepo) {
        this.adapter = adapter;
        this.branchRepo = branchRepo;
        this.storage = new storage_1.Storage({
            projectId: process.env.GCLOUD_PROJECT_ID || 'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    async saveBranchDetails(dto, photos) {
        try {
            photos = photos ?? { photo: [], image: [] };
            let filePaths = { photo: undefined, image: undefined };
            console.log(dto, "Received DTO");
            for (const [key, fileArray] of Object.entries(photos)) {
                if (fileArray?.length > 0) {
                    const file = fileArray[0];
                    const uniqueFileName = `branch_photos/${Date.now()}-${file.originalname}`;
                    const storageFile = this.storage.bucket(this.bucketName).file(uniqueFileName);
                    await storageFile.save(file.buffer, {
                        contentType: file.mimetype,
                        resumable: false,
                    });
                    console.log(`File uploaded to GCS: ${uniqueFileName}`);
                    filePaths[key] = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
                }
            }
            let entity = null;
            if (dto.id) {
                entity = await this.branchRepo.findOneBy({ id: dto.id });
                if (!entity) {
                    throw new error_response_1.ErrorResponse(404, 'Branch not found');
                }
                const photoMapping = {
                    photo: 'branchPhoto',
                    image: 'qrPhoto'
                };
                for (const key in photoMapping) {
                    const entityField = photoMapping[key];
                    if (filePaths[key]) {
                        const existingFilePath = entity[entityField];
                        if (typeof existingFilePath === 'string') {
                            const existingFileName = existingFilePath.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                            const file = this.storage.bucket(this.bucketName).file(existingFileName);
                            try {
                                await file.delete();
                                console.log(`Deleted old file from GCS: ${existingFileName}`);
                            }
                            catch (error) {
                                console.error(`Error deleting old file from GCS: ${error.message}`);
                            }
                        }
                        entity[entityField] = filePaths[key];
                    }
                }
                entity = this.branchRepo.merge(entity, dto);
            }
            else {
                entity = this.adapter.convertBranchDtoToEntity(dto);
                entity.branchPhoto = filePaths.photo;
                entity.qrPhoto = filePaths.image;
            }
            console.log("Final data before saving:", entity);
            await this.branchRepo.save(entity);
            const message = dto.id ? 'Branch Details Updated Successfully' : 'Branch Details Created Successfully';
            return new common_response_1.CommonResponse(true, 200, message);
        }
        catch (error) {
            console.error('Error saving branch details:', error);
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async deleteBranchDetails(dto) {
        try {
            const branchExists = await this.branchRepo.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!branchExists) {
                throw new error_response_1.ErrorResponse(404, `Branch with ID ${dto.id} does not exist`);
            }
            await this.branchRepo.delete(dto.id);
            return new common_response_1.CommonResponse(true, 65153, 'Branch Details Deleted Successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(5417, error.message);
        }
    }
    async getBranchDetails(req) {
        const branch = await this.branchRepo.find({
            where: { companyCode: req.companyCode, unitCode: req.unitCode }
        });
        console.log(branch, ">>>>>");
        if (!branch.length) {
            return new common_response_1.CommonResponse(false, 35416, "There Is No List");
        }
        else {
            return new common_response_1.CommonResponse(true, 35416, "Branch List Retrieved Successfully", branch);
        }
    }
    async getBranchStaff(req) {
        const branch = await this.branchRepo.getBranchStaff(req);
        if (!branch.length) {
            return new common_response_1.CommonResponse(false, 35416, "There Is No List");
        }
        else {
            return new common_response_1.CommonResponse(true, 35416, "Branch List Retrieved Successfully", branch);
        }
    }
    async getBranchDetailsById(req) {
        try {
            console.log(req, "}}}}}}}}}}}}}}");
            const branch = await this.branchRepo.findOne({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staff', 'asserts'],
            });
            if (!branch) {
                return new common_response_1.CommonResponse(false, 404, 'No Branch Found');
            }
            console.log(branch, "::::::::::::::::");
            const data = {
                branchId: branch.id,
                branchName: branch.branchName,
                branchNumber: branch.branchNumber,
                address: branch.branchAddress,
                branchOpening: branch.branchOpening,
                addressLine1: branch.addressLine1,
                city: branch.city,
                addressLine2: branch.addressLine2,
                state: branch.state,
                email: branch.email,
                pincode: branch.pincode,
                branchPhoto: branch.branchPhoto,
                companyCode: branch.companyCode,
                unitCode: branch.unitCode,
                staff: branch.staff.map(staff => ({
                    name: staff.name,
                    designation: staff.designation,
                    staffPhoto: staff.staffPhoto,
                })),
                asserts: branch.asserts.map(assert => ({
                    name: assert.assertsName,
                    photo: assert.assetPhoto,
                    amount: assert.assertsAmount,
                    type: assert.assetType
                })),
            };
            console.log(data, "?/////////");
            return new common_response_1.CommonResponse(true, 200, 'Branch Retrieved Successfully', data);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getBranchNamesDropDown() {
        const data = await this.branchRepo.find({ select: ['branchName', 'id', 'branchNumber'] });
        if (data.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data);
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "There Is No branch names");
        }
    }
};
exports.BranchService = BranchService;
exports.BranchService = BranchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [branch_adapter_1.BranchAdapter,
        branch_repo_1.BranchRepository])
], BranchService);
//# sourceMappingURL=branch.service.js.map