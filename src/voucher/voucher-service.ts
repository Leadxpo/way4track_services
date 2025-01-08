import { Injectable } from "@nestjs/common";
import { VoucherDto } from "./dto/voucher.dto";
import { CommonResponse } from "src/models/common-response";
import { VoucherIdDto } from "./dto/voucher-id.dto";
import { VoucherAdapter } from "./voucher.adapter";
import { VoucherRepository } from "./repo/voucher.repo";
import { BranchRepository } from "src/branch/repo/branch.repo";
import { ClientRepository } from "src/client/repo/client.repo";
import { SubDealerRepository } from "src/sub-dealer/repo/sub-dealer.repo";
import { VendorRepository } from "src/vendor/repo/vendor.repo";
import { ErrorResponse } from "src/models/error-response";
import { VoucherResDto } from "./dto/voucher-res.dto";
import { AccountRepository } from "src/account/repo/account.repo";

@Injectable()
export class VoucherService {
    findById(voucherId: number) {
        throw new Error("Method not implemented.");
    }
    findOne(voucherId: number) {
        throw new Error("Method not implemented.");
    }
    constructor(
        private readonly voucherRepository: VoucherRepository,
        private readonly branchRepository: BranchRepository,
        private readonly clientRepository: ClientRepository,
        private readonly subDealerRepository: SubDealerRepository,
        private readonly vendorRepository: VendorRepository,
        private readonly voucherAdapter: VoucherAdapter,
        private readonly accountRepo: AccountRepository

    ) { }


    private async generateVoucherNumber(voucherType: string): Promise<string> {
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
    async updateVoucher(voucherDto: VoucherDto): Promise<CommonResponse> {
        try {
            const existingVoucher = await this.voucherRepository.findOne({
                where: {
                    voucherId: voucherDto.voucherId,
                    companyCode: voucherDto.companyCode,
                    unitCode: voucherDto.unitCode
                },
            });

            if (!existingVoucher) {
                return new CommonResponse(false, 4002, 'Voucher not found for the provided id.');
            }
            Object.assign(existingVoucher, this.voucherAdapter.dtoToEntity(voucherDto));
            await this.voucherRepository.save(existingVoucher);

            return new CommonResponse(true, 65152, 'Voucher Updated Successfully');
        } catch (error) {
            console.error(`Error updating voucher details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to update voucher details: ${error.message}`);
        }
    }

    async createVoucher(voucherDto: VoucherDto): Promise<CommonResponse> {
        try {
            const generatedVoucherId = await this.generateVoucherNumber(voucherDto.voucherType);
            const voucherEntity = this.voucherAdapter.dtoToEntity(voucherDto);
            const toAccount = await this.accountRepo.findOne({ where: { accountNumber: voucherDto.toAccount } });
            if (!toAccount) throw new Error('Account not found');
            voucherEntity.toAccount = toAccount;

            voucherEntity.voucherId = generatedVoucherId;
            await this.voucherRepository.insert(voucherEntity);
            return new CommonResponse(true, 65152, 'Voucher Created Successfully');
        } catch (error) {
            console.error(`Error creating voucher details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create voucher details: ${error.message}`);
        }
    }



    async handleVoucher(voucherDto: VoucherDto): Promise<CommonResponse> {
        if (voucherDto.voucherId || voucherDto.id) {
            return await this.updateVoucher(voucherDto);
        } else {
            return await this.createVoucher(voucherDto);
        }
    }



    async getAllVouchers(): Promise<VoucherResDto[]> {
        const vouchers = await this.voucherRepository.find();
        return this.voucherAdapter.entityToDto(vouchers);
    }


    async deleteVoucherDetails(dto: VoucherIdDto): Promise<CommonResponse> {
        try {
            const voucher = await this.voucherRepository.findOne({ where: { voucherId: dto.voucherId } });
            if (!voucher) {
                return new CommonResponse(false, 404, 'Voucher not found');
            }

            await this.voucherRepository.delete(dto.voucherId);
            return new CommonResponse(true, 200, 'Voucher deleted successfully');
        } catch (error) {
            return new CommonResponse(false, 500, error.message);
        }
    }


    async getVoucherNamesDropDown(): Promise<CommonResponse> {
        const data = await this.voucherRepository.find({
            select: ['name', 'id', 'voucherId'],
            relations: ['branchId']
        });

        const formattedData = data.map(voucher => ({
            name: voucher.name,
            id: voucher.id,
            voucherId: voucher.voucherId,
            branchName: voucher.branchId?.branchName || "Unknown",
            clientName: voucher.clientId?.name || "Unknown",
            subDealerName: voucher.subDealer?.name || "Unknown",
            vendorName: voucher.vendorId.name || "Unknown"
        }));

        if (formattedData.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", formattedData);
        } else {
            return new CommonResponse(false, 4579, "No vouchers found");
        }
    }


}
