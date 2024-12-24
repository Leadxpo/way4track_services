export class ErrorResponse {
    errorCode: number;
    message: string;
    constructor(errorCode: number, message: string) {
        this.errorCode = errorCode;
        this.message = message;
    }
}