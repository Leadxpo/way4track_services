import { Injectable } from "@nestjs/common";
import { AccountRepository } from "src/account/repo/account.repo";
import { PaymentType } from "src/asserts/enum/payment-type.enum";
import { EstimateRepository } from "src/estimate/repo/estimate.repo";
import { CommonResponse } from "src/models/common-response";
import { ErrorResponse } from "src/models/error-response";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { PayEmiDto } from "./dto/pay-emi.dto";
import { VoucherIdDto } from "./dto/voucher-id.dto";
import { VoucherResDto } from "./dto/voucher-res.dto";
import { VoucherDto } from "./dto/voucher.dto";
import { VoucherEntity } from "./entity/voucher.entity";
import { VoucherTypeEnum } from "./enum/voucher-type-enum";
import { VoucherRepository } from "./repo/voucher.repo";
import { VoucherAdapter } from "./voucher.adapter";
import { AccountEntity } from "src/account/entity/account.entity";
import { EmiPaymentEntity } from "./entity/emi-payments";
import { EmiPaymentRepository } from "./repo/emi-payment-repo";

@Injectable()
export class VoucherService {

    constructor(
        private readonly voucherRepository: VoucherRepository,
        private readonly voucherAdapter: VoucherAdapter,
        private readonly accountRepo: AccountRepository,
        private readonly estimateRepo: EstimateRepository,
        private readonly accountRepository: AccountRepository,
        private readonly emiPaymentRepository: EmiPaymentRepository

    ) { }


    private async generateVoucherNumber(voucherType: string): Promise<string> {
        const typePrefix = {
            RECEIPT: 'RE',
            PAYMENT: 'PA',
            JOURNAL: 'JU',
            CONTRA: 'CO',
            PURCHASE: 'PU',
            EMI: 'EMI'
            // INVOICE: 'INV',
        };

        const prefix = typePrefix[voucherType.toUpperCase()] || 'UN';

        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        console.log(`Voucher Type: ${voucherType}, Prefix Selected: ${prefix}`);

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

            // Fetch From Account (Mandatory for all transactions)
            const fromAccount = await this.accountRepository.findOne({
                where: { companyCode: voucherDto.companyCode, unitCode: voucherDto.unitCode, id: voucherDto.fromAccount },
            });

            if (!fromAccount) {
                throw new Error('From account not found.');
            }

            let toAccount: AccountEntity | null = null;

            // For CONTRA transactions, To Account is mandatory
            if (voucherEntity.voucherType === VoucherTypeEnum.CONTRA) {
                if (!voucherDto.toAccount) {
                    throw new Error('To account is required for CONTRA transactions.');
                }

                toAccount = await this.accountRepository.findOne({
                    where: { companyCode: voucherDto.companyCode, unitCode: voucherDto.unitCode, id: voucherDto.toAccount },
                });

                if (!toAccount) {
                    throw new Error('To account not found for CONTRA transaction.');
                }
            }

            const voucherAmount = voucherDto.amount; // Corrected to use DTO amount
            console.log(voucherAmount, "voucherAmountvoucherAmount")
            // Check for sufficient funds before deducting
            if (
                [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.JOURNAL, VoucherTypeEnum.PURCHASE, VoucherTypeEnum.CONTRA].includes(voucherEntity.voucherType)
                && fromAccount.totalAmount < voucherAmount
            ) {
                throw new Error('Insufficient funds in the from account.');
            }

            switch (voucherEntity.voucherType) {
                // case VoucherTypeEnum.RECEIPT:
                //     fromAccount.totalAmount += voucherAmount;
                //     break;
                case VoucherTypeEnum.RECEIPT:
                    console.log('Before updating totalAmount:', fromAccount.totalAmount);
                    fromAccount.totalAmount = Number(fromAccount.totalAmount) + Number(voucherAmount);
                    console.log('After updating totalAmount:', fromAccount.totalAmount);
                    break;

                case VoucherTypeEnum.PAYMENT:
                case VoucherTypeEnum.JOURNAL:
                case VoucherTypeEnum.PURCHASE:
                    fromAccount.totalAmount -= voucherAmount; // Deducting money
                    break;
                case VoucherTypeEnum.CONTRA:
                    if (!toAccount) {
                        throw new Error('To account is required for bank-to-bank transfers.');
                    }

                    // Check if sufficient funds exist in the from account
                    if (fromAccount.totalAmount < voucherAmount) {
                        throw new Error('Insufficient funds in the from account for CONTRA transaction.');
                    }

                    fromAccount.totalAmount -= voucherAmount; // Debit from source
                    toAccount.totalAmount += voucherAmount; // Credit to destination
                    break;
                default:
                    throw new Error(`Unhandled voucher type: ${voucherEntity.voucherType}`);
            }
            console.log(fromAccount, voucherAmount, "fromAccountfromAccount")
            // Save updated accounts
            await this.accountRepository.save(toAccount ? [fromAccount, toAccount] : [fromAccount]);

            // Set Voucher ID
            voucherEntity.voucherId = generatedVoucherId;

            // Handle Invoice Payment
            if (voucherDto.invoice) {
                const estimate = await this.estimateRepo.findOne({ where: { invoiceId: voucherDto.invoice } });
                if (!estimate) {
                    throw new ErrorResponse(4001, 'Estimate not found.');
                }
            }

            // Insert the voucher record
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



    private calculateNextDueDate(lastPaidDate: Date): Date {
        const nextDueDate = new Date(lastPaidDate);
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        return nextDueDate;
    }


    // async createOrPayEmi(voucherDto: VoucherDto): Promise<CommonResponse> {
    //     try {
    //         const { amount, initialPayment, numberOfEmi, amountPaid, voucherId, paymentType, fromAccount, companyCode, unitCode } = voucherDto;

    //         // Fetch account details once if required
    //         let account: AccountEntity | null = null;
    //         if (fromAccount && paymentType !== PaymentType.CASH) {
    //             account = await this.accountRepository.findOne({
    //                 where: { companyCode, unitCode, id: fromAccount },
    //             });

    //             if (!account) {
    //                 return new CommonResponse(false, 4004, 'From account not found.');
    //             }
    //         }

    //         // Check if the voucher already exists
    //         let voucher = await this.voucherRepository.findOne({ where: { voucherId } });

    //         if (!voucher) {
    //             // Generate a new Voucher ID
    //             const newVoucherId = await this.generateVoucherNumber(VoucherTypeEnum.EMI);
    //             const emiAmount = (amount - initialPayment) / numberOfEmi;

    //             // Deduct initial payment if applicable
    //             if (account) {
    //                 account.totalAmount -= initialPayment;
    //                 await this.accountRepository.save(account);
    //             }

    //             // Create new voucher record
    //             voucher = new VoucherEntity();
    //             voucher.voucherId = newVoucherId;
    //             voucher.paymentType = paymentType;
    //             voucher.amount = amount;
    //             voucher.initialPayment = initialPayment;
    //             voucher.remainingAmount = amount - initialPayment;
    //             voucher.numberOfEmi = numberOfEmi;
    //             voucher.emiAmount = emiAmount;
    //             voucher.emiNumber = 1;
    //             voucher.paymentStatus = PaymentStatus.PARTIALLY_PAID;
    //             voucher.lastPaidDate = new Date();
    //             voucher.nextDueDate = this.calculateNextDueDate(new Date());

    //             await this.voucherRepository.save(voucher);

    //             // Store first EMI payment
    //             const emiPayment = new EmiPaymentEntity();
    //             emiPayment.voucherId = newVoucherId;
    //             emiPayment.emiNumber = 1;
    //             emiPayment.paidAmount = initialPayment;
    //             emiPayment.paymentDate = new Date();
    //             emiPayment.remainingBalance = voucher.remainingAmount;

    //             await this.emiPaymentRepository.save(emiPayment);

    //             return new CommonResponse(true, 65151, `EMI plan created successfully with Voucher ID: ${newVoucherId}`);
    //         }

    //         // If EMI plan exists, retrieve the last EMI payment
    //         const lastPayment = await this.emiPaymentRepository.findOne({
    //             where: { voucherId: voucher.voucherId },
    //             order: { emiNumber: 'DESC' },
    //         });

    //         const newEmiNumber = lastPayment ? lastPayment.emiNumber + 1 : 1;

    //         // Validate EMI payment sequence
    //         if (newEmiNumber !== voucher.emiNumber + 1) {
    //             return new CommonResponse(false, 4003, 'Invalid EMI payment sequence.');
    //         }

    //         // Deduct installment amount if applicable
    //         if (account) {
    //             account.totalAmount -= amountPaid;
    //             await this.accountRepository.save(account);
    //         }

    //         // Deduct paid amount from remaining amount
    //         voucher.remainingAmount -= amountPaid;
    //         voucher.paidAmount = (voucher.paidAmount || 0) + amountPaid;
    //         voucher.emiNumber = newEmiNumber;
    //         voucher.lastPaidDate = new Date();
    //         voucher.nextDueDate = this.calculateNextDueDate(voucher.lastPaidDate);

    //         // Update payment status
    //         voucher.paymentStatus = voucher.remainingAmount <= 0 ? PaymentStatus.COMPLETED : PaymentStatus.PARTIALLY_PAID;

    //         await this.voucherRepository.save(voucher);

    //         // Store EMI payment history
    //         const emiPayment = new EmiPaymentEntity();
    //         emiPayment.voucherId = voucher.voucherId;
    //         emiPayment.emiNumber = newEmiNumber;
    //         emiPayment.paidAmount = amountPaid;
    //         emiPayment.paymentDate = new Date();
    //         emiPayment.remainingBalance = voucher.remainingAmount;

    //         await this.emiPaymentRepository.save(emiPayment);

    //         return new CommonResponse(
    //             true,
    //             65153,
    //             `EMI number ${newEmiNumber} paid successfully. Remaining amount: ${voucher.remainingAmount}`
    //         );

    //     } catch (error) {
    //         throw new ErrorResponse(5416, `Failed to process EMI: ${error.message}`);
    //     }
    // }

    async createOrPayEmi(voucherDto: VoucherDto): Promise<CommonResponse> {
        try {
            console.log('Received voucherDto:', voucherDto);

            const { amount, initialPayment, numberOfEmi, amountPaid, voucherId, paymentType, fromAccount, companyCode, unitCode } = voucherDto;

            // Validate EMI count
            if (numberOfEmi <= 0) {
                return new CommonResponse(false, 4005, 'Invalid EMI count.');
            }

            console.log('Fetching voucher with ID:', voucherId);
            // Fetch account details if required
            let account: AccountEntity | null = null;
            if (fromAccount && paymentType !== PaymentType.CASH) {
                account = await this.accountRepository.findOne({
                    where: { companyCode, unitCode, id: fromAccount },
                });

                if (!account) {
                    return new CommonResponse(false, 4004, 'From account not found.');
                }
            }

            // Handle voucher fetching and creation
            let voucher: VoucherEntity | null = null;
            if (voucherDto.voucherId) {
                voucher = await this.voucherRepository.findOne({
                    where: { voucherId: voucherDto.voucherId },
                });

            }
            console.log(voucher, "XXXXXXXXXXXXX")

            // If no voucher found, create a new one
            if (!voucher || voucher === undefined) {
                const newVoucherId = await this.generateVoucherNumber(VoucherTypeEnum.EMI);
                console.log('Generated new voucher ID:', newVoucherId);

                const emiAmount = (amount - initialPayment) / numberOfEmi;

                if (account) {
                    account.totalAmount -= initialPayment;
                    await this.accountRepository.save(account);
                }

                // Create new voucher details
                voucher = new VoucherEntity();
                voucher.name = voucherDto.name
                voucher.voucherId = newVoucherId;
                voucher.companyCode = voucherDto.companyCode
                voucher.unitCode = voucherDto.unitCode
                voucher.paymentType = paymentType;
                voucher.amount = Number(amount);
                voucher.initialPayment = Number(initialPayment);
                voucher.remainingAmount = Number(amount) - Number(initialPayment);
                voucher.numberOfEmi = numberOfEmi;
                voucher.emiAmount = Number(emiAmount);
                voucher.emiNumber = 1;
                voucher.paymentStatus = PaymentStatus.PARTIALLY_PAID;
                voucher.lastPaidDate = new Date();
                voucher.nextDueDate = this.calculateNextDueDate(new Date());

                console.log('Saving new voucher:', voucher);
                await this.voucherRepository.save(voucher);

                const emiPayment = new EmiPaymentEntity();
                emiPayment.voucherId = newVoucherId;
                emiPayment.emiNumber = 1;
                emiPayment.paidAmount = Number(initialPayment);
                emiPayment.paymentDate = new Date();
                emiPayment.remainingBalance = Number(voucher.remainingAmount);

                console.log('Saving first EMI payment:', emiPayment);
                await this.emiPaymentRepository.save(emiPayment);

                return new CommonResponse(true, 65151, `EMI plan created successfully with Voucher ID: ${newVoucherId}`);
            }

            // Process subsequent EMI payments
            const lastPayment = await this.emiPaymentRepository.findOne({
                where: { voucherId: voucher.voucherId },
                order: { emiNumber: 'DESC' },
            });
            console.log(lastPayment, "lastPayment")
            const newEmiNumber = lastPayment ? Number(lastPayment.emiNumber) + 1 : 1;

            if (newEmiNumber !== voucher.emiNumber + 1) {
                return new CommonResponse(false, 4003, 'Invalid EMI payment sequence.');
            }
            console.log(newEmiNumber, "newEmiNumber")

            if (account) {
                account.totalAmount -= amountPaid;
                await this.accountRepository.save(account);
            }
            console.log(account, "account")

            voucher.remainingAmount = Number(voucher.remainingAmount) - Number(amountPaid);
            voucher.paidAmount = Number(voucher.paidAmount || 0) + Number(amountPaid);
            voucher.emiNumber = Number(newEmiNumber);
            voucher.lastPaidDate = new Date();
            voucher.nextDueDate = this.calculateNextDueDate(voucher.lastPaidDate);
            voucher.paymentStatus = Number(voucher.remainingAmount) <= 0 ? PaymentStatus.COMPLETED : PaymentStatus.PARTIALLY_PAID;

            console.log('Updating voucher:', voucher);
            await this.voucherRepository.save(voucher);

            const emiPayment = new EmiPaymentEntity();
            emiPayment.voucherId = voucher.voucherId;
            emiPayment.emiNumber = Number(newEmiNumber);
            emiPayment.paidAmount = Number(amountPaid);
            emiPayment.paymentDate = new Date();
            emiPayment.remainingBalance = Number(voucher.remainingAmount);

            console.log('Saving EMI payment:', emiPayment);
            await this.emiPaymentRepository.save(emiPayment);

            return new CommonResponse(
                true,
                65153,
                `EMI number ${newEmiNumber} paid successfully. Remaining amount: ${voucher.remainingAmount}`
            );
        } catch (error) {
            console.error('Error processing EMI:', error);
            throw new ErrorResponse(5416, `Failed to process EMI: ${error.message}`);
        }
    }




    async handleVoucher(voucherDto: VoucherDto): Promise<CommonResponse> {
        try {
            if (voucherDto.voucherId && voucherDto.id) {
                return await this.updateVoucher(voucherDto);
            }
            else if (voucherDto.voucherType === VoucherTypeEnum.EMI) {
                return await this.createOrPayEmi(voucherDto);
            }
            else {
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
