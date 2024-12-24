import { CommonResponse } from "src/models/common-response";
import { LoginDto } from "./dto/login.dto";
import { LoginService } from "./login.service";
export declare class LoginController {
    private readonly loginService;
    constructor(loginService: LoginService);
    LoginDetails(req: LoginDto): Promise<CommonResponse>;
}
