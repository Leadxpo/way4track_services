import { Injectable } from '@nestjs/common';
import { OTPRepository } from './repo/otp-generation.repo';
import { ChangePasswordDto, OTPDto, VerifyOtpDto } from './dto/otp.dto';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { CommonResponse } from 'src/models/common-response';
import { NotificationRepository } from 'src/notifications/repo/notification.repo';
import axios from 'axios';
import { StaffStatus } from 'src/staff/enum/staff-status';
import { ClientRepository } from 'src/client/repo/client.repo';

@Injectable()
export class OTPGenerationService {
    constructor(
        private readonly otpRepository: OTPRepository,
        private readonly staffRepo: StaffRepository,
        private readonly clientRepo: ClientRepository

    ) { }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private async handleOtpSend(req: OTPDto): Promise<CommonResponse> {
        const staff = await this.staffRepo.findOne({ where: { staffId: req.staffId } });

        if (!staff) {
            return new CommonResponse(false, 404, "Staff not found");
        }

        const ceo = await this.staffRepo.findOne({
            where: {
                companyCode: staff.companyCode,
                designation: "CEO",
                status: StaffStatus.ACTIVE,
            },
        });

        if (!ceo || !ceo.phoneNumber) {
            return new CommonResponse(false, 404, "CEO not found for this staff");
        }

        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const smsParams = {
            username: "sharontelematics.trans",
            password: "bisrm",
            unicode: false,
            from: "SHARTE",
            to: ceo.phoneNumber,
            text: `This is a message from Sharlon Telematrice.\n An OTP is requested to ${req.isResend ? 'resend OTP' : 'reset a password'} for staff ${staff.staffId}:\n ${otp}`,
            dltContentId: "170717376366764870"
        };

        const smsResponse = await axios.get(`https://pgapi.smartping.ai/fe/api/v1/send?username=sharontelematics.trans&password=bisrm&unicode=false&from=SHARTE&to=${ceo.phoneNumber}&text=A%20staff%20member%20has%20requested%20a%20password%20reset.%20Your%20OTP%20is%20var.%20Do%20not%20share%20this%20with%20anyone%20%5Cn%20SHARTE%2C&dltContentId=1707174731086483991`, { params: smsParams });

        const otpRecord = this.otpRepository.create({
            staffId: staff.staffId,
            otp,
            expiresAt,
        });

        await this.otpRepository.save(otpRecord);

        if (smsResponse.data) {
            return new CommonResponse(true, 200, `OTP ${req.isResend ? "resent" : "sent"} to CEO successfully`, {
                sms: smsResponse.data,
            });
        } else {
            return new CommonResponse(false, 56416, `Failed to ${req.isResend ? "resend" : "send"} OTP`, {
                sms: smsResponse.data || "SMS failed",
            });
        }
    }

    private async handleClientOtpSend(req: OTPDto): Promise<CommonResponse> {
        const client = await this.clientRepo.findOne({ where: { phoneNumber: req.phoneNumber } });

        const isExistingClient = !!client;
        const actionType = req.isResend ? 'resend OTP' : (isExistingClient ? 'login' : 'register');

        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ghante ke liye valid

        const smsParams = {
            username: "sharontelematics.trans",
            password: "bisrm",
            unicode: false,
            from: "SHARTE",
            to: req.phoneNumber,
            text: `This is a message from Sharlon Telematrice.\nAn OTP is requested to ${actionType} for Client ${req.phoneNumber}:\n ${otp}`,
            dltContentId: "170717376366764870"
        };

        let smsResponse;
        try {
            smsResponse = await axios.get(`https://pgapi.smartping.ai/fe/api/v1/send?username=sharontelematics.trans&password=bisrm&unicode=false&from=SHARTE&to=${req.phoneNumber}&text=Your%20login%20OTP%20is%20%7Bvar%7D.%20Do%20not%20share%20this%20with%20anyone%20%5Cn%20SHARTE%2C&dltContentId=1707174737408612325`, { params: smsParams });
        } catch (error) {
            console.error("SMS sending failed, bhai!", error);
            return new CommonResponse(false, 500, "SMS sending failed", { error: error.message });
        }

        const otpRecord = this.otpRepository.create({
            staffId: req.phoneNumber,
            otp,
            expiresAt,
        });
        await this.otpRepository.save(otpRecord);

        return new CommonResponse(true, 200, `OTP ${req.isResend ? "resent" : "sent"} successfully for ${isExistingClient ? 'login' : 'registration'}`, {
            otp, // testing ke liye bhej rahe hain, production mein hata dena warna naya tamasha ho jayega
            sms: smsResponse.data,
            clientExists: isExistingClient,
        });
    }

    // Main exposed functions
    async sendClientOtp(req: OTPDto): Promise<CommonResponse> {
        return this.handleClientOtpSend(req);
    }

    async reSendClientOtp(req: OTPDto): Promise<CommonResponse> {
        return this.handleClientOtpSend(req);
    }

    async sendOtp(req: OTPDto): Promise<CommonResponse> {
        return this.handleOtpSend(req);
    }

    async reSendOtp(req: OTPDto): Promise<CommonResponse> {
        return this.handleOtpSend(req);
    }


    // async sendOtp(req: OTPDto): Promise<CommonResponse> {
    //     // Step 1: Find the Staff requesting OTP
    //     const staff = await this.staffRepo.findOne({
    //         where: { staffId: req.staffId },
    //     });

    //     if (!staff) {
    //         return new CommonResponse(false, 404, "Staff not found");
    //     }

    //     // Step 2: Find the CEO in the same company (CEO is also in the staff table)
    //     const ceo = await this.staffRepo.findOne({
    //         where: { companyCode: staff.companyCode, designation: "CEO", status: StaffStatus.ACTIVE }, // Assuming CEO has "CEO" as their role
    //     });

    //     if (!ceo || !ceo.phoneNumber) {
    //         return new CommonResponse(false, 404, "CEO not found for this staff");
    //     }

    //     // Step 3: Generate OTP
    //     const otp = this.generateOtp();
    //     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour expiry

    //     // Step 4: Send SMS to CEO
    //     const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
    //     const smsParams = {
    //         username: "sharontelematics.trans",
    //         password: "bisrm",
    //         unicode: false,
    //         from: "SHARTE",
    //         to: ceo.phoneNumber,  // Send OTP to CEO
    //         text: `This is a message from Sharlon Telematrice.\n An OTP is requested to reset a password for staff ${staff.staffId}:\n ${otp}`,
    //         dltContentId: "170717376366764870"
    //     };

    //     const smsResponse = await axios.get(smsUrl, { params: smsParams });

    //     // Step 5: Store OTP with staffId
    //     const otpRecord = this.otpRepository.create({
    //         staffId: staff.staffId,  // Store staffId, but OTP is sent to CEO
    //         otp,
    //         expiresAt,
    //     });

    //     await this.otpRepository.save(otpRecord);

    //     // Step 6: Return Response
    //     if (smsResponse.data) {
    //         return new CommonResponse(true, 200, "OTP sent to CEO successfully", {
    //             sms: smsResponse.data,
    //         });
    //     } else {
    //         return new CommonResponse(false, 56416, "Failed to send OTP", {
    //             sms: smsResponse.data || "SMS failed",
    //         });
    //     }
    // }


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


    async verifyClientOtp(req: VerifyOtpDto): Promise<CommonResponse> {
        const otpRecord = await this.otpRepository.findOne({
            where: { staffId: req.phoneNumber, otp: req.otp },
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
            where: { staffId: req.staffId },
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
