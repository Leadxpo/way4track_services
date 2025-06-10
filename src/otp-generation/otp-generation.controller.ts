import { Controller, Post, Body } from '@nestjs/common';
import { OTPGenerationService } from './otp-generation.services';
import { ChangePasswordDto, OTPDto } from './dto/otp.dto';

@Controller('otp')
export class OTPGenerationController {
    constructor(private readonly otpService: OTPGenerationService) { }
// send change password OTP
@Post('send-otp')
    sendOtp(@Body() req: OTPDto) {
        return this.otpService.sendOtp(req);
    }
// eccommerse user login OTP
@Post('sendClientOtp')
    sendClientOtp(@Body() req: OTPDto) {
        return this.otpService.sendClientOtp(req);
    }
// verify change password OTP
@Post('verify-otp')
    verifyOtp(
        @Body() req: OTPDto
    ) {
        return this.otpService.verifyOtp(req);
    }
// verify eccommerse user login OTP
@Post('verifyClientOtp')
       verifyClientOtp(
           @Body() req: OTPDto
       ) {
           return this.otpService.verifyClientOtp(req);
       }

// changing staff password
@Post('change-password')
    changePassword(
        @Body() req: ChangePasswordDto
    ) {
        return this.otpService.changePassword(req);
    }
// resend change password OTP
@Post('re-send-otp')
    resendOtp(@Body() req: OTPDto) {
        return this.otpService.reSendOtp(req);
    }

// resend eccommerse user login OTP
@Post('reSendClientOtp')
    reSendClientOtp(@Body() req: OTPDto) {
        return this.otpService.reSendClientOtp(req);
    }
}
