"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentResDto = void 0;
class AppointmentResDto {
    constructor(id, name, clientPhoneNumber, clientId, clientAddress, clientName, branchId, branchName, appointmentType, staffId, assignedTo, slot, description, status, appointmentId, companyCode, unitCode) {
        this.id = id;
        this.name = name;
        this.clientPhoneNumber = clientPhoneNumber;
        this.clientId = clientId;
        this.clientAddress = clientAddress;
        this.clientName = clientName;
        this.branchId = branchId;
        this.branchName = branchName;
        this.appointmentType = appointmentType;
        this.staffId = staffId;
        this.assignedTo = assignedTo;
        this.slot = slot;
        this.description = description;
        this.status = status;
        this.appointmentId = appointmentId;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
    }
}
exports.AppointmentResDto = AppointmentResDto;
//# sourceMappingURL=appointment-res.sto.js.map