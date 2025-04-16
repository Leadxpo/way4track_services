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
exports.StaffService = void 0;
const storage_1 = require("@google-cloud/storage");
const common_1 = require("@nestjs/common");
const attendence_repo_1 = require("../attendence/repo/attendence.repo");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const staff_entity_1 = require("./entity/staff.entity");
const staff_repo_1 = require("./repo/staff-repo");
const staff_adaptert_1 = require("./staff.adaptert");
const permissions_services_1 = require("../permissions/permissions.services");
const branch_entity_1 = require("../branch/entity/branch.entity");
const letters_service_1 = require("../letters/letters.service");
const letters_repo_1 = require("../letters/repo/letters.repo");
const letters_entity_1 = require("../letters/entity/letters.entity");
const designation_repo_1 = require("../designation/repo/designation.repo");
const qualifications_enum_1 = require("./enum/qualifications.enum");
const staff_status_1 = require("./enum/staff-status");
let StaffService = class StaffService {
    constructor(adapter, staffRepository, attendanceRepo, service, lettersService, letterRepo, designationRepository) {
        this.adapter = adapter;
        this.staffRepository = staffRepository;
        this.attendanceRepo = attendanceRepo;
        this.service = service;
        this.lettersService = lettersService;
        this.letterRepo = letterRepo;
        this.designationRepository = designationRepository;
        this.storage = new storage_1.Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    async handleStaffDetails(req, files) {
        try {
            if (req.id) {
                console.log("🔄 Updating existing staff record...");
                return await this.updateStaffDetails(req, files);
            }
            else {
                console.log("🆕 Creating a new staff record...");
                return await this.createStaffDetails(req, files);
            }
        }
        catch (error) {
            console.error(`❌ Error handling staff details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to handle staff details: ${error.message}`);
        }
    }
    async createStaffDetails(req, files) {
        try {
            const newStaff = this.adapter.convertDtoToEntity(req);
            console.log(req, "req");
            let designationEntity = null;
            if (req.designation_id) {
                designationEntity = await this.designationRepository.findOne({
                    where: { id: req.designation_id }
                });
                if (!designationEntity) {
                    throw new Error(`Designation with ID '${req.designation_id}' not found.`);
                }
                console.log(designationEntity, 'designationEntity');
                newStaff.designation = designationEntity.designation;
                console.log(newStaff.designation, "::::::::::::::::::::::::");
                newStaff.designationRelation = designationEntity;
            }
            if (files?.photo?.[0]) {
                newStaff.staffPhoto = await this.uploadFile(files.photo[0], `staff_photos/${newStaff.staffId}.jpg`);
            }
            if (files?.vehiclePhoto?.[0]) {
                newStaff.vehiclePhoto = await this.uploadFile(files.vehiclePhoto[0], `vehicle_photos/${newStaff.staffId}.jpg`);
            }
            if (files?.resume?.[0]) {
                newStaff.resume = await this.uploadFile(files.resume[0], `resume/${newStaff.staffId}.jpg`);
            }
            let qualifications = Array.isArray(req.qualifications) ? [...req.qualifications] : [];
            let experience = Array.isArray(req.experienceDetails) ? [...req.experienceDetails] : [];
            if (files?.qualificationFiles) {
                for (let i = 0; i < files.qualificationFiles.length; i++) {
                    const file = files.qualificationFiles[i];
                    const filePath = await this.uploadFile(file, `qualification_files/${newStaff.staffId}_${file.originalname}`);
                    if (qualifications[i]) {
                        qualifications[i].file = filePath;
                    }
                    else {
                        console.warn(`No matching qualification found for file: ${file.originalname}. Adding default entry.`);
                        qualifications.push({
                            qualificationName: staff_entity_1.Qualification.TENTH,
                            marksOrCgpa: null,
                            file: filePath
                        });
                    }
                }
            }
            console.log(qualifications, "qualifications");
            if (files?.experience) {
                for (let i = 0; i < files.experience.length; i++) {
                    const file = files.experience[i];
                    const filePath = await this.uploadFile(file, `experience_files/${newStaff.staffId}_${file.originalname}`);
                    if (experience[i]) {
                        experience[i].uploadLetters = filePath;
                    }
                    else {
                        experience.push({
                            previousCompany: '',
                            previous_designation: '',
                            total_experience: '',
                            previous_salary: '',
                            letter: qualifications_enum_1.Letters.OFFER_LETTER,
                            uploadLetters: filePath,
                        });
                    }
                }
            }
            console.log(experience, "experience");
            newStaff.qualifications = qualifications;
            newStaff.experienceDetails = experience;
            console.log(newStaff, ">>>>>>>>>>");
            await this.staffRepository.save(newStaff);
            const permissionsDto = {
                staffId: newStaff.staffId,
                companyCode: req.companyCode,
                unitCode: req.unitCode
            };
            console.log(permissionsDto, "><<<<<<<<<<<");
            await this.service.savePermissionDetails(permissionsDto);
            const lettersDto = {
                staffId: newStaff.staffId,
                companyCode: req.companyCode,
                unitCode: req.unitCode,
                offerLetter: files?.offerLetter?.[0] ? await this.uploadFile(files.offerLetter[0], `letters/${newStaff.staffId}_offer.pdf`) : null,
                resignationLetter: files?.resignationLetter?.[0] ? await this.uploadFile(files.resignationLetter[0], `letters/${newStaff.staffId}_resignation.pdf`) : null,
                terminationLetter: files?.terminationLetter?.[0] ? await this.uploadFile(files.terminationLetter[0], `letters/${newStaff.staffId}_termination.pdf`) : null,
                appointmentLetter: files?.appointmentLetter?.[0] ? await this.uploadFile(files.appointmentLetter[0], `letters/${newStaff.staffId}_appointment.pdf`) : null,
                leaveFormat: files?.leaveFormat?.[0] ? await this.uploadFile(files.leaveFormat[0], `letters/${newStaff.staffId}_leave.pdf`) : null,
                relievingLetter: files?.relievingLetter?.[0] ? await this.uploadFile(files.relievingLetter[0], `letters/${newStaff.staffId}_relieving.pdf`) : null,
                experienceLetter: files?.experienceLetter?.[0] ? await this.uploadFile(files.experienceLetter[0], `letters/${newStaff.staffId}_experience.pdf`) : null
            };
            console.log(lettersDto, "=====<<<<");
            await this.lettersService.saveLetterDetails(lettersDto);
            return new common_response_1.CommonResponse(true, 65152, 'Staff Details and Permissions Created Successfully');
        }
        catch (error) {
            console.error(`Error creating staff details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to create staff details: ${error.message}`);
        }
    }
    async updateStaffDetails(req, files) {
        try {
            let existingStaff = await this.staffRepository.findOne({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['designationRelation']
            });
            if (!existingStaff) {
                return new common_response_1.CommonResponse(false, 4002, 'Staff not found for the provided ID.');
            }
            console.log(existingStaff, "??????????????");
            if (req.designation_id) {
                const designationChanged = existingStaff.designationRelation?.id !== req.designation_id;
                if (designationChanged) {
                    const permissionsDto = {
                        staffId: existingStaff.staffId,
                        companyCode: req.companyCode,
                        unitCode: req.unitCode
                    };
                    await this.service.updatePermissionDetails(permissionsDto);
                }
                console.log(designationChanged, "designationChanged");
            }
            const updatedStaff = {
                ...existingStaff,
                ...this.adapter.convertDtoToEntity(req)
            };
            console.log(updatedStaff, "?>>>>>>>>>>>>>>");
            if (files?.photo?.[0]) {
                if (existingStaff.staffPhoto) {
                    await this.deleteFile(existingStaff.staffPhoto);
                }
                updatedStaff.staffPhoto = await this.uploadFile(files.photo[0], `staff_photos/${existingStaff.staffId}.jpg`);
            }
            if (files?.vehiclePhoto?.[0]) {
                if (existingStaff.vehiclePhoto) {
                    await this.deleteFile(existingStaff.vehiclePhoto);
                }
                updatedStaff.vehiclePhoto = await this.uploadFile(files.vehiclePhoto[0], `vehicle_photos/${existingStaff.staffId}.jpg`);
            }
            if (files?.resume?.[0]) {
                if (existingStaff.resume) {
                    await this.deleteFile(existingStaff.resume);
                }
                updatedStaff.resume = await this.uploadFile(files.resume[0], `resume/${existingStaff.resume}.jpg`);
            }
            let existingLetters = await this.letterRepo.findOne({ where: { staffId: { staffId: existingStaff.staffId } } });
            if (!existingLetters) {
                existingLetters = new letters_entity_1.LettersEntity();
                existingLetters.staffId = existingStaff;
                existingLetters.companyCode = req.companyCode;
                existingLetters.unitCode = req.unitCode;
            }
            const letterFiles = [
                "offerLetter", "resignationLetter", "terminationLetter",
                "appointmentLetter", "leaveFormat", "relievingLetter", "experienceLetter"
            ];
            const letterUpdates = {};
            for (const letterType of letterFiles) {
                if (files?.[letterType]?.[0]) {
                    if (existingLetters[letterType]) {
                        await this.deleteFile(existingLetters[letterType]);
                    }
                    letterUpdates[letterType] = await this.uploadFile(files[letterType][0], `letters/${existingStaff.staffId}_${letterType}.pdf`);
                }
                else {
                    letterUpdates[letterType] = existingLetters[letterType];
                }
            }
            await this.staffRepository.update(existingStaff.id, updatedStaff);
            if (letterUpdates) {
                if (existingLetters.id) {
                    await this.letterRepo.update(existingLetters.id, letterUpdates);
                }
                else {
                    await this.letterRepo.save({ ...existingLetters, ...letterUpdates });
                }
            }
            return new common_response_1.CommonResponse(true, 65152, 'Staff Details Updated Successfully');
        }
        catch (error) {
            console.error('Error:', error.message);
            throw new error_response_1.ErrorResponse(5416, error.message);
        }
    }
    async deleteFile(fileUrl) {
        try {
            const existingFilePath = fileUrl.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
            const file = this.storage.bucket(this.bucketName).file(existingFilePath);
            await file.delete();
            console.log(`Deleted old file from GCS: ${existingFilePath}`);
        }
        catch (error) {
            console.error(`Error deleting old file from GCS: ${error.message}`);
        }
    }
    async uploadFile(file, fileName) {
        const bucket = this.storage.bucket(this.bucketName);
        const fileRef = bucket.file(fileName);
        await fileRef.save(file.buffer, {
            contentType: file.mimetype,
            resumable: false,
        });
        console.log(`File uploaded to GCS: ${fileName}`);
        return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    }
    async deleteStaffDetails(dto) {
        try {
            const staffExists = await this.staffRepository.findOne({ where: { staffId: dto.staffId, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!staffExists) {
                throw new error_response_1.ErrorResponse(404, `staff with staffId ${dto.staffId} does not exist`);
            }
            await this.staffRepository.delete(dto.staffId);
            return new common_response_1.CommonResponse(true, 65153, 'staff Details Deleted Successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(5417, error.message);
        }
    }
    async getStaffDetails(req) {
        const branch = await this.staffRepository.find({
            where: { companyCode: req.companyCode, unitCode: req.unitCode },
            relations: ['branch']
        });
        const staffDtos = this.adapter.convertEntityToDto(branch);
        if (staffDtos.length === 0) {
            return new common_response_1.CommonResponse(false, 35416, "There Is No List");
        }
        return new common_response_1.CommonResponse(true, 35416, "Branch List Retrieved Successfully", staffDtos);
    }
    async getStaffDetailsById(req) {
        try {
            const staff = await this.staffRepository.createQueryBuilder('staff')
                .leftJoinAndSelect(branch_entity_1.BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .leftJoinAndSelect('staff.voucherId', 'voucher')
                .leftJoinAndSelect('staff.staffFrom', 'staffFrom')
                .leftJoinAndSelect('staff.staffTo', 'staffTo')
                .leftJoinAndSelect('staff.request', 'request')
                .leftJoinAndSelect('staff.productAssign', 'productAssign')
                .leftJoinAndSelect('staff.permissions', 'permissions')
                .where('staff.staffId = :staffId', { staffId: req.staffId })
                .andWhere('staff.companyCode = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unitCode = :unitCode', { unitCode: req.unitCode })
                .getOne();
            if (!staff) {
                return new common_response_1.CommonResponse(false, 404, 'Staff not found');
            }
            console.log(staff);
            return new common_response_1.CommonResponse(true, 200, 'Staff details fetched successfully', staff);
        }
        catch (error) {
            console.error("Error in getStaffDetailsById service:", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching staff details');
        }
    }
    async getStaffProfileDetails(req) {
        try {
            const staff = await this.staffRepository.findOne({
                where: {
                    staffId: req.staffId,
                    password: req.password,
                    companyCode: req.companyCode,
                    unitCode: req.unitCode,
                    designation: req.designation,
                }, relations: ['branch', 'permissions']
            });
            if (!staff) {
                return new common_response_1.CommonResponse(false, 404, 'Invalid credentials');
            }
            if (staff.status !== staff_status_1.StaffStatus.ACTIVE) {
                return new common_response_1.CommonResponse(false, 403, 'Staff is not active');
            }
            return new common_response_1.CommonResponse(true, 200, 'Staff details fetched successfully', staff);
        }
        catch (error) {
            console.error("Error in getStaffProfileDetails service:", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching staff details');
        }
    }
    async getStaffNamesDropDown() {
        const data = await this.staffRepository.find({ select: ['name', 'id', 'staffId'], relations: ['designationRelation'] });
        if (data.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data);
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "There Is No staff names");
        }
    }
    async getStaffVerification(req) {
        let data = null;
        if (req.phoneNumber) {
            data = await this.staffRepository.findOne({ where: { phoneNumber: req.phoneNumber } });
        }
        else if (req.staffId) {
            data = await this.staffRepository.findOne({ where: { staffId: req.staffId } });
        }
        else if (req.aadharNumber) {
            data = await this.staffRepository.findOne({ where: { aadharNumber: req.aadharNumber } });
        }
        else if (req.email) {
            data = await this.staffRepository.findOne({ where: { email: req.email } });
        }
        if (data) {
            return new common_response_1.CommonResponse(true, 75483, "Data already exists");
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "No matching data found");
        }
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [staff_adaptert_1.StaffAdapter,
        staff_repo_1.StaffRepository,
        attendence_repo_1.AttendenceRepository,
        permissions_services_1.PermissionsService,
        letters_service_1.LettersService,
        letters_repo_1.LettersRepository,
        designation_repo_1.DesignationRepository])
], StaffService);
//# sourceMappingURL=staff-services.js.map