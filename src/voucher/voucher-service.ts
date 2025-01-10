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
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { VoucherTypeEnum } from "./enum/voucher-type-enum";
import { VoucherEntity } from "./entity/voucher.entity";
import { PayEmiDto } from "./dto/pay-emi.dto";
import { PaymentType } from "src/asserts/enum/payment-type.enum";

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
            const toAccount = await this.accountRepo.findOne({
                where: { accountNumber: voucherDto.toAccount },
            });
            if (!toAccount) {
                throw new ErrorResponse(4001, 'To Account not found.');
            }
            voucherEntity.toAccount = toAccount;
            voucherEntity.voucherId = generatedVoucherId;
            await this.voucherRepository.insert(voucherEntity);
            return new CommonResponse(
                true,
                65152,
                `Voucher Created Successfully with ID: ${generatedVoucherId}`
            );
        } catch (error) {
            console.error(`Error creating voucher details: ${error.message}`, error.stack);
            throw new ErrorResponse(
                error?.code || 5416,
                `Failed to create voucher details: ${error.message}`
            );
        }
    }

    private calculateEmiAmount(amount: number, numberOfEmi: number): number {
        if (numberOfEmi <= 0) throw new Error('Number of EMIs must be greater than 0.');
        return parseFloat((amount / numberOfEmi).toFixed(2));
    }


    async payEmi(payEmiDto: PayEmiDto): Promise<CommonResponse> {
        try {
            const { voucherId, companyCode, unitCode, amountPaid, emiNumber } = payEmiDto;

            if (!voucherId) {
                const newVoucherId = await this.generateVoucherNumber(VoucherTypeEnum.PAYMENT);

                const voucherEntity = new VoucherEntity();
                voucherEntity.voucherId = newVoucherId;
                voucherEntity.companyCode = companyCode;
                voucherEntity.unitCode = unitCode;

                const emiAmount = this.calculateEmiAmount(voucherEntity.amount, 12);
                voucherEntity.initialPayment = emiAmount;
                voucherEntity.remainingAmount = voucherEntity.amount - emiAmount;
                voucherEntity.numberOfEmi = 12;
                voucherEntity.emiNumber = 1;

                await this.voucherRepository.save(voucherEntity);

                return new CommonResponse(
                    true,
                    65152,
                    `First EMI paid successfully. Voucher ID: ${newVoucherId}`
                );
            }
            else {
                const existingVoucher = await this.voucherRepository.findOne({
                    where: { voucherId, companyCode, unitCode },
                });

                if (!existingVoucher) {
                    return new CommonResponse(false, 4002, 'Voucher not found.');
                }

                if (existingVoucher.emiNumber + 1 !== emiNumber) {
                    return new CommonResponse(false, 4003, 'Invalid EMI payment sequence.');
                }

                existingVoucher.remainingAmount -= amountPaid;
                existingVoucher.emiNumber = emiNumber;

                if (existingVoucher.remainingAmount <= 0) {
                    existingVoucher.paymentStatus = PaymentStatus.ACCEPTED;
                }

                await this.voucherRepository.save(existingVoucher);

                return new CommonResponse(
                    true,
                    65153,
                    `EMI number ${emiNumber} paid successfully. Remaining amount: ${existingVoucher.remainingAmount}`
                );
            }
        } catch (error) {
            console.error(`Error handling EMI payment: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to process EMI payment: ${error.message}`);
        }
    }

    async handleVoucher(voucherDto: VoucherDto): Promise<CommonResponse> {
        try {
            if (voucherDto.voucherId || voucherDto.id) {
                if (voucherDto.paymentType === PaymentType.EMI) {
                    const payEmiDto: PayEmiDto = {
                        voucherId: voucherDto.voucherId,
                        companyCode: voucherDto.companyCode,
                        unitCode: voucherDto.unitCode,
                        amountPaid: voucherDto.initialPayment,
                        emiNumber: voucherDto.emiNumber,
                    };

                    return await this.payEmi(payEmiDto);
                }

                return await this.updateVoucher(voucherDto);
            } else {
                return await this.createVoucher(voucherDto);
            }
        } catch (error) {
            console.error(`Error in handleVoucher: ${error.message}`, error.stack);
            throw new ErrorResponse(5417, `Failed to handle voucher: ${error.message}`);
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
            select: ['id', 'voucherId'],
            relations: ['branchId']
        });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data);
        } else {
            return new CommonResponse(false, 4579, "No vouchers found");
        }
    }


}
