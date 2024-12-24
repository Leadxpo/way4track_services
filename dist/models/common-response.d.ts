export declare class CommonResponse {
    data?: any;
    status: boolean;
    errorCode: number;
    internalMessage: string;
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: any);
}
