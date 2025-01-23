import { Body, Controller, Post } from "@nestjs/common";
import { CommonResponse } from "src/models/common-response";
import { LoginDto } from "./dto/login.dto";
import { LoginService } from "./login.service";

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    @Post('LoginDetails')
    async LoginDetails(@Body() req: LoginDto): Promise<CommonResponse> {
        try {
            return await this.loginService.LoginDetails(req);
        } catch (error) {
            console.error("Error in LoginDetails service:", error);
            return new CommonResponse(false, 500, 'Error in login details.');
        }
    }

    @Post('ProfileDetails')
    async ProfileDetails(@Body() req: LoginDto): Promise<CommonResponse> {
        try {
            return await this.loginService.ProfileDetails(req);
        } catch (error) {
            console.error("Error in LoginDetails service:", error);
            return new CommonResponse(false, 500, 'Error in login details.');
        }
    }
}
