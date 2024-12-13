export class CommonResponse {
    data?: any;
    status: boolean;
    errorCode: number;
    internalMessage: string;
    /**
     *
     * @param status
     * @param errorCode
     * @param internalMessage
     * @param data
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: any) {
        this.status = status;
        this.errorCode = errorCode;
        this.internalMessage = internalMessage;
        this.data = data
    }
}

