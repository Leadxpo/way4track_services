"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTicketsResDto = void 0;
class GetTicketsResDto {
    constructor(staffId, staffName, staffNumber, problem, date, branchId, branchName, ticketNumber, addressingDepartment, companyCode, unitCOde) {
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
    }
}
exports.GetTicketsResDto = GetTicketsResDto;
//# sourceMappingURL=get-tickets-res.dto.js.map