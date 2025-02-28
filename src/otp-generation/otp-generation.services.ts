import { Injectable } from '@nestjs/common';
import { OTPRepository } from './repo/otp-generation.repo';
import { ChangePasswordDto, OTPDto, VerifyOtpDto } from './dto/otp.dto';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { CommonResponse } from 'src/models/common-response';
import { NotificationRepository } from 'src/notifications/repo/notification.repo';

@Injectable()
export class OTPGenerationService {
    constructor(
        private readonly otpRepository: OTPRepository,
        private readonly staffRepo: StaffRepository,

    ) { }


    //     async sendOtp(req: OTPDto): Promise<CommonResponse> {
    //         const staff = await this.staffRepo.findOne({
    //             where: { staffId: req.staffId, password: req.password } // Validate credentials
    //         });

    //         if (!staff) {
    //             return new CommonResponse(false, 404, "Invalid credentials");
    //         }
    //         const otp = this.generateOtp();
    //         const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    //         const otpRecord = this.otpRepository.create({
    //             staff,
    //             otp,
    //             expiresAt,
    //         });

    //         await this.otpRepository.save(otpRecord);

    //         return new CommonResponse(true, 200, `OTP sent successfully to ${staff.phoneNumber}`);
    //     }

    //     async verifyOtp(req: OTPDto): Promise<CommonResponse> {
    //         const otpRecord = await this.otpRepository.findOne({ where: { otp:req.otp } });

    //         if (!otpRecord) {
    //             throw new Error('Invalid OTP request');
    //         }

    //         const now = new Date();

    //         if (otpRecord.expiresAt < now) {
    //             await this.otpRepository.remove(otpRecord);

    //             throw new Error('OTP expired');
    //         }

    //         if (otpRecord.otp !== req.otp) {
    //             throw new Error('Invalid OTP');
    //         }

    //         await this.otpRepository.remove(otpRecord);
    //         return new CommonResponse(true, 200, `Login successful!`);

    //     }

    // async resendOtp(req: OTPDto): Promise<CommonResponse> {
    //     const staff = await this.staffRepo.findOne({
    //         where: { staffId: req.staffId, password: req.password }
    //     });
    //     const existingOtpRecord = await this.otpRepository.findOne({ where: { staff: staff } });

    //     if (existingOtpRecord) {
    //         await this.otpRepository.remove(existingOtpRecord);
    //     }

    //     const otp = this.generateOtp();
    //     const expiresAt = new Date();
    //     expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    //     const newOtpRecord = this.otpRepository.create({
    //         staff,
    //         otp,
    //         expiresAt,
    //     });

    //     await this.otpRepository.save(newOtpRecord);
    //     return new CommonResponse(true, 200, `OTP has been resent toPlease use the new OTP: ${otp} `);
    // }
    // }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendOtp(req: OTPDto): Promise<CommonResponse> {
        const staff = await this.staffRepo.findOne({
            where: { staffId: req.staffId },
        });

        if (!staff) {
            return new CommonResponse(false, 404, "Staff not found");
        }

        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry

        // CEO's Mobile Number (Replace with actual CEO's phone number)
        const ceoPhoneNumber = process.env.CEO_PHONE_NUMBER || "9876543210";

        // Store OTP with staffId
        const otpRecord = this.otpRepository.create({
            staffId: staff.staffId,  // Store staffId directly
            otp,
            expiresAt,
        });

        await this.otpRepository.save(otpRecord);

        // Send OTP to CEO via SMS Gateway
        // await this.smsGatewayService.sendSms(ceoPhoneNumber, `Your OTP for password reset is: ${otp}`);

        return new CommonResponse(true, 200, "OTP sent successfully to CEO's mobile");
    }

    async verifyOtp(req: VerifyOtpDto): Promise<CommonResponse> {
        const otpRecord = await this.otpRepository.findOne({
            where: { staffId: req.staffId, otp: req.otp },
        });

        if (!otpRecord) {
            return new CommonResponse(false, 400, "Invalid OTP");
        }

        const now = new Date();

        if (otpRecord.expiresAt < now) {
            await this.otpRepository.remove(otpRecord);
            return new CommonResponse(false, 400, "OTP expired");
        }

        return new CommonResponse(true, 200, "OTP verified. Proceed with password change.");
    }

    async changePassword(req: ChangePasswordDto): Promise<CommonResponse> {
        const staff = await this.staffRepo.findOne({
            where: { staffId: req.staffId },
        });

        if (!staff) {
            return new CommonResponse(false, 404, "Staff not found");
        }

        // Validate OTP before changing the password
        const otpRecord = await this.otpRepository.findOne({
            where: { staffId: req.staffId, otp: req.otp },
        });

        if (!otpRecord) {
            return new CommonResponse(false, 400, "Invalid or expired OTP");
        }

        // Update password
        staff.password = req.newPassword;
        await this.staffRepo.save(staff);

        // Remove OTP after successful password update
        await this.otpRepository.remove(otpRecord);

        return new CommonResponse(true, 200, "Password changed successfully");
    }
}
