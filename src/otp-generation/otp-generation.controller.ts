import { Controller, Post, Body } from '@nestjs/common';
import { OTPGenerationService } from './otp-generation.services';
import { ChangePasswordDto, OTPDto } from './dto/otp.dto';

@Controller('otp')
export class OTPGenerationController {
    constructor(private readonly otpService: OTPGenerationService) { }

    @Post('send-otp')
    sendOtp(@Body() req: OTPDto) {
        return this.otpService.sendOtp(req);
    }

    @Post('verifyClientOtp')
    verifyClientOtp(
        @Body() req: OTPDto
    ) {
        return this.otpService.verifyClientOtp(req);
    }


    @Post('sendClientOtp')
    sendClientOtp(@Body() req: OTPDto) {
        return this.otpService.sendClientOtp(req);
    }

    @Post('verify-otp')
    verifyOtp(
        @Body() req: OTPDto
    ) {
        return this.otpService.verifyOtp(req);
    }

    @Post('change-password')
    changePassword(
        @Body() req: ChangePasswordDto
    ) {
        return this.otpService.changePassword(req);
    }

    @Post('re-send-otp')
    resendOtp(@Body() req: OTPDto) {
        return this.otpService.reSendOtp(req);
    }


    @Post('reSendClientOtp')
    reSendClientOtp(@Body() req: OTPDto) {
        return this.otpService.reSendClientOtp(req);
    }
}
