import { Injectable, NotFoundException } from "@nestjs/common";
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
import { DebitORCreditEnum, TypeEnum, VoucherEntity } from "./entity/voucher.entity";
import { VoucherTypeEnum } from "./enum/voucher-type-enum";
import { VoucherRepository } from "./repo/voucher.repo";
import { VoucherAdapter } from "./voucher.adapter";
import { AccountEntity } from "src/account/entity/account.entity";
import { EmiPaymentEntity } from "./entity/emi-payments";
import { EmiPaymentRepository } from "./repo/emi-payment-repo";
import { Storage } from '@google-cloud/storage';
import { ProductRepository } from "src/product/repo/product.repo";
import { LedgerRepository } from "src/ledger/repo/ledger.repo";
import { In } from "typeorm";

@Injectable()
export class VoucherService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly voucherRepository: VoucherRepository,
        private readonly voucherAdapter: VoucherAdapter,
        private readonly estimateRepo: EstimateRepository,
        private readonly accountRepository: AccountRepository,
        // private readonly emiPaymentRepository: EmiPaymentRepository,
        private readonly productRepository: ProductRepository,
        private readonly ledgerRepo: LedgerRepository


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
            DEBITNOTE: 'DN',
            CREDITNOTE: 'CN',
            SALESORDER: 'SO',
            PURCHASEORDER: 'PO',
            SALES: 'SA',
        };

        // Convert input to uppercase to match the enum
        const formattedVoucherType = voucherType.toUpperCase();
        const prefix = typePrefix[formattedVoucherType] || 'UN';

        console.log(`Voucher Type: ${voucherType}, Prefix Selected: ${prefix}`);

        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');

        // Fetch the last voucher ID regardless of the date
        const lastVoucher = await this.voucherRepository
            .createQueryBuilder('voucher')
            .where('voucher.voucherType = :voucherType', { voucherType })
            .andWhere('voucher.voucherId LIKE :prefix', { prefix: `${prefix}-%` }) // Allow different dates
            .orderBy('voucher.voucherId', 'DESC')
            .getOne();

        console.log(lastVoucher, "Last Voucher Retrieved");

        let sequentialNumber = 1;

        if (lastVoucher) {
            // Extract the last numeric sequence
            const lastVoucherNumber = lastVoucher.voucherId.split('-').pop();
            if (lastVoucherNumber) {
                sequentialNumber = parseInt(lastVoucherNumber, 10) + 1;
            }
        }

        const paddedSequentialNumber = sequentialNumber.toString().padStart(3, '0');

        return `${prefix}-${timestamp}-${paddedSequentialNumber}`;
    }


    async updateVoucher(voucherDto: VoucherDto): Promise<CommonResponse> {
        try {
            const existingVoucher = await this.voucherRepository.findOne({
                where: { id: voucherDto.id },
                relations: ['estimate'],
            });

            if (!existingVoucher) {
                throw new Error(`Voucher with ID ${voucherDto.id} not found.`);
            }

            const oldAmount = Number(existingVoucher.amount);
            const voucherEntity = this.voucherAdapter.dtoToEntity(voucherDto);
            voucherEntity.id = existingVoucher.id;
            voucherEntity.voucherId = existingVoucher.voucherId;

            // =========================
            // 1. Product Details Update
            // =========================
            let productDetails: ProductDetailDto[] = [];
            let totalCost = 0;

            if (voucherDto.productDetails) {
                const parsedDetails = typeof voucherDto.productDetails === 'string'
                    ? JSON.parse(voucherDto.productDetails)
                    : voucherDto.productDetails;

                if (!Array.isArray(parsedDetails)) {
                    throw new Error('Invalid productDetails format. Expected an array.');
                }

                productDetails = parsedDetails.map(detail => {
                    const quantity = parseInt(detail.quantity?.toString() || '0', 10);
                    const rate = parseFloat(detail.rate?.toString() || '0');
                    const total = quantity * rate;
                    totalCost += total;

                    return {
                        type: detail.type || TypeEnum.Product_Sales,
                        productName: detail.productName,
                        quantity,
                        rate,
                        totalCost: total,
                        description: detail.description,
                    };
                });

                voucherEntity.productDetails = productDetails;
            }

            // ============================
            // 2. Payment Processing Logic
            // ============================
            let fromAccount: AccountEntity | null = null;
            let toAccount: AccountEntity | null = null;

            if (voucherDto.paymentType) {
                if (voucherDto.fromAccount) {
                    fromAccount = await this.accountRepository.findOne({ where: { id: voucherDto.fromAccount } });
                    if (!fromAccount) throw new Error("From account not found.");
                }

                if (voucherDto.toAccount) {
                    toAccount = await this.accountRepository.findOne({ where: { id: voucherDto.toAccount } });
                    if (!toAccount) throw new Error("To account not found.");
                }

                let totalPaidAmount = 0;

                if ([VoucherTypeEnum.PAYMENT, VoucherTypeEnum.RECEIPT].includes(voucherEntity.voucherType)) {
                    if (voucherDto.pendingInvoices?.length > 0) {
                        const invoiceIds = voucherDto.pendingInvoices.map(i => i.invoiceId);
                        const pendingVouchers = await this.voucherRepository.find({ where: { invoiceId: In(invoiceIds) } });

                        const voucherMap = new Map(pendingVouchers.map(v => [v.invoiceId, v]));

                        for (const invoice of voucherDto.pendingInvoices) {
                            const matchedVoucher = voucherMap.get(invoice.invoiceId);
                            if (matchedVoucher) {
                                matchedVoucher.amount = invoice.amount;
                                matchedVoucher.paidAmount = invoice.paidAmount;
                                matchedVoucher.reminigAmount = invoice.reminigAmount;
                                matchedVoucher.paymentStatus =
                                    matchedVoucher.reminigAmount === 0
                                        ? PaymentStatus.COMPLETED
                                        : PaymentStatus.PENDING;
                                await this.voucherRepository.save(matchedVoucher);
                            }

                            const paidAmount = parseFloat(invoice.paidAmount?.toString() || '0');
                            totalPaidAmount += paidAmount;
                        }

                        voucherEntity.amount = totalPaidAmount;
                    }
                }

                const newAmount = Number(voucherEntity.amount);

                // ========================
                // 3. Reverse Old Balances
                // ========================
                switch (existingVoucher.voucherType) {
                    case VoucherTypeEnum.RECEIPT:
                    case VoucherTypeEnum.DEBITNOTE:

                        if (fromAccount) existingVoucher.fromAccount.totalAmount -= oldAmount;
                        break;
                    case VoucherTypeEnum.PAYMENT:
                    case VoucherTypeEnum.CREDITNOTE:
                        if (fromAccount) existingVoucher.fromAccount.totalAmount += oldAmount;
                        break;
                    case VoucherTypeEnum.CONTRA:
                        if (fromAccount) existingVoucher.fromAccount.totalAmount += oldAmount;
                        if (toAccount) existingVoucher.toAccount.totalAmount -= oldAmount;
                        break;
                    case VoucherTypeEnum.JOURNAL:
                        if (voucherDto.journalType === DebitORCreditEnum.Credit && fromAccount)
                            existingVoucher.fromAccount.totalAmount += oldAmount;
                        else if (toAccount)
                            existingVoucher.toAccount.totalAmount -= oldAmount;
                        break;
                }
                const oldAccountsToSave = [existingVoucher.fromAccount, existingVoucher.toAccount].filter(Boolean) as AccountEntity[];
                await this.accountRepository.save(oldAccountsToSave);

                // ========================
                // 4. Apply New Balances
                // ========================
                switch (voucherEntity.voucherType) {
                    case VoucherTypeEnum.RECEIPT:
                    case VoucherTypeEnum.DEBITNOTE:
                        if (fromAccount) fromAccount.totalAmount += newAmount;
                        break;
                    case VoucherTypeEnum.PAYMENT:
                    case VoucherTypeEnum.CREDITNOTE:
                        if (fromAccount) fromAccount.totalAmount -= newAmount;
                        break;
                    case VoucherTypeEnum.CONTRA:
                        if (fromAccount) fromAccount.totalAmount -= newAmount;
                        if (toAccount) toAccount.totalAmount += newAmount;
                        break;
                    case VoucherTypeEnum.JOURNAL:
                        if (voucherDto.journalType === DebitORCreditEnum.Credit && fromAccount)
                            fromAccount.totalAmount -= newAmount;
                        else if (toAccount)
                            toAccount.totalAmount += newAmount;
                        break;
                }

                const accountsToSave = [fromAccount, toAccount].filter(Boolean) as AccountEntity[];
                await this.accountRepository.save(accountsToSave);
            }

            // ========================
            // 5. Estimate Association
            // ========================
            if (voucherDto.invoiceId && voucherEntity.voucherType === VoucherTypeEnum.RECEIPT) {
                const estimate = await this.estimateRepo.findOne({ where: { invoiceId: voucherDto.invoiceId } });
                if (estimate) {
                    voucherEntity.estimate = estimate;
                }
            }

            voucherEntity.invoiceId = voucherDto.invoiceId;
            await this.voucherRepository.save(voucherEntity);

            return new CommonResponse(true, 65153, `Voucher Updated Successfully for ID: ${voucherDto.id}`);
        } catch (error) {
            console.error('Error updating voucher:', error.message, error.stack);
            throw new ErrorResponse(error?.code || 5417, `Failed to update voucher: ${error.message}`);
        }
    }

    async createVoucher(voucherDto: VoucherDto): Promise<CommonResponse> {
        try {

            const generatedVoucherId = await this.generateVoucherNumber(voucherDto.voucherType);
            const voucherEntity = this.voucherAdapter.dtoToEntity(voucherDto);

            let fromAccount: AccountEntity | null = null;
            let productDetails: ProductDetailDto[] = [];
            let totalCost = 0;

            // Extract product details and calculate totalCost
            if (voucherDto.productDetails) {
                const productDetailsArray: ProductDetailDto[] =
                    typeof voucherDto.productDetails === "string"
                        ? JSON.parse(voucherDto.productDetails)
                        : voucherDto.productDetails;

                if (!Array.isArray(productDetailsArray)) {
                    throw new Error("Invalid productDetails format. Expected an array.");
                }

                productDetails = productDetailsArray.map((productDetail) => {
                    const quantity = productDetail.quantity ? parseInt(productDetail.quantity.toString(), 10) : 0;
                    const costPerUnit = parseFloat(productDetail.rate.toString()) || 0;
                    const totalProductCost = costPerUnit * quantity;

                    totalCost += totalProductCost; // ✅ Accumulate totalCost first

                    return {
                        type: productDetail.type || TypeEnum.Product_Sales,
                        productName: productDetail.productName,
                        quantity: quantity,
                        rate: costPerUnit,
                        totalCost: totalProductCost,
                        description: productDetail.description,
                    };
                });
                // // ✅ Apply GST, TDS, and TCS on totalCost, not per product
                // const cgstRate = parseFloat(voucherDto.CGST?.toString() || "0");
                // const sgstRate = parseFloat(voucherDto.SGST?.toString() || "0");
                // const igstRate = parseFloat(voucherDto.IGST?.toString() || "0");
                // const tdsRate = parseFloat(voucherDto.TDS?.toString() || "0");
                // const tcsRate = parseFloat(voucherDto.TCS?.toString() || "0");

                // let totalGST = 0;
                // if (igstRate > 0) {
                //     totalGST = (igstRate * totalCost) / 100;
                // } else {
                //     totalGST = ((cgstRate + sgstRate) * totalCost) / 100;
                // }

                // const totalTDS = (tdsRate * totalCost) / 100;
                // const totalTCS = (tcsRate * totalCost) / 100;
                console.log("Processed Product Details:", productDetails);
            }
            // ✅ Final Amount Calculation
            voucherEntity.productDetails = productDetails;
            // Handle Account Transactions
            if (voucherDto.paymentType) {
                if (voucherDto.fromAccount) {
                    fromAccount = await this.accountRepository.findOne({ where: { id: voucherDto.fromAccount } });
                    if (!fromAccount) {
                        throw new Error('From account not found.');
                    }
                    const voucherAmount = Number(voucherEntity.amount);
                    const accountBalance = Number(fromAccount.totalAmount);

                    if (voucherAmount > accountBalance) {
                        throw new Error('Insufficient funds in the from account.');
                    }
                }
                if ([VoucherTypeEnum.PAYMENT, VoucherTypeEnum.RECEIPT].includes(voucherEntity.voucherType)) {
                    let totalPaidAmount = 0;

                    if (voucherDto.pendingInvoices?.length > 0) {
                        console.log("Pending invoices before update:", voucherDto.pendingInvoices);

                        const invoiceIds = voucherDto.pendingInvoices.map(v => v.invoiceId);
                        const pendingVouchers = await this.voucherRepository.find({ where: { invoiceId: In(invoiceIds) } });
                        const pendingVoucherMap = new Map(pendingVouchers.map(v => [v.invoiceId, v]));

                        await Promise.all(
                            voucherDto.pendingInvoices.map(async (invoice) => {
                                const pendingVoucher = pendingVoucherMap.get(invoice.invoiceId);
                                if (pendingVoucher) {
                                    pendingVoucher.amount = invoice.amount;
                                    pendingVoucher.paidAmount = invoice.paidAmount;
                                    pendingVoucher.reminigAmount = invoice.reminigAmount;
                                    pendingVoucher.paymentStatus = pendingVoucher.reminigAmount === 0
                                        ? PaymentStatus.COMPLETED
                                        : PaymentStatus.PENDING;

                                    await this.voucherRepository.save(pendingVoucher);
                                }
                                const paidAmount = parseFloat(invoice.paidAmount.toString()) || 0;
                                totalPaidAmount += paidAmount
                            })
                        );

                        console.log("Updated pending invoices:", voucherDto.pendingInvoices);
                    }
                    voucherEntity.amount = totalPaidAmount
                }

                let toAccount: AccountEntity | null = null;
                if (voucherDto.toAccount) {
                    toAccount = await this.accountRepository.findOne({ where: { id: voucherDto.toAccount } });
                    if (!toAccount) {
                        throw new Error('To account not found for CONTRA transaction.');
                    }
                }

                if (voucherDto.paymentType && !voucherDto.fromAccount) {
                    throw new Error("Missing 'fromAccount' for a voucher that requires payment.");
                }
                
                const voucherAmount = Number(voucherEntity.amount);
                let accountBalance = fromAccount ? Number(fromAccount.totalAmount || 0) : 0;

                switch (voucherEntity.voucherType) {
                    case VoucherTypeEnum.RECEIPT:
                        if (fromAccount) fromAccount.totalAmount = accountBalance + voucherAmount;
                        break;

                    case VoucherTypeEnum.DEBITNOTE:
                        if (fromAccount) fromAccount.totalAmount = accountBalance + voucherAmount;
                        break;

                    case VoucherTypeEnum.PAYMENT:
                        if (fromAccount) fromAccount.totalAmount = accountBalance - voucherAmount;
                        break;

                    case VoucherTypeEnum.CREDITNOTE:
                        if (fromAccount) fromAccount.totalAmount = accountBalance - voucherAmount;
                        break;

                    case VoucherTypeEnum.CONTRA:
                        if (fromAccount) fromAccount.totalAmount = accountBalance - voucherAmount;
                        if (toAccount) toAccount.totalAmount += voucherAmount;
                        break;

                    case VoucherTypeEnum.JOURNAL:
                        if (voucherDto.journalType === DebitORCreditEnum.Credit) {
                            fromAccount.totalAmount = accountBalance - voucherAmount;
                        }
                        else {
                            toAccount.totalAmount += voucherAmount;
                        }
                        break;

                    default:
                        throw new Error(`Unhandled voucher type: ${voucherEntity.voucherType}`);
                }

                const accountsToSave = [fromAccount, toAccount].filter(account => account !== null) as AccountEntity[];
                await this.accountRepository.save(accountsToSave);
            }

            voucherEntity.voucherId = generatedVoucherId;

            if (voucherDto.invoiceId && voucherEntity.voucherType === VoucherTypeEnum.RECEIPT) {
                console.log("Attempting to find estimate for invoice:", voucherDto.invoiceId);
                const estimate = await this.estimateRepo.findOne({ where: { invoiceId: voucherDto.invoiceId } });

                if (estimate) {
                    voucherEntity.estimate = estimate;
                    // if (receiptPdf) {
                    //     console.log("Updating receiptPdfUrl with:", receiptPdf);
                    //     estimate.receiptPdfUrl = receiptPdf;
                    //     await this.estimateRepo.save(estimate);
                    // }
                }
            }

            voucherEntity.invoiceId = voucherDto.invoiceId;
            await this.voucherRepository.insert(voucherEntity);

            return new CommonResponse(true, 65152, `Voucher Created Successfully with ID: ${generatedVoucherId}`);
        } catch (error) {
            console.error(`Error creating voucher details: ${error.message}`, error.stack);
            throw new ErrorResponse(error?.code || 5416, `Failed to create voucher details: ${error.message}`);
        }
    }

    async getPendingVouchers(req: { ledgerId: number }) {
        const ledger = await this.ledgerRepo.findOne({ where: { id: req.ledgerId } });

        if (!ledger) {
            throw new NotFoundException('Ledger not found.');
        }
        const pendingVouchers = await this.voucherRepository.find({
            where: {
                ledgerId: ledger, // Use the full entity instead of ledger.id
                paymentStatus: PaymentStatus.PENDING,
            },
            select: ['invoiceId', 'voucherType', 'amount', 'paidAmount', 'reminigAmount'],
            relations: ['branchId']// Return only invoiceId and amount
        });
        return { status: true, errorCode: 201, data: pendingVouchers, internalMessage: "" };
    }

    async getBankAmount(req: VoucherDto) {
        let fromAccount: AccountEntity | null = null;
        let toAccount: AccountEntity | null = null;

        // Fetch accounts if they exist in the request
        if (req.fromAccount) {
            fromAccount = await this.accountRepository.findOne({ where: { id: req.fromAccount } });
        }
        if (req.toAccount) {
            toAccount = await this.accountRepository.findOne({ where: { id: req.toAccount } });
        }

        // If neither account exists, throw an error
        if (!fromAccount && !toAccount) {
            throw new NotFoundException('Accounts not found.');
        }

        return {
            status: true,
            errorCode: 201,
            data: {
                fromAccountAmount: fromAccount?.totalAmount || 0,
                toAccountAmount: toAccount?.totalAmount || 0
            },
            internalMessage: ""
        };
    }

    // private calculateNextDueDate(lastPaidDate: Date): Date {
    //     const nextDueDate = new Date(lastPaidDate);
    //     nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    //     return nextDueDate;
    // }

    // async createOrPayEmi(voucherDto: VoucherDto): Promise<CommonResponse> {
    //     try {
    //         console.log('Received voucherDto:', voucherDto);

    //         const { amount, initialPayment, numberOfEmi, amountPaid, voucherId, paymentType, fromAccount, companyCode, unitCode } = voucherDto;

    //         // Validate EMI count
    //         if (numberOfEmi <= 0) {
    //             return new CommonResponse(false, 4005, 'Invalid EMI count.');
    //         }

    //         console.log('Fetching voucher with ID:', voucherId);
    //         // Fetch account details if required
    //         let account: AccountEntity | null = null;
    //         if (fromAccount && paymentType !== PaymentType.CASH) {
    //             account = await this.accountRepository.findOne({
    //                 where: { companyCode, unitCode, id: fromAccount },
    //             });

    //             if (!account) {
    //                 return new CommonResponse(false, 4004, 'From account not found.');
    //             }
    //         }

    //         // Handle voucher fetching and creation
    //         let voucher: VoucherEntity | null = null;
    //         if (voucherDto.voucherId) {
    //             voucher = await this.voucherRepository.findOne({
    //                 where: { voucherId: voucherDto.voucherId },
    //             });

    //         }
    //         console.log(voucher, "XXXXXXXXXXXXX")

    //         // If no voucher found, create a new one
    //         // if (!voucher || voucher === undefined) {
    //         //     const newVoucherId = await this.generateVoucherNumber(VoucherTypeEnum.EMI);
    //         //     console.log('Generated new voucher ID:', newVoucherId);

    //         //     const emiAmount = (amount - initialPayment) / numberOfEmi;

    //         //     if (account) {
    //         //         account.totalAmount -= initialPayment;
    //         //         await this.accountRepository.save(account);
    //         //     }

    //         //     // Create new voucher details
    //         //     voucher = new VoucherEntity();
    //         //     voucher.name = voucherDto.name
    //         //     voucher.voucherId = newVoucherId;
    //         //     voucher.companyCode = voucherDto.companyCode
    //         //     voucher.unitCode = voucherDto.unitCode
    //         //     voucher.paymentType = paymentType;
    //         //     voucher.amount = Number(amount);
    //         //     voucher.initialPayment = Number(initialPayment);
    //         //     voucher.remainingAmount = Number(amount) - Number(initialPayment);
    //         //     voucher.numberOfEmi = numberOfEmi;
    //         //     voucher.emiAmount = Number(emiAmount);
    //         //     voucher.emiNumber = 1;
    //         //     voucher.paymentStatus = PaymentStatus.PARTIALLY_PAID;
    //         //     voucher.lastPaidDate = new Date();
    //         //     voucher.nextDueDate = this.calculateNextDueDate(new Date());

    //         //     console.log('Saving new voucher:', voucher);
    //         //     await this.voucherRepository.save(voucher);

    //         //     const emiPayment = new EmiPaymentEntity();
    //         //     emiPayment.voucherId = newVoucherId;
    //         //     emiPayment.emiNumber = 1;
    //         //     emiPayment.paidAmount = Number(initialPayment);
    //         //     emiPayment.paymentDate = new Date();
    //         //     emiPayment.remainingBalance = Number(voucher.remainingAmount);

    //         //     console.log('Saving first EMI payment:', emiPayment);
    //         //     await this.emiPaymentRepository.save(emiPayment);

    //         //     return new CommonResponse(true, 65151, `EMI plan created successfully with Voucher ID: ${newVoucherId}`);
    //         // }

    //         // Process subsequent EMI payments
    //         const lastPayment = await this.emiPaymentRepository.findOne({
    //             where: { voucherId: voucher.voucherId },
    //             order: { emiNumber: 'DESC' },
    //         });
    //         console.log(lastPayment, "lastPayment")
    //         const newEmiNumber = lastPayment ? Number(lastPayment.emiNumber) + 1 : 1;

    //         if (newEmiNumber !== voucher.emiNumber + 1) {
    //             return new CommonResponse(false, 4003, 'Invalid EMI payment sequence.');
    //         }
    //         console.log(newEmiNumber, "newEmiNumber")

    //         if (account) {
    //             account.totalAmount -= amountPaid;
    //             await this.accountRepository.save(account);
    //         }
    //         console.log(account, "account")

    //         voucher.remainingAmount = Number(voucher.remainingAmount) - Number(amountPaid);
    //         voucher.paidAmount = Number(voucher.paidAmount || 0) + Number(amountPaid);
    //         voucher.emiNumber = Number(newEmiNumber);
    //         voucher.lastPaidDate = new Date();
    //         voucher.nextDueDate = this.calculateNextDueDate(voucher.lastPaidDate);
    //         voucher.paymentStatus = Number(voucher.remainingAmount) <= 0 ? PaymentStatus.COMPLETED : PaymentStatus.PARTIALLY_PAID;

    //         console.log('Updating voucher:', voucher);
    //         await this.voucherRepository.save(voucher);

    //         const emiPayment = new EmiPaymentEntity();
    //         emiPayment.voucherId = voucher.voucherId;
    //         emiPayment.emiNumber = Number(newEmiNumber);
    //         emiPayment.paidAmount = Number(amountPaid);
    //         emiPayment.paymentDate = new Date();
    //         emiPayment.remainingBalance = Number(voucher.remainingAmount);

    //         console.log('Saving EMI payment:', emiPayment);
    //         await this.emiPaymentRepository.save(emiPayment);

    //         return new CommonResponse(
    //             true,
    //             65153,
    //             `EMI number ${newEmiNumber} paid successfully. Remaining amount: ${voucher.remainingAmount}`
    //         );
    //     } catch (error) {
    //         console.error('Error processing EMI:', error);
    //         throw new ErrorResponse(5416, `Failed to process EMI: ${error.message}`);
    //     }
    // }

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

            // if (voucherDto.voucherType === VoucherTypeEnum.EMI) {
            //     console.log(`💳 Handling EMI voucher for ID: ${voucherDto.voucherId}`);
            //     return await this.createOrPayEmi(voucherDto);
            // }

            console.log(`🆕 Creating new voucher withhhh ID: ${voucherDto.fromAccount}`);
            return await this.createVoucher(voucherDto);

        } catch (error) {
            console.error(`❌ Error in handleVoucher: ${error.message}`, error.stack);
            throw new ErrorResponse(5417, `Failed to handle voucher: ${error.message}`);
        }
    }


    async getAllVouchers(): Promise<VoucherResDto[]> {
        const vouchers = await this.voucherRepository.find({
            relations: ['branchId', 'ledgerId', 'fromAccount', 'toAccount'], // make sure this is included
        });
        return this.voucherAdapter.entityToDto(vouchers);
    }

    async deleteVoucherDetails(dto: { voucherId: string }): Promise<CommonResponse> {
        try {
            // Find voucher by voucherId as a string
            const existingVoucher = await this.voucherRepository.findOne({
                where: { voucherId: String(dto.voucherId) }
            });

            if (!existingVoucher) {
                return new CommonResponse(false, 404, 'Voucher not found');
            }

            const oldAmount = Number(existingVoucher.amount);

            // ========================
            // 3. Reverse Old Balances
            // ========================
            switch (existingVoucher.voucherType) {
                case VoucherTypeEnum.RECEIPT:
                case VoucherTypeEnum.DEBITNOTE:

                    if (oldAmount) existingVoucher.fromAccount.totalAmount -= oldAmount;
                    break;
                case VoucherTypeEnum.PAYMENT:
                case VoucherTypeEnum.CREDITNOTE:
                    if (oldAmount) existingVoucher.fromAccount.totalAmount += oldAmount;
                    break;
                case VoucherTypeEnum.CONTRA:
                    if (oldAmount) existingVoucher.fromAccount.totalAmount += oldAmount;
                    if (oldAmount) existingVoucher.toAccount.totalAmount -= oldAmount;
                    break;
                case VoucherTypeEnum.JOURNAL:
                    if (existingVoucher.journalType === DebitORCreditEnum.Credit && oldAmount)
                        existingVoucher.fromAccount.totalAmount += oldAmount;
                    else
                        existingVoucher.toAccount.totalAmount -= oldAmount;
                    break;
            }
            const oldAccountsToSave = [existingVoucher.fromAccount, existingVoucher.toAccount].filter(Boolean) as AccountEntity[];
            await this.accountRepository.save(oldAccountsToSave);

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
