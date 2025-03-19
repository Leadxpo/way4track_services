import { Injectable } from '@nestjs/common';
import { OTPRepository } from './repo/otp-generation.repo';
import { ChangePasswordDto, OTPDto, VerifyOtpDto } from './dto/otp.dto';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { CommonResponse } from 'src/models/common-response';
import { NotificationRepository } from 'src/notifications/repo/notification.repo';
import axios from 'axios';

@Injectable()
export class OTPGenerationService {
    constructor(
        private readonly otpRepository: OTPRepository,
        private readonly staffRepo: StaffRepository,

    ) { }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendOtp(req: OTPDto): Promise<CommonResponse> {
        // Step 1: Find the Staff requesting OTP
        const staff = await this.staffRepo.findOne({
            where: { staffId: req.staffId },
        });

        if (!staff) {
            return new CommonResponse(false, 404, "Staff not found");
        }

        // Step 2: Find the CEO in the same company (CEO is also in the staff table)
        const ceo = await this.staffRepo.findOne({
            where: { companyCode: staff.companyCode, designation: "CEO" }, // Assuming CEO has "CEO" as their role
        });

        if (!ceo || !ceo.phoneNumber) {
            return new CommonResponse(false, 404, "CEO not found for this staff");
        }

        // Step 3: Generate OTP
        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour expiry

        // Step 4: Send SMS to CEO
        const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
        const smsParams = {
            username: "sharontelematics.trans",
            password: "bisrm",
            unicode: false,
            from: "SHARTE",
            to: ceo.phoneNumber,  // Send OTP to CEO
            text: `This is a message from Sharlon Telematrice.\n An OTP is requested to reset a password for staff ${staff.staffId}:\n ${otp}`,
            dltContentId: "170717376366764870"
        };

        const smsResponse = await axios.get(smsUrl, { params: smsParams });

        // Step 5: Store OTP with staffId
        const otpRecord = this.otpRepository.create({
            staffId: staff.staffId,  // Store staffId, but OTP is sent to CEO
            otp,
            expiresAt,
        });

        await this.otpRepository.save(otpRecord);

        // Step 6: Return Response
        if (smsResponse.data) {
            return new CommonResponse(true, 200, "OTP sent to CEO successfully", {
                sms: smsResponse.data,
            });
        } else {
            return new CommonResponse(false, 56416, "Failed to send OTP", {
                sms: smsResponse.data || "SMS failed",
            });
        }
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
