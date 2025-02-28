import { Controller, Post, Body } from '@nestjs/common';
import { OTPGenerationService } from './otp-generation.services';
import { OTPDto } from './dto/otp.dto';

@Controller('otp')
export class OTPGenerationController {
    constructor(private readonly otpService: OTPGenerationService) { }

    @Post('send-otp')
    sendOtp(@Body() req: OTPDto) {
        return this.otpService.sendOtp(req);
    }

    @Post('verify-otp')
    verifyOtp(
        @Body() req: OTPDto
    ) {
        return this.otpService.verifyOtp(req);
    }

    // @Post('re-send-otp')
    // resendOtp(@Body() req: OTPDto) {
    //     return this.otpService.resendOtp(req);
    // }
}
