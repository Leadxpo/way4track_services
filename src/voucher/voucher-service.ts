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
import { VoucherResDto } from "./dto/voucher-res.dto";

@Injectable()
export class VoucherService {
    constructor(
        private readonly voucherRepository: VoucherRepository,
        private readonly branchRepository: BranchRepository,
        private readonly clientRepository: ClientRepository,
        private readonly subDealerRepository: SubDealerRepository,
        private readonly vendorRepository: VendorRepository,
        private readonly voucherAdapter: VoucherAdapter,
    ) { }

    private generateVoucherNumber(voucherType: string, voucherId: number): string {
        const typePrefix = {
            RECEIPT: 'RE',
            PAYMENT: 'PA',
            JOURNAL: 'JU',
            CONTRA: 'CO',
            PURCHASE: 'PU',
            INVOICE: 'INV',
        };

        const prefix = typePrefix[voucherType] || 'UN';
        return `${prefix}-${voucherId.toString().padStart(4, '0')}`;
    }

    async createVoucher(voucherDto: VoucherDto): Promise<VoucherDto> {
        const branch = await this.branchRepository.findOne({ where: { id: voucherDto.branchId } });
        if (!branch) {
            throw new Error('Branch not found');
        }

        const client = await this.clientRepository.findOne({ where: { id: voucherDto.client } });
        if (!client) {
            throw new Error('Client not found');
        }

        const subDealer = voucherDto.subDealerId
            ? await this.subDealerRepository.findOne({ where: { id: voucherDto.subDealerId } })
            : null;
        const vendor = voucherDto.vendorId
            ? await this.vendorRepository.findOne({ where: { id: voucherDto.vendorId } })
            : null;

        const voucherEntity = this.voucherAdapter.dtoToEntity(voucherDto, branch, client, subDealer, vendor);

        const savedVoucher = await this.voucherRepository.save(voucherEntity);

        const generatedVoucherId = this.generateVoucherNumber(savedVoucher.voucherType, savedVoucher.id);
        savedVoucher.voucherId = generatedVoucherId;

        const updatedVoucher = await this.voucherRepository.save(savedVoucher);

        return this.voucherAdapter.entityToDto(updatedVoucher);
    }


    async getAllVouchers(): Promise<VoucherResDto[]> {
        const vouchers = await this.voucherRepository.find({
            relations: ['branchId']
        });
        return vouchers.map((voucher) => this.voucherAdapter.entityToDto(voucher));
    }

    async deleteVoucherDetails(dto: VoucherIdDto): Promise<CommonResponse> {
        try {
            const voucher = await this.voucherRepository.findOne({ where: { id: dto.id } });
            if (!voucher) {
                return new CommonResponse(false, 404, 'Voucher not found');
            }

            await this.voucherRepository.delete(dto.id);
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
            clientName: voucher.client?.[0]?.name || "Unknown",
            subDealerName: voucher.subDealer?.[0]?.name || "Unknown",
            vendorName: voucher.vendor?.[0]?.name || "Unknown"
        }));

        if (formattedData.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", formattedData);
        } else {
            return new CommonResponse(false, 4579, "No vouchers found");
        }
    }
}
