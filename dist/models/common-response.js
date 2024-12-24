"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonResponse = void 0;
class CommonResponse {
    constructor(status, errorCode, internalMessage, data) {
        this.status = status;
        this.errorCode = errorCode;
        this.internalMessage = internalMessage;
        this.data = data;
    }
}
exports.CommonResponse = CommonResponse;
//# sourceMappingURL=common-response.js.map