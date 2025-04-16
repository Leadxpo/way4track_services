"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientStatus = exports.ClientStatusEnum = void 0;
var ClientStatusEnum;
(function (ClientStatusEnum) {
    ClientStatusEnum["ACCEPTED"] = "accepted";
    ClientStatusEnum["REJECTED"] = "rejected";
    ClientStatusEnum["EXPIRE"] = "expire";
    ClientStatusEnum["SENT"] = "sent";
    ClientStatusEnum["DECLINED"] = "declined";
    ClientStatusEnum["pending"] = "pending";
})(ClientStatusEnum || (exports.ClientStatusEnum = ClientStatusEnum = {}));
var ClientStatus;
(function (ClientStatus) {
    ClientStatus["Active"] = "Active";
    ClientStatus["InActive"] = "InActive";
    ClientStatus["Renewal"] = "Renewal";
})(ClientStatus || (exports.ClientStatus = ClientStatus = {}));
//# sourceMappingURL=client-status.enum.js.map