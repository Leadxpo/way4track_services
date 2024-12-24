"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestResDto = void 0;
class RequestResDto {
    constructor(id, requestType, staffID, requestBY, requestTo, description, createdDate, branchId, branchName, status, companyCode, unitCode) {
        this.id = id;
        this.requestType = requestType;
        this.staffID = staffID;
        this.requestBY = requestBY;
        this.requestTo = requestTo;
        this.description = description;
        this.createdDate = createdDate;
        this.branchId = branchId;
        this.branchName = branchName;
        this.status = status;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
    }
}
exports.RequestResDto = RequestResDto;
//# sourceMappingURL=request-res.dto.js.map