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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubDealerController = void 0;
const common_1 = require("@nestjs/common");
const sub_dealer_dto_1 = require("./dto/sub-dealer.dto");
const sub_dealer_service_1 = require("./sub-dealer.service");
const sub_dealer_id_dto_1 = require("./dto/sub-dealer-id.dto");
const common_response_1 = require("../models/common-response");
const platform_express_1 = require("@nestjs/platform-express");
const common_req_1 = require("../models/common-req");
const multer = require("multer");
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
let SubDealerController = class SubDealerController {
    constructor(subDealerService) {
        this.subDealerService = subDealerService;
    }
    async handleSubDealerDetails(dto, photo) {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.subDealerService.handleSubDealerDetails(dto, photo);
        }
        catch (error) {
            console.log("Error in create address in services..", error);
        }
    }
    async deleteSubDealerDetails(dto) {
        try {
            return await this.subDealerService.deleteSubDealerDetails(dto);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting assert details');
        }
    }
    async getSubDealerDetailById(dto) {
        try {
            return await this.subDealerService.getSubDealerDetailById(dto);
        }
        catch (error) {
            console.log("Error in create address in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching staff type details');
        }
    }
    async getSubDealerDetails(dto) {
        try {
            return await this.subDealerService.getSubDealerDetails(dto);
        }
        catch (error) {
            console.log("Error in create address in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching staff type details');
        }
    }
    async getSubDealerNamesDropDown() {
        try {
            return this.subDealerService.getSubDealerNamesDropDown();
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
};
exports.SubDealerController = SubDealerController;
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', multerOptions)),
    (0, common_1.Post)('handleSubDealerDetails'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sub_dealer_dto_1.SubDealerDto, Object]),
    __metadata("design:returntype", Promise)
], SubDealerController.prototype, "handleSubDealerDetails", null);
__decorate([
    (0, common_1.Post)('deleteSubDealerDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sub_dealer_id_dto_1.SubDealerIdDto]),
    __metadata("design:returntype", Promise)
], SubDealerController.prototype, "deleteSubDealerDetails", null);
__decorate([
    (0, common_1.Post)('getSubDealerDetailById'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sub_dealer_id_dto_1.SubDealerIdDto]),
    __metadata("design:returntype", Promise)
], SubDealerController.prototype, "getSubDealerDetailById", null);
__decorate([
    (0, common_1.Post)('getSubDealerDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], SubDealerController.prototype, "getSubDealerDetails", null);
__decorate([
    (0, common_1.Post)('getSubDealerNamesDropDown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubDealerController.prototype, "getSubDealerNamesDropDown", null);
exports.SubDealerController = SubDealerController = __decorate([
    (0, common_1.Controller)('subdealer'),
    __metadata("design:paramtypes", [sub_dealer_service_1.SubDealerService])
], SubDealerController);
//# sourceMappingURL=sub-dealer.controller.js.map