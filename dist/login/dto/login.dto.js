"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = void 0;
const common_req_1 = require("../../models/common-req");
class LoginDto extends common_req_1.CommonReq {
    constructor(staffId, password, unitCode, companyCode, userId, userName, designation, uniqueId) {
        super(unitCode, companyCode, userId, userName);
        this.staffId = staffId;
        this.password = password;
        this.designation = designation;
        this.uniqueId = uniqueId;
    }
}
exports.LoginDto = LoginDto;
//# sourceMappingURL=login.dto.js.map