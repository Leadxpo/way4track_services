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
exports.VoucherService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const voucher_adapter_1 = require("./voucher.adapter");
const voucher_repo_1 = require("./repo/voucher.repo");
const branch_repo_1 = require("../branch/repo/branch.repo");
const client_repo_1 = require("../client/repo/client.repo");
const sub_dealer_repo_1 = require("../sub-dealer/repo/sub-dealer.repo");
const vendor_repo_1 = require("../vendor/repo/vendor.repo");
const error_response_1 = require("../models/error-response");
let VoucherService = class VoucherService {
    constructor(voucherRepository, branchRepository, clientRepository, subDealerRepository, vendorRepository, voucherAdapter) {
        this.voucherRepository = voucherRepository;
        this.branchRepository = branchRepository;
        this.clientRepository = clientRepository;
        this.subDealerRepository = subDealerRepository;
        this.vendorRepository = vendorRepository;
        this.voucherAdapter = voucherAdapter;
    }
    async generateVoucherNumber(voucherType) {
        const typePrefix = {
            RECEIPT: 'RE',
            PAYMENT: 'PA',
            JOURNAL: 'JU',
            CONTRA: 'CO',
            PURCHASE: 'PU',
            INVOICE: 'INV',
        };
        const prefix = typePrefix[voucherType.toUpperCase()] || 'UN';
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const lastVoucher = await this.voucherRepository
            .createQueryBuilder('voucher')
            .where('voucher.voucherType = :voucherType', { voucherType })
            .andWhere('voucher.voucherId LIKE :prefix', { prefix: `${prefix}-${timestamp}%` })
            .orderBy('voucher.voucherId', 'DESC')
            .getOne();
        let sequentialNumber = 1;
        if (lastVoucher) {
            const lastVoucherNumber = lastVoucher.voucherId.split('-').pop();
            sequentialNumber = parseInt(lastVoucherNumber, 10) + 1;
        }
        const paddedSequentialNumber = sequentialNumber.toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${paddedSequentialNumber}`;
    }
    async updateVoucher(voucherDto) {
        try {
            const existingVoucher = await this.voucherRepository.findOne({
                where: {
                    voucherId: voucherDto.voucherId,
                    companyCode: voucherDto.companyCode,
                    unitCode: voucherDto.unitCode
                },
            });
            if (!existingVoucher) {
                return new common_response_1.CommonResponse(false, 4002, 'Voucher not found for the provided id.');
            }
            const branch = await this.branchRepository.findOne({ where: { id: voucherDto.branchId } });
            if (!branch) {
                throw new Error('Branch not found');
            }
            const client = voucherDto.client
                ? await this.clientRepository.findOne({ where: { id: voucherDto.client } })
                : null;
            const subDealer = voucherDto.subDealerId
                ? await this.subDealerRepository.findOne({ where: { id: voucherDto.subDealerId, companyCode: voucherDto.companyCode, unitCode: voucherDto.unitCode } })
                : null;
            const vendor = voucherDto.vendorId
                ? await this.vendorRepository.findOne({ where: { id: voucherDto.vendorId, companyCode: voucherDto.companyCode, unitCode: voucherDto.unitCode } })
                : null;
            Object.assign(existingVoucher, this.voucherAdapter.dtoToEntity(voucherDto, branch, client, subDealer, vendor));
            await this.voucherRepository.save(existingVoucher);
            return new common_response_1.CommonResponse(true, 65152, 'Voucher Updated Successfully');
        }
        catch (error) {
            console.error(`Error updating voucher details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to update voucher details: ${error.message}`);
        }
    }
    async createVoucher(voucherDto) {
        try {
            const generatedVoucherId = await this.generateVoucherNumber(voucherDto.voucherType);
            const branch = await this.branchRepository.findOne({ where: { id: voucherDto.branchId } });
            if (!branch) {
                throw new Error('Branch not found');
            }
            const client = voucherDto.client
                ? await this.clientRepository.findOne({ where: { id: voucherDto.client } })
                : null;
            const subDealer = voucherDto.subDealerId
                ? await this.subDealerRepository.findOne({ where: { id: voucherDto.subDealerId, companyCode: voucherDto.companyCode, unitCode: voucherDto.unitCode } })
                : null;
            const vendor = voucherDto.vendorId
                ? await this.vendorRepository.findOne({ where: { id: voucherDto.vendorId, companyCode: voucherDto.companyCode, unitCode: voucherDto.unitCode } })
                : null;
            const voucherEntity = this.voucherAdapter.dtoToEntity(voucherDto, branch, client, subDealer, vendor);
            voucherEntity.voucherId = generatedVoucherId;
            await this.voucherRepository.save(voucherEntity);
            return new common_response_1.CommonResponse(true, 65152, 'Voucher Created Successfully');
        }
        catch (error) {
            console.error(`Error creating voucher details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to create voucher details: ${error.message}`);
        }
    }
    async handleVoucher(voucherDto) {
        if (voucherDto.voucherId || voucherDto.id) {
            return await this.updateVoucher(voucherDto);
        }
        else {
            return await this.createVoucher(voucherDto);
        }
    }
    async getAllVouchers() {
        const vouchers = await this.voucherRepository.find({
            relations: ['branchId']
        });
        return vouchers.map((voucher) => this.voucherAdapter.entityToDto(voucher));
    }
    async deleteVoucherDetails(dto) {
        try {
            const voucher = await this.voucherRepository.findOne({ where: { id: dto.id } });
            if (!voucher) {
                return new common_response_1.CommonResponse(false, 404, 'Voucher not found');
            }
            await this.voucherRepository.delete(dto.id);
            return new common_response_1.CommonResponse(true, 200, 'Voucher deleted successfully');
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, error.message);
        }
    }
    async getVoucherNamesDropDown() {
        const data = await this.voucherRepository.find({
            select: ['name', 'id', 'voucherId'],
            relations: ['branchId']
        });
        const formattedData = data.map(voucher => ({
            name: voucher.name,
            id: voucher.id,
            voucherId: voucher.voucherId,
            branchName: voucher.branchId?.branchName || "Unknown",
            clientName: voucher.client?.[0]?.name || "Unknown",
            subDealerName: voucher.subDealer?.[0]?.name || "Unknown",
            vendorName: voucher.vendor?.[0]?.name || "Unknown"
        }));
        if (formattedData.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", formattedData);
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "No vouchers found");
        }
    }
};
exports.VoucherService = VoucherService;
exports.VoucherService = VoucherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [voucher_repo_1.VoucherRepository,
        branch_repo_1.BranchRepository,
        client_repo_1.ClientRepository,
        sub_dealer_repo_1.SubDealerRepository,
        vendor_repo_1.VendorRepository,
        voucher_adapter_1.VoucherAdapter])
], VoucherService);
//# sourceMappingURL=voucher-service.js.map