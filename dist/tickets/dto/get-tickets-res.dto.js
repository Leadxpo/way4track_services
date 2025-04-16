"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTicketsResDto = void 0;
class GetTicketsResDto {
    constructor(staffId, staffName, staffNumber, problem, date, branchId, branchName, ticketNumber, addressingDepartment, companyCode, unitCOde, workStatus, description, subDealerId, designationRelation) {
        this.staffId = staffId;
        this.staffName = staffName;
        this.staffNumber = staffNumber;
        this.problem = problem;
        this.date = date;
        this.branchId = branchId;
        this.branchName = branchName;
        this.ticketNumber = ticketNumber;
        this.addressingDepartment = addressingDepartment;
        this.companyCode = companyCode;
        this.unitCOde = unitCOde;
        this.workStatus = workStatus;
        this.description = description;
        this.subDealerId = subDealerId;
        this.designationRelation = designationRelation;
    }
}
exports.GetTicketsResDto = GetTicketsResDto;
//# sourceMappingURL=get-tickets-res.dto.js.map