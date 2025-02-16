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
import { ProductDetailDto, VoucherDto } from "./dto/voucher.dto";
import { VoucherEntity } from "./entity/voucher.entity";
import { VoucherTypeEnum } from "./enum/voucher-type-enum";
import { VoucherRepository } from "./repo/voucher.repo";
import { VoucherAdapter } from "./voucher.adapter";
import { AccountEntity } from "src/account/entity/account.entity";
import { EmiPaymentEntity } from "./entity/emi-payments";
import { EmiPaymentRepository } from "./repo/emi-payment-repo";
import { Storage } from '@google-cloud/storage';
import { ProductRepository } from "src/product/repo/product.repo";

@Injectable()
export class VoucherService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly voucherRepository: VoucherRepository,
        private readonly voucherAdapter: VoucherAdapter,
        private readonly accountRepo: AccountRepository,
        private readonly estimateRepo: EstimateRepository,
        private readonly accountRepository: AccountRepository,
        private readonly emiPaymentRepository: EmiPaymentRepository,
        private readonly productRepository: ProductRepository,


    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }


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
        console.log(lastVoucher, "{{{{{{{{{{{")
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

    // async createVoucher(voucherDto: VoucherDto, receiptPdf?: string | null): Promise<CommonResponse> {
    //     try {
    //         const generatedVoucherId = await this.generateVoucherNumber(voucherDto.voucherType);
    //         const voucherEntity = this.voucherAdapter.dtoToEntity(voucherDto);

    //         // Fetch From Account (Mandatory for all transactions)
    //         const fromAccount = await this.accountRepository.findOne({
    //             where: { companyCode: voucherDto.companyCode, unitCode: voucherDto.unitCode, id: voucherDto.fromAccount },
    //         });

    //         if (!fromAccount) {
    //             throw new Error('From account not found.');
    //         }

    //         let toAccount: AccountEntity | null = null;

    //         // For CONTRA transactions, To Account is mandatory
    //         if (voucherEntity.voucherType === VoucherTypeEnum.CONTRA) {
    //             if (!voucherDto.toAccount) {
    //                 throw new Error('To account is required for CONTRA transactions.');
    //             }

    //             toAccount = await this.accountRepository.findOne({
    //                 where: { companyCode: voucherDto.companyCode, unitCode: voucherDto.unitCode, id: voucherDto.toAccount },
    //             });

    //             if (!toAccount) {
    //                 throw new Error('To account not found for CONTRA transaction.');
    //             }
    //         }

    //         const voucherAmount = voucherDto.amount; // Corrected to use DTO amount
    //         console.log(voucherAmount, "voucherAmountvoucherAmount")
    //         // Check for sufficient funds before deducting
    //         if (
    //             [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.JOURNAL, VoucherTypeEnum.PURCHASE, VoucherTypeEnum.CONTRA].includes(voucherEntity.voucherType)
    //             && fromAccount.totalAmount < voucherAmount
    //         ) {
    //             throw new Error('Insufficient funds in the from account.');
    //         }

    //         switch (voucherEntity.voucherType) {
    //             // case VoucherTypeEnum.RECEIPT:
    //             //     fromAccount.totalAmount += voucherAmount;
    //             //     break;
    //             case VoucherTypeEnum.RECEIPT:
    //                 console.log('Before updating totalAmount:', fromAccount.totalAmount);
    //                 fromAccount.totalAmount = Number(fromAccount.totalAmount) + Number(voucherAmount);
    //                 console.log('After updating totalAmount:', fromAccount.totalAmount);
    //                 break;

    //             case VoucherTypeEnum.PAYMENT:
    //             case VoucherTypeEnum.JOURNAL:
    //             case VoucherTypeEnum.PURCHASE:
    //                 fromAccount.totalAmount -= voucherAmount; // Deducting money
    //                 break;
    //             case VoucherTypeEnum.CONTRA:
    //                 if (!toAccount) {
    //                     throw new Error('To account is required for bank-to-bank transfers.');
    //                 }

    //                 // Check if sufficient funds exist in the from account
    //                 if (fromAccount.totalAmount < voucherAmount) {
    //                     throw new Error('Insufficient funds in the from account for CONTRA transaction.');
    //                 }

    //                 fromAccount.totalAmount -= voucherAmount; // Debit from source
    //                 toAccount.totalAmount += voucherAmount; // Credit to destination
    //                 break;
    //             default:
    //                 throw new Error(`Unhandled voucher type: ${voucherEntity.voucherType}`);
    //         }
    //         console.log(fromAccount, voucherAmount, "fromAccountfromAccount")
    //         // Save updated accounts
    //         await this.accountRepository.save(toAccount ? [fromAccount, toAccount] : [fromAccount]);

    //         // Set Voucher ID
    //         voucherEntity.voucherId = generatedVoucherId;

    //         // Handle Invoice Payment
    //         if (voucherDto.invoice && VoucherTypeEnum.RECEIPT) {
    //             const estimate = await this.estimateRepo.findOne({ where: { invoiceId: voucherDto.invoice } });
    //             if (!estimate) {
    //                 throw new ErrorResponse(4001, 'Estimate not found.');
    //             }

    //             if (receiptPdf) {
    //                 estimate.receiptPdfUrl = receiptPdf;
    //                 await this.estimateRepo.save(estimate);
    //             }

    //         }

    //         // Insert the voucher record
    //         await this.voucherRepository.insert(voucherEntity);

    //         return new CommonResponse(
    //             true,
    //             65152,
    //             `Voucher Created Successfully with ID: ${generatedVoucherId}`
    //         );
    //     } catch (error) {
    //         console.error(`Error creating voucher details: ${error.message}`, error.stack);
    //         throw new ErrorResponse(
    //             error?.code || 5416,
    //             `Failed to create voucher details: ${error.message}`
    //         );
    //     }
    // }

    async createVoucher(voucherDto: VoucherDto, receiptPdf?: string | null): Promise<CommonResponse> {

        try {

            console.log(voucherDto, "?????????????????")
            const generatedVoucherId = await this.generateVoucherNumber(voucherDto.voucherType);
            const voucherEntity = this.voucherAdapter.dtoToEntity(voucherDto);

            let fromAccount: AccountEntity | null = null;

            let productDetails: ProductDetailDto[] = [];
            if (voucherEntity.voucherType === VoucherTypeEnum.PURCHASE) {
                const productDetailsArray: ProductDetailDto[] =
                    typeof voucherDto.productDetails === "string"
                        ? JSON.parse(voucherDto.productDetails)
                        : voucherDto.productDetails;

                if (!Array.isArray(productDetailsArray)) {
                    throw new Error("Invalid productDetails format. Expected an array.");
                }

                productDetails = await Promise.all(
                    productDetailsArray.map(async (productDetail) => {
                        const product = await this.productRepository.findOne({
                            where: { id: productDetail.productId },
                        });
                        if (!product) {
                            throw new Error(`Product with ID ${productDetail.productId} not found`);
                        }

                        const quantity = productDetail.quantity ? parseInt(productDetail.quantity.toString(), 10) : 0;
                        if (quantity <= 0) {
                            throw new Error(`Quantity for product ${product.productName} must be greater than 0`);
                        }

                        const costPerUnit = parseFloat(product.price.toString()) || 0;
                        if (costPerUnit <= 0) {
                            throw new Error(`Cost per unit for product ${product.productName} must be greater than 0`);
                        }

                        return {
                            productId: product.id,
                            productName: product.productName,
                            quantity: quantity,
                            totalCost: costPerUnit * quantity || 0,
                        };
                    })
                );
            }

            // Assign productDetails to voucherEntity
            voucherEntity.productDetails = productDetails;
            //![VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT].includes(voucherEntity.voucherType) || 
            // Fetch From Account (Mandatory for some transactions)
            if (voucherDto.paymentType !== PaymentType.CASH) {

                if (voucherDto.fromAccount) {
                    fromAccount = await this.accountRepository.findOne({
                        where: { id: voucherDto.fromAccount },
                    });
                    if (!fromAccount) {
                        throw new Error('From account not found.');
                    }
                    const voucherAmount = Number(voucherDto.amount); // Ensure it's a number
                    const accountBalance = Number(fromAccount.totalAmount); // Ensure it's a number
                    console.log(`Voucher Amount: ${voucherAmount}, Account Balance: ${accountBalance}`);

                    if (voucherAmount > accountBalance) {
                        throw new Error('Insufficient funds in the from account.');
                    }


                    if (
                        [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.JOURNAL, VoucherTypeEnum.PURCHASE, VoucherTypeEnum.CONTRA].includes(voucherEntity.voucherType)
                        && accountBalance < voucherAmount
                    ) {
                        throw new Error('Insufficient funds in the from account.');
                    }
                }



                let toAccount: AccountEntity | null = null;

                // For CONTRA transactions, To Account is mandatory
                if (voucherEntity.voucherType === VoucherTypeEnum.CONTRA) {
                    if (!voucherDto.toAccount) {
                        throw new Error('To account is required for CONTRA transactions.');
                    }

                    toAccount = await this.accountRepository.findOne({
                        where: { id: voucherDto.toAccount },
                    });

                    if (!toAccount) {
                        throw new Error('To account not found for CONTRA transaction.');
                    }
                }

                const voucherAmount = voucherDto.amount;
                let accountBalance = Number(fromAccount.totalAmount);
                switch (voucherEntity.voucherType) {
                    case VoucherTypeEnum.RECEIPT:
                        console.log('Before updating totalAmount:', accountBalance);
                        if (fromAccount) {
                            fromAccount.totalAmount = accountBalance + Number(voucherAmount);  // Directly update the entity
                        }
                        console.log('After updating totalAmount:', fromAccount.totalAmount);
                        break;

                    case VoucherTypeEnum.PAYMENT:
                    case VoucherTypeEnum.JOURNAL:
                    case VoucherTypeEnum.PURCHASE:
                        console.log('Before updating totalAmount:', accountBalance);
                        if (fromAccount) {
                            fromAccount.totalAmount = accountBalance - Number(voucherAmount);  // Directly update the entity
                        }
                        console.log('After updating totalAmount:', fromAccount.totalAmount);
                        break;

                    case VoucherTypeEnum.CONTRA:
                        if (fromAccount) {
                            fromAccount.totalAmount = accountBalance - Number(voucherAmount);  // Debit from source
                        }
                        console.log('After updating totalAmount from source:', fromAccount.totalAmount);
                        if (toAccount) {
                            toAccount.totalAmount += Number(voucherAmount);  // Credit to destination
                        }
                        console.log('After updating totalAmount for destination:', toAccount.totalAmount);
                        break;

                    default:
                        throw new Error(`Unhandled voucher type: ${voucherEntity.voucherType}`);
                }

                // Save updated accounts
                const accountsToSave = [fromAccount, toAccount].filter(account => account !== null) as AccountEntity[];
                await this.accountRepository.save(accountsToSave);  // Ensure these changes are saved


                // Set Voucher ID


                // Handle Invoice Payment (only for RECEIPT type)

            }
            voucherEntity.voucherId = generatedVoucherId;

            if (voucherDto.invoiceId && voucherEntity.voucherType === VoucherTypeEnum.RECEIPT) {
                console.log("Attempting to find estimate for invoice:", voucherDto.invoiceId);
                const estimate = await this.estimateRepo.findOne({ where: { invoiceId: voucherDto.invoiceId } });

                if (!estimate) {
                    throw new ErrorResponse(4001, 'Estimate not found.');
                }
                voucherEntity.estimate = estimate

                console.log("Estimate found:", estimate);
                if (receiptPdf) {
                    console.log("Updating receiptPdfUrl with:", receiptPdf);
                    estimate.receiptPdfUrl = receiptPdf;
                    await this.estimateRepo.save(estimate);
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

    async handleVoucher(voucherDto: VoucherDto, pdf?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let filePath: string | null = null;

            // 🔹 Upload file to Google Cloud Storage if provided
            if (pdf) {
                try {
                    const bucket = this.storage.bucket(this.bucketName);
                    const uniqueFileName = `receipt_pdfs/${Date.now()}-${pdf.originalname}`;
                    const file = bucket.file(uniqueFileName);

                    await file.save(pdf.buffer, {
                        contentType: pdf.mimetype,
                        resumable: false,
                    });

                    console.log(`✅ File uploaded to GCS: ${uniqueFileName}`);
                    filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
                } catch (fileError) {
                    console.error(`❌ File upload failed: ${fileError.message}`, fileError.stack);
                    throw new ErrorResponse(5418, `Failed to upload file: ${fileError.message}`);
                }
            }

            if ((voucherDto.id && voucherDto.id !== null) || (voucherDto.voucherId && voucherDto.voucherId.trim() !== '')) {
                console.log(`🔄 Updating existing voucher with ID: ${voucherDto.voucherId}`);
                return await this.updateVoucher(voucherDto);
            }

            if (voucherDto.voucherType === VoucherTypeEnum.EMI) {
                console.log(`💳 Handling EMI voucher for ID: ${voucherDto.voucherId}`);
                return await this.createOrPayEmi(voucherDto);
            }

            console.log(`🆕 Creating new voucher with ID: ${voucherDto.voucherId}`);
            return await this.createVoucher(voucherDto, filePath);

        } catch (error) {
            console.error(`❌ Error in handleVoucher: ${error.message}`, error.stack);
            throw new ErrorResponse(5417, `Failed to handle voucher: ${error.message}`);
        }
    }


    async getAllVouchers(): Promise<VoucherResDto[]> {
        const vouchers = await this.voucherRepository.find();
        return this.voucherAdapter.entityToDto(vouchers);
    }

    async deleteVoucherDetails(dto: { voucherId: string }): Promise<CommonResponse> {
        try {
            // Find voucher by voucherId as a string
            const voucher = await this.voucherRepository.findOne({
                where: { voucherId: String(dto.voucherId) }
            });

            if (!voucher) {
                return new CommonResponse(false, 404, 'Voucher not found');
            }

            // Delete voucher by voucherId as string
            await this.voucherRepository.delete({ voucherId: String(dto.voucherId) });
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
