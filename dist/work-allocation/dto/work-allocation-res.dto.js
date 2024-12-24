"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkAllocationResDto = void 0;
class WorkAllocationResDto {
    constructor(id, workAllocationNumber, serviceOrProduct, otherInformation, date, clientId, clientName, clientAddress, clientPhoneNumber, staffId, assignedTo, companyCode, unitCode) {
        this.id = id;
        this.workAllocationNumber = workAllocationNumber;
        this.serviceOrProduct = serviceOrProduct;
        this.otherInformation = otherInformation;
        this.date = date;
        this.clientId = clientId;
        this.clientName = clientName;
        this.clientAddress = clientAddress;
        this.clientPhoneNumber = clientPhoneNumber;
        this.staffId = staffId;
        this.assignedTo = assignedTo;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
    }
}
exports.WorkAllocationResDto = WorkAllocationResDto;
//# sourceMappingURL=work-allocation-res.dto.js.map