import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { AttendenceRepository } from 'src/attendence/repo/attendence.repo';
import { LoginDto } from 'src/login/dto/login.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { StaffIdDto } from './dto/staff-id.dto';
import { Qualifications, StaffDto } from './dto/staff.dto';
import { Qualification, StaffEntity } from './entity/staff.entity';
import { StaffRepository } from './repo/staff-repo';
import { StaffAdapter } from './staff.adaptert';
import { PermissionsDto } from 'src/permissions/dto/permissions.dto';
import { PermissionsService } from 'src/permissions/permissions.services';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { LettersDto } from 'src/letters/dto/letters.dto';
import { LettersService } from 'src/letters/letters.service';
import { LettersRepository } from 'src/letters/repo/letters.repo';
import { LettersEntity } from 'src/letters/entity/letters.entity';
import { DesignationRepository } from 'src/designation/repo/designation.repo';


@Injectable()
export class StaffService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private adapter: StaffAdapter,
        private staffRepository: StaffRepository,
        private attendanceRepo: AttendenceRepository,
        private service: PermissionsService,
        private lettersService: LettersService,
        private letterRepo: LettersRepository,
        private designationRepository: DesignationRepository
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleStaffDetails(req: StaffDto, files: any): Promise<CommonResponse> {
        try {

            if (req.id && req.id !== null || (req.staffId && req.staffId.trim() !== '')) {
                console.log("🔄 Updating existing staff record...");
                return await this.updateStaffDetails(req, files);
            } else {
                console.log("🆕 Creating a new staff record...");
                return await this.createStaffDetails(req, files);
            }
        } catch (error) {
            console.error(`❌ Error handling staff details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to handle staff details: ${error.message}`);
        }
    }
    async createStaffDetails(req: StaffDto, files: any): Promise<CommonResponse> {
        try {
            const newStaff = this.adapter.convertDtoToEntity(req);
            console.log(req, "req");

            // Fetch DesignationEntity based on designation_id
            let designationEntity = null;
            if (req.designation_id) {
                designationEntity = await this.designationRepository.findOne({
                    where: { id: req.designation_id }
                });

                if (!designationEntity) {
                    throw new Error(`Designation with ID '${req.designation_id}' not found.`);
                }
                console.log(designationEntity, 'designationEntity');

                newStaff.designation = designationEntity.designation; // Store name
                newStaff.designationRelation = designationEntity; // Store relation
            }

            // Generate Staff ID
            newStaff.staffId = `SF-${(await this.staffRepository.count() + 1).toString().padStart(5, '0')}`;

            // Upload Staff Photo
            if (files?.photo?.[0]) {
                newStaff.staffPhoto = await this.uploadFile(files.photo[0], `staff_photos/${newStaff.staffId}.jpg`);
            }

            // Upload Vehicle Photo
            if (files?.vehiclePhoto?.[0]) {
                newStaff.vehiclePhoto = await this.uploadFile(files.vehiclePhoto[0], `vehicle_photos/${newStaff.staffId}.jpg`);
            }

            // Upload Resume
            if (files?.resume?.[0]) {
                newStaff.resume = await this.uploadFile(files.resume[0], `resume/${newStaff.staffId}.jpg`);
            }

            // Handle Qualifications and Qualification Files
            let qualifications: Qualifications[] = Array.isArray(req.qualifications) ? [...req.qualifications] : [];

            if (files?.qualificationFiles) {
                for (let i = 0; i < files.qualificationFiles.length; i++) {
                    const file = files.qualificationFiles[i];
                    const filePath = await this.uploadFile(file, `qualification_files/${newStaff.staffId}_${file.originalname}`);

                    if (qualifications[i]) {
                        qualifications[i].file = filePath;
                    } else {
                        console.warn(`No matching qualification found for file: ${file.originalname}. Adding default entry.`);
                        qualifications.push({
                            qualificationName: Qualification.TENTH,
                            marksOrCgpa: null,
                            file: filePath
                        });
                    }
                }
            }

            newStaff.qualifications = qualifications;
            console.log(newStaff, ">>>>>>>>>>")
            // Save Staff Record
            await this.staffRepository.save(newStaff);

            // Assign Permissions
            const permissionsDto: PermissionsDto = {
                staffId: newStaff.staffId,
                companyCode: req.companyCode,
                unitCode: req.unitCode
            };
            console.log(permissionsDto, "><<<<<<<<<<<")
            await this.service.savePermissionDetails(permissionsDto);

            // Upload Letter Documents
            const lettersDto: LettersDto = {
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
            console.log(lettersDto, "=====<<<<")

            await this.lettersService.saveLetterDetails(lettersDto);

            return new CommonResponse(true, 65152, 'Staff Details and Permissions Created Successfully');
        } catch (error) {
            console.error(`Error creating staff details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create staff details: ${error.message}`);
        }
    }


    // async createStaffDetails(req: StaffDto, files: any): Promise<CommonResponse> {
    //     try {
    //         const newStaff = this.adapter.convertDtoToEntity(req);

    //         console.log(req, "req");
    //         if (req.designation) {
    //             // const designationEntity = await this.designationRepository.findOne({
    //             //     where: { designation: req.designation, companyCode: req.companyCode, unitCode: req.unitCode },
    //             // });
    //             const designationEntity = await this.designationRepository.findOne({
    //                 where: { id: req.designation_id }, // Fetch the designation
    //               });

    //               const newStaff = this.staffRepository.create({
    //                 ...req,
    //                 designation: designationEntity ? designationEntity.designation : null, // Store name
    //                 designationEntity, // Store relation
    //               });

    //               await this.staffRepository.save(newStaff);


    //             if (!designationEntity) {
    //                 throw new Error(`Designation '${req.designation}' not found for companyCode '${req.companyCode}' and unitCode '${req.unitCode}'`);
    //             }

    //             newStaff.designation = designationEntity.designation; // Assign the DesignationEntity, not a string
    //         }
    //         newStaff.staffId = `SF-${(await this.staffRepository.count() + 1).toString().padStart(5, '0')}`;

    //         // Upload staff photo to GCS
    //         if (files?.photo?.[0]) {
    //             newStaff.staffPhoto = await this.uploadFile(files.photo[0], `staff_photos/${newStaff.staffId}.jpg`);
    //         }

    //         // Upload vehicle photo to GCS
    //         if (files?.vehiclePhoto?.[0]) {
    //             newStaff.vehiclePhoto = await this.uploadFile(files.vehiclePhoto[0], `vehicle_photos/${newStaff.staffId}.jpg`);
    //         }

    //         if (files?.resume?.[0]) {
    //             newStaff.resume = await this.uploadFile(files.resume[0], `resume/${newStaff.staffId}.jpg`)
    //         }

    //         const qualifications = Array.isArray(req.qualifications) ? [...req.qualifications] : [];

    //         if (files?.qualificationFiles) {
    //             for (let i = 0; i < files.qualificationFiles.length; i++) {
    //                 const file = files.qualificationFiles[i];
    //                 const filePath = await this.uploadFile(file, `qualification_files/${newStaff.staffId}_${file.originalname}`);

    //                 if (qualifications[i]) {
    //                     qualifications[i].file = filePath;
    //                 } else {
    //                     console.warn(`No matching qualification found for file: ${file.originalname}. Adding default entry.`);
    //                     qualifications.push({
    //                         qualificationName: Qualification.TENTH, // Consider dynamically assigning a better fallback
    //                         marksOrCgpa: null, // Null if unknown instead of forcing 0
    //                         file: filePath
    //                     });
    //                 }
    //             }
    //         }

    //         newStaff.qualifications = qualifications;



    //         await this.staffRepository.insert(newStaff);

    //         const permissionsDto: PermissionsDto = {
    //             staffId: newStaff.staffId,
    //             companyCode: req.companyCode,
    //             unitCode: req.unitCode
    //         };

    //         await this.service.savePermissionDetails(permissionsDto);

    //         // Upload all letter files to GCS and save URLs in LettersDto
    //         const lettersDto: LettersDto = {
    //             staffId: newStaff.staffId,
    //             companyCode: req.companyCode,
    //             unitCode: req.unitCode,
    //             offerLetter: files?.offerLetter?.[0] ? await this.uploadFile(files.offerLetter[0], `letters/${newStaff.staffId}_offer.pdf`) : null,
    //             resignationLetter: files?.resignationLetter?.[0] ? await this.uploadFile(files.resignationLetter[0], `letters/${newStaff.staffId}_resignation.pdf`) : null,
    //             terminationLetter: files?.terminationLetter?.[0] ? await this.uploadFile(files.terminationLetter[0], `letters/${newStaff.staffId}_termination.pdf`) : null,
    //             appointmentLetter: files?.appointmentLetter?.[0] ? await this.uploadFile(files.appointmentLetter[0], `letters/${newStaff.staffId}_appointment.pdf`) : null,
    //             leaveFormat: files?.leaveFormat?.[0] ? await this.uploadFile(files.leaveFormat[0], `letters/${newStaff.staffId}_leave.pdf`) : null,
    //             relievingLetter: files?.relievingLetter?.[0] ? await this.uploadFile(files.relievingLetter[0], `letters/${newStaff.staffId}_relieving.pdf`) : null,
    //             experienceLetter: files?.experienceLetter?.[0] ? await this.uploadFile(files.experienceLetter[0], `letters/${newStaff.staffId}_experience.pdf`) : null
    //         };

    //         await this.lettersService.saveLetterDetails(lettersDto);


    //         return new CommonResponse(true, 65152, 'Staff Details and Permissions Created Successfully');
    //     } catch (error) {
    //         console.error(`Error creating staff details: ${error.message}`, error.stack);
    //         throw new ErrorResponse(5416, `Failed to create staff details: ${error.message}`);
    //     }
    // }
    //don't delete this code
    // async updateStaffDetails(req: StaffDto, files: any): Promise<CommonResponse> {
    //     try {
    //         let existingStaff: StaffEntity | null = null;

    //         if (req.id) {
    //             existingStaff = await this.staffRepository.findOne({
    //                 where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }
    //             });
    //         } else if (req.staffId) {
    //             existingStaff = await this.staffRepository.findOne({
    //                 where: { staffId: req.staffId, companyCode: req.companyCode, unitCode: req.unitCode }
    //             });
    //         }

    //         if (!existingStaff) {
    //             return new CommonResponse(false, 4002, 'Staff not found for the provided ID.');
    //         }

    //         // ✅ Handle file updates
    //         const updatedStaff: Partial<StaffEntity> = {
    //             ...existingStaff,
    //             ...this.adapter.convertDtoToEntity(req)
    //         };

    //         if (files?.photo?.[0]) {
    //             if (existingStaff.staffPhoto) {
    //                 await this.deleteFile(existingStaff.staffPhoto);
    //             }
    //             updatedStaff.staffPhoto = await this.uploadFile(files.photo[0], `staff_photos/${existingStaff.staffId}.jpg`);
    //         }

    //         if (files?.vehiclePhoto?.[0]) {
    //             if (existingStaff.vehiclePhoto) {
    //                 await this.deleteFile(existingStaff.vehiclePhoto);
    //             }
    //             updatedStaff.vehiclePhoto = await this.uploadFile(files.vehiclePhoto[0], `vehicle_photos/${existingStaff.staffId}.jpg`);
    //         }

    //         let existingLetters = await this.letterRepo.findOne({ where: { staffId: { staffId: existingStaff.staffId } } });

    //         if (!existingLetters) {
    //             existingLetters = new LettersEntity();
    //             existingLetters.staffId = existingStaff;
    //             existingLetters.companyCode = req.companyCode;
    //             existingLetters.unitCode = req.unitCode;
    //         }

    //         // ✅ Handle letter file updates
    //         const letterUpdates: Partial<LettersEntity> = {
    //             offerLetter: files?.offerLetter?.[0]
    //                 ? await this.uploadFile(files.offerLetter[0], `letters/${existingStaff.staffId}_offer.pdf`)
    //                 : existingLetters.offerLetter,

    //             resignationLetter: files?.resignationLetter?.[0]
    //                 ? await this.uploadFile(files.resignationLetter[0], `letters/${existingStaff.staffId}_resignation.pdf`)
    //                 : existingLetters.resignationLetter,

    //             terminationLetter: files?.terminationLetter?.[0]
    //                 ? await this.uploadFile(files.terminationLetter[0], `letters/${existingStaff.staffId}_termination.pdf`)
    //                 : existingLetters.terminationLetter,

    //             appointmentLetter: files?.appointmentLetter?.[0]
    //                 ? await this.uploadFile(files.appointmentLetter[0], `letters/${existingStaff.staffId}_appointment.pdf`)
    //                 : existingLetters.appointmentLetter,

    //             leaveFormat: files?.leaveFormat?.[0]
    //                 ? await this.uploadFile(files.leaveFormat[0], `letters/${existingStaff.staffId}_leave.pdf`)
    //                 : existingLetters.leaveFormat,

    //             relievingLetter: files?.relievingLetter?.[0]
    //                 ? await this.uploadFile(files.relievingLetter[0], `letters/${existingStaff.staffId}_relieving.pdf`)
    //                 : existingLetters.relievingLetter,

    //             experienceLetter: files?.experienceLetter?.[0]
    //                 ? await this.uploadFile(files.experienceLetter[0], `letters/${existingStaff.staffId}_experience.pdf`)
    //                 : existingLetters.experienceLetter,
    //         };

    //         // ✅ Update the existing staff details
    //         await this.staffRepository.update(existingStaff.id, updatedStaff);

    //         // ✅ Update the existing letter record if it exists, otherwise save a new one
    //         if (existingLetters.id) {
    //             await this.letterRepo.update(existingLetters.id, letterUpdates);
    //         } else {
    //             await this.letterRepo.save({ ...existingLetters, ...letterUpdates });
    //         }

    //         return new CommonResponse(true, 65152, 'Staff Details and Letters Updated Successfully');
    //     } catch (error) {
    //         console.error(`Error updating staff details: ${error.message}`, error.stack);
    //         throw new ErrorResponse(5416, `Failed to update staff details: ${error.message}`);
    //     }
    // }

    // async updateStaffDetails(req: StaffDto, files: any): Promise<CommonResponse> {
    //     try {
    //         let existingStaff: StaffEntity | null = null;

    //         if (req.id) {
    //             existingStaff = await this.staffRepository.findOne({
    //                 where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }
    //             });
    //         } else if (req.staffId) {
    //             existingStaff = await this.staffRepository.findOne({
    //                 where: { staffId: req.staffId, companyCode: req.companyCode, unitCode: req.unitCode }
    //             });
    //         }

    //         if (!existingStaff) {
    //             return new CommonResponse(false, 4002, 'Staff not found for the provided ID.');
    //         }

    //         // ✅ Handle file updates
    //         const updatedStaff: Partial<StaffEntity> = {
    //             ...existingStaff,
    //             ...this.adapter.convertDtoToEntity(req)
    //         };

    //         if (files?.photo?.[0]) {
    //             if (existingStaff.staffPhoto) {
    //                 await this.deleteFile(existingStaff.staffPhoto);
    //             }
    //             updatedStaff.staffPhoto = await this.uploadFile(files.photo[0], `staff_photos/${existingStaff.staffId}.jpg`);
    //         }

    //         if (files?.vehiclePhoto?.[0]) {
    //             if (existingStaff.vehiclePhoto) {
    //                 await this.deleteFile(existingStaff.vehiclePhoto);
    //             }
    //             updatedStaff.vehiclePhoto = await this.uploadFile(files.vehiclePhoto[0], `vehicle_photos/${existingStaff.staffId}.jpg`);
    //         }

    //         if (files?.resume?.[0]) {
    //             if (existingStaff.resume) {
    //                 await this.deleteFile(existingStaff.resume)
    //             }
    //             updatedStaff.resume = await this.uploadFile(files.resume[0], `resume/${existingStaff.resume}.jpg`)
    //         }

    //         let existingLetters = await this.letterRepo.findOne({ where: { staffId: { staffId: existingStaff.staffId } } });

    //         if (!existingLetters) {
    //             existingLetters = new LettersEntity();
    //             existingLetters.staffId = existingStaff;
    //             existingLetters.companyCode = req.companyCode;
    //             existingLetters.unitCode = req.unitCode;
    //         }

    //         // ✅ Handle letter file updates
    //         const letterFiles = [
    //             "offerLetter", "resignationLetter", "terminationLetter",
    //             "appointmentLetter", "leaveFormat", "relievingLetter", "experienceLetter"
    //         ];

    //         const letterUpdates: Partial<LettersEntity> = {};

    //         for (const letterType of letterFiles) {
    //             if (files?.[letterType]?.[0]) {
    //                 if (existingLetters[letterType]) {
    //                     await this.deleteFile(existingLetters[letterType]);
    //                 }
    //                 letterUpdates[letterType] = await this.uploadFile(files[letterType][0], `letters/${existingStaff.staffId}_${letterType}.pdf`);
    //             } else {
    //                 letterUpdates[letterType] = existingLetters[letterType];
    //             }
    //         }
    //         if (updatedStaff.designation !== req.designation) {
    //             let designationEntity = null;

    //             designationEntity = await this.designationRepository.findOne({
    //                 where: { id: req.designation_id }
    //             });

    //             if (!designationEntity) {
    //                 throw new Error(`Designation with ID '${req.designation_id}' not found.`);
    //             }
    //             console.log(designationEntity, 'designationEntity');

    //             updatedStaff.designation = designationEntity.designation; // Store name
    //             updatedStaff.designationRelation = designationEntity;

    //             const permissionsDto: PermissionsDto = {
    //                 staffId: updatedStaff.staffId,
    //                 companyCode: req.companyCode,
    //                 unitCode: req.unitCode
    //             };
    //             await this.service.savePermissionDetails(permissionsDto);
    //         }
    //         // ✅ Update the existing staff details
    //         await this.staffRepository.update(existingStaff.id, updatedStaff);


    //         // ✅ Update the existing letter record if it exists, otherwise save a new one
    //         if (existingLetters.id) {
    //             await this.letterRepo.update(existingLetters.id, letterUpdates);
    //         } else {
    //             await this.letterRepo.save({ ...existingLetters, ...letterUpdates });
    //         }

    //         return new CommonResponse(true, 65152, 'Staff Details and Letters Updated Successfully');
    //     } catch (error) {
    //         console.error(`Error updating staff details: ${error.message}`, error.stack);
    //         throw new ErrorResponse(5416, `Failed to update staff details: ${error.message}`);
    //     }
    // }


    async updateStaffDetails(req: StaffDto, files: any): Promise<CommonResponse> {
        try {
            let existingStaff: StaffEntity | null = await this.staffRepository.findOne({
                where: { staffId: req.staffId, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['designationRelation']
            });

            if (!existingStaff) {
                return new CommonResponse(false, 4002, 'Staff not found for the provided ID.');
            }

            // Check if designation has changed
            const designationChanged = existingStaff.designationRelation?.id !== req.designation_id;

            // Update staff details
            const updatedStaff: Partial<StaffEntity> = {
                ...existingStaff,
                ...this.adapter.convertDtoToEntity(req)
            };

            // Handle designation change
            if (designationChanged) {
                const permissionsDto: PermissionsDto = {
                    staffId: existingStaff.staffId,
                    companyCode: req.companyCode,
                    unitCode: req.unitCode
                };

                await this.service.updatePermissionDetails(permissionsDto);
            }

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
                    await this.deleteFile(existingStaff.resume)
                }
                updatedStaff.resume = await this.uploadFile(files.resume[0], `resume/${existingStaff.resume}.jpg`)
            }



            let existingLetters = await this.letterRepo.findOne({ where: { staffId: { staffId: existingStaff.staffId } } });

            if (!existingLetters) {
                existingLetters = new LettersEntity();
                existingLetters.staffId = existingStaff;
                existingLetters.companyCode = req.companyCode;
                existingLetters.unitCode = req.unitCode;
            }

            // ✅ Handle letter file updates
            const letterFiles = [
                "offerLetter", "resignationLetter", "terminationLetter",
                "appointmentLetter", "leaveFormat", "relievingLetter", "experienceLetter"
            ];

            const letterUpdates: Partial<LettersEntity> = {};

            for (const letterType of letterFiles) {
                if (files?.[letterType]?.[0]) {
                    if (existingLetters[letterType]) {
                        await this.deleteFile(existingLetters[letterType]);
                    }
                    letterUpdates[letterType] = await this.uploadFile(files[letterType][0], `letters/${existingStaff.staffId}_${letterType}.pdf`);
                } else {
                    letterUpdates[letterType] = existingLetters[letterType];
                }
            }

            await this.staffRepository.update(existingStaff.id, updatedStaff);

            if (existingLetters.id) {
                await this.letterRepo.update(existingLetters.id, letterUpdates);
            } else {
                await this.letterRepo.save({ ...existingLetters, ...letterUpdates });
            }

            return new CommonResponse(true, 65152, 'Staff Details Updated Successfully');
        } catch (error) {
            console.error('Error:', error.message);
            throw new ErrorResponse(5416, error.message);
        }
    }


    async deleteFile(fileUrl: string): Promise<void> {
        try {
            const existingFilePath = fileUrl.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
            const file = this.storage.bucket(this.bucketName).file(existingFilePath);
            await file.delete();
            console.log(`Deleted old file from GCS: ${existingFilePath}`);
        } catch (error) {
            console.error(`Error deleting old file from GCS: ${error.message}`);
        }
    }


    private async uploadFile(file: Express.Multer.File, fileName: string): Promise<string> {
        const bucket = this.storage.bucket(this.bucketName);
        const fileRef = bucket.file(fileName);

        await fileRef.save(file.buffer, {
            contentType: file.mimetype,
            resumable: false,
        });

        console.log(`File uploaded to GCS: ${fileName}`);
        return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    }


    async deleteStaffDetails(dto: StaffIdDto): Promise<CommonResponse> {
        try {
            const staffExists = await this.staffRepository.findOne({ where: { staffId: dto.staffId, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!staffExists) {
                throw new ErrorResponse(404, `staff with staffId ${dto.staffId} does not exist`);
            }
            await this.staffRepository.delete(dto.staffId);
            return new CommonResponse(true, 65153, 'staff Details Deleted Successfully');
        } catch (error) {
            throw new ErrorResponse(5417, error.message);
        }
    }


    async getStaffDetails(req: CommonReq): Promise<CommonResponse> {
        const branch = await this.staffRepository.find({
            where: { companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branch', 'voucherId', 'designationRelation']
        });
        if (!branch.length) {
            return new CommonResponse(false, 35416, "There Is No List");
        } else {
            return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", branch);
        }
    }

    async getStaffDetailsById(req: StaffIdDto): Promise<CommonResponse> {
        try {
            const staff = await this.staffRepository.createQueryBuilder('staff')
                .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = staff.branch_id')
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
                return new CommonResponse(false, 404, 'Staff not found');
            }
            console.log(staff);  // Log the result before conversion to DTO

            // const data = this.adapter.convertEntityToDto([staff]);
            // console.log(data);  // Log the result before conversion to DTO

            return new CommonResponse(true, 200, 'Staff details fetched successfully', staff);
        } catch (error) {
            console.error("Error in getStaffDetailsById service:", error);
            return new CommonResponse(false, 500, 'Error fetching staff details');
        }
    }


    async getStaffProfileDetails(req: LoginDto): Promise<CommonResponse> {
        try {
            const staff = await this.staffRepository.find({
                relations: ['branch', 'voucherId', 'notifications', 'permissions', 'designationRelation'],
                where: {
                    staffId: req.staffId,
                    password: req.password,
                    companyCode: req.companyCode,
                    unitCode: req.unitCode,
                    designation: req.designation  // Fix: Compare by designation name
                },
            });

            if (!staff.length) {
                return new CommonResponse(false, 404, 'Staff not found');
            } else {
                const data = this.adapter.convertEntityToDto(staff);
                return new CommonResponse(true, 200, 'Staff details fetched successfully', data);
            }
        } catch (error) {
            console.error("Error in getStaffProfileDetails service:", error);
            return new CommonResponse(false, 500, 'Error fetching staff details');
        }
    }


    async getStaffNamesDropDown(): Promise<CommonResponse> {
        const data = await this.staffRepository.find({ select: ['name', 'id', 'staffId'], relations: ['designationRelation'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No staff names")
        }
    }
}
