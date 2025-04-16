"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateDashboardService = void 0;
const common_1 = require("@nestjs/common");
const estimate_repo_1 = require("../estimate/repo/estimate.repo");
const common_response_1 = require("../models/common-response");
const axios_1 = require("axios");
const client_repo_1 = require("../client/repo/client.repo");
let EstimateDashboardService = class EstimateDashboardService {
    constructor(repo, clientRepo) {
        this.repo = repo;
        this.clientRepo = clientRepo;
    }
    async sendReceipt(dto) {
        try {
            const estimate = await this.repo.findOne({ where: { id: dto.id } });
            const client = await this.clientRepo.findOne({ where: { id: dto.clientId } });
            if (!estimate) {
                return new common_response_1.CommonResponse(false, 404, "Estimate not found", null);
            }
            if (!client) {
                return new common_response_1.CommonResponse(false, 404, "Client not found", null);
            }
            const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
            const smsParams = {
                username: "sharontelematics.trans",
                password: "bisrm",
                unicode: false,
                from: "SHARTE",
                to: '+919494130830',
                text: `This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the receipt \nfor your selected products:\n ${estimate.receiptPdfUrl}`,
                dltContentId: "170717376366764870"
            };
            const smsResponse = await axios_1.default.get(`https://pgapi.smartping.ai/fe/api/v1/send?username=sharontelematics.trans&password=bisrm&unicode=false&from=SHARTE&to=${client.phoneNumber}&text=This%20is%20a%20message%20from%20Sharlon%20%0ATelematrice.%20Please%20click%20the%20%0Alink%20below%20to%20view%20the%20receipt%20%0Afor%20your%20selected%20products%3A%0A%20${estimate.receiptPdfUrl}%0ASHARTE&dltContentId=1707173763667648701`);
            if (smsResponse.data) {
                return new common_response_1.CommonResponse(true, 200, "SMS & Email sent successfully", {
                    sms: smsResponse.data,
                });
            }
            else {
                return new common_response_1.CommonResponse(false, 56416, "Failed to send SMS or Email", {
                    sms: smsResponse.data || "SMS failed",
                });
            }
        }
        catch (error) {
            console.error("Error sending SMS/Email:", error.message);
            return new common_response_1.CommonResponse(false, 5416, "Error occurred while sending SMS/Email", []);
        }
    }
    async sendInvoice(dto) {
        try {
            const estimate = await this.repo.findOne({ where: { id: dto.id } });
            const client = await this.clientRepo.findOne({ where: { id: dto.clientId } });
            if (!estimate) {
                return new common_response_1.CommonResponse(false, 404, "Estimate not found", null);
            }
            if (!client) {
                return new common_response_1.CommonResponse(false, 404, "Client not found", null);
            }
            const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
            const smsParams = {
                username: "sharontelematics.trans",
                password: "bisrm",
                unicode: false,
                from: "SHARTE",
                to: client.phoneNumber,
                text: `This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the invoice \nfor your selected products:\n ${estimate.invoicePdfUrl}`,
                dltContentId: "170717376366764870"
            };
            const smsResponse = await axios_1.default.get(`https://pgapi.smartping.ai/fe/api/v1/send?username=sharontelematics.trans&password=bisrm&unicode=false&from=SHARTE&to=${client.phoneNumber}&text=This%20is%20a%20message%20from%20Sharlon%20%0ATelematrice.%20Kindly%20click%20the%20%0Alink%20below%20to%20view%20the%20invoice%20%0Afor%20your%20selected%20products%3A%0A${estimate.invoicePdfUrl}%0ASHARTE&dltContentId=1707173763653536118`);
            if (smsResponse.data) {
                return new common_response_1.CommonResponse(true, 200, "SMS & Email sent successfully", {
                    sms: smsResponse.data,
                });
            }
            else {
                return new common_response_1.CommonResponse(false, 56416, "Failed to send SMS or Email", {
                    sms: smsResponse.data || "SMS failed",
                });
            }
        }
        catch (error) {
            console.error("Error sending SMS/Email:", error.message);
            return new common_response_1.CommonResponse(false, 5416, "Error occurred while sending SMS/Email", []);
        }
    }
    async sendEstimate(dto) {
        try {
            const estimate = await this.repo.findOne({ where: { id: dto.id } });
            const client = await this.clientRepo.findOne({ where: { id: dto.clientId } });
            if (!estimate) {
                return new common_response_1.CommonResponse(false, 404, "Estimate not found", null);
            }
            if (!client) {
                return new common_response_1.CommonResponse(false, 404, "Client not found", null);
            }
            const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
            const smsParams = {
                username: "sharontelematics.trans",
                password: "bisrm",
                unicode: false,
                from: "SHARTE",
                to: client.phoneNumber,
                text: `This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the estimate \nfor your selected products:\n  ${estimate.estimatePdfUrl}`,
                dltContentId: "170717376366764870"
            };
            const smsResponse = await axios_1.default.get(`https://pgapi.smartping.ai/fe/api/v1/send?username=sharontelematics.trans&password=bisrm&unicode=false&from=SHARTE&to=${client.phoneNumber}&text=This%20is%20a%20message%20from%20Sharlon%20%0ATelematrice.%20Please%20click%20the%20%0Alink%20below%20to%20view%20the%20%0Aestimation%20for%20your%20selected%20%0Aproducts%3A%0A${estimate.estimatePdfUrl}%0ASHARTE&dltContentId=1707173763638441204`);
            if (smsResponse.data) {
                return new common_response_1.CommonResponse(true, 200, "SMS & Email sent successfully", {
                    sms: smsResponse.data,
                });
            }
            else {
                return new common_response_1.CommonResponse(false, 56416, "Failed to send SMS or Email", {
                    sms: smsResponse.data || "SMS failed",
                });
            }
        }
        catch (error) {
            console.error("Error sending SMS/Email:", error.message);
            return new common_response_1.CommonResponse(false, 5416, "Error occurred while sending SMS/Email", []);
        }
    }
    async sendHiring(dto) {
        try {
            const estimate = await this.repo.findOne({ where: { id: dto.id } });
            const client = await this.clientRepo.findOne({ where: { id: dto.clientId } });
            if (!estimate) {
                return new common_response_1.CommonResponse(false, 404, "Estimate not found", null);
            }
            if (!client) {
                return new common_response_1.CommonResponse(false, 404, "Client not found", null);
            }
            const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
            const smsParams = {
                username: "sharontelematics.trans",
                password: "bisrm",
                unicode: false,
                from: "SHARTE",
                to: client.phoneNumber,
                text: `This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the estimate \nfor your selected products:\n  ${estimate.estimatePdfUrl}`,
                dltContentId: "170717376366764870"
            };
            const smsResponse = await axios_1.default.get(`https://pgapi.smartping.ai/fe/api/v1/send?username=sharontelematics.trans&password=bisrm&unicode=false&from=SHARTE&to=8688214671&text=Welcome%20to%20Sharlon%20%0ATelematrice%20%7B%23var%23%7D%21%20%2C%20%0Aholding%20ID%20%7B%23var%23%7D%2C%20has%20%0Abeen%20appointed%20as%20%7B%23var%23%7D%20%0Aat%20the%20%7B%23var%23%7D%20%0Abranch&dltContentId=1707173519778556582`);
            if (smsResponse.data) {
                return new common_response_1.CommonResponse(true, 200, "SMS & Email sent successfully", {
                    sms: smsResponse.data,
                });
            }
            else {
                return new common_response_1.CommonResponse(false, 56416, "Failed to send SMS or Email", {
                    sms: smsResponse.data || "SMS failed",
                });
            }
        }
        catch (error) {
            console.error("Error sending SMS/Email:", error.message);
            return new common_response_1.CommonResponse(false, 5416, "Error occurred while sending SMS/Email", []);
        }
    }
    async getEstimates(req) {
        const VendorData = await this.repo.getEstimates(req);
        if (!VendorData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VendorData);
        }
    }
    async getEstimatesForReport(req) {
        const VendorData = await this.repo.getEstimatesForReport(req);
        if (!VendorData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VendorData);
        }
    }
};
exports.EstimateDashboardService = EstimateDashboardService;
exports.EstimateDashboardService = EstimateDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [estimate_repo_1.EstimateRepository,
        client_repo_1.ClientRepository])
], EstimateDashboardService);
//# sourceMappingURL=estimate-dashboard.service.js.map