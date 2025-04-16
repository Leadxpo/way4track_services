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
const account_repo_1 = require("../account/repo/account.repo");
const estimate_repo_1 = require("../estimate/repo/estimate.repo");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const payment_status_enum_1 = require("../product/dto/payment-status.enum");
const voucher_entity_1 = require("./entity/voucher.entity");
const voucher_type_enum_1 = require("./enum/voucher-type-enum");
const voucher_repo_1 = require("./repo/voucher.repo");
const voucher_adapter_1 = require("./voucher.adapter");
const storage_1 = require("@google-cloud/storage");
const product_repo_1 = require("../product/repo/product.repo");
const ledger_repo_1 = require("../ledger/repo/ledger.repo");
const typeorm_1 = require("typeorm");
let VoucherService = class VoucherService {
    constructor(voucherRepository, voucherAdapter, estimateRepo, accountRepository, productRepository, ledgerRepo) {
        this.voucherRepository = voucherRepository;
        this.voucherAdapter = voucherAdapter;
        this.estimateRepo = estimateRepo;
        this.accountRepository = accountRepository;
        this.productRepository = productRepository;
        this.ledgerRepo = ledgerRepo;
        this.storage = new storage_1.Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    async generateVoucherNumber(voucherType) {
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
        const formattedVoucherType = voucherType.toUpperCase();
        const prefix = typePrefix[formattedVoucherType] || 'UN';
        console.log(`Voucher Type: ${voucherType}, Prefix Selected: ${prefix}`);
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const lastVoucher = await this.voucherRepository
            .createQueryBuilder('voucher')
            .where('voucher.voucherType = :voucherType', { voucherType })
            .andWhere('voucher.voucherId LIKE :prefix', { prefix: `${prefix}-%` })
            .orderBy('voucher.voucherId', 'DESC')
            .getOne();
        console.log(lastVoucher, "Last Voucher Retrieved");
        let sequentialNumber = 1;
        if (lastVoucher) {
            const lastVoucherNumber = lastVoucher.voucherId.split('-').pop();
            if (lastVoucherNumber) {
                sequentialNumber = parseInt(lastVoucherNumber, 10) + 1;
            }
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
            Object.assign(existingVoucher, this.voucherAdapter.dtoToEntity(voucherDto));
            await this.voucherRepository.save(existingVoucher);
            return new common_response_1.CommonResponse(true, 65152, 'Voucher Updated Successfully');
        }
        catch (error) {
            console.error(`Error updating voucher details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to update voucher details: ${error.message}`);
        }
    }
    async createVoucher(voucherDto, receiptPdf) {
        try {
            console.log(voucherDto, "?????????????????");
            const generatedVoucherId = await this.generateVoucherNumber(voucherDto.voucherType);
            const voucherEntity = this.voucherAdapter.dtoToEntity(voucherDto);
            let fromAccount = null;
            let productDetails = [];
            let totalCost = 0;
            if (voucherDto.productDetails) {
                const productDetailsArray = typeof voucherDto.productDetails === "string"
                    ? JSON.parse(voucherDto.productDetails)
                    : voucherDto.productDetails;
                console.log(productDetailsArray, "+++++++++++++++++");
                if (!Array.isArray(productDetailsArray)) {
                    throw new Error("Invalid productDetails format. Expected an array.");
                }
                productDetails = productDetailsArray.map((productDetail) => {
                    const quantity = productDetail.quantity ? parseInt(productDetail.quantity.toString(), 10) : 0;
                    const costPerUnit = parseFloat(productDetail.rate.toString()) || 0;
                    const totalProductCost = costPerUnit * quantity;
                    totalCost += totalProductCost;
                    return {
                        type: productDetail.type || voucher_entity_1.TypeEnum.Product_Sales,
                        productName: productDetail.productName,
                        quantity: quantity,
                        rate: costPerUnit,
                        totalCost: totalProductCost,
                        description: productDetail.description,
                    };
                });
                console.log("Processed Product Details:", productDetails);
            }
            voucherEntity.productDetails = productDetails;
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
                if ([voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.RECEIPT].includes(voucherEntity.voucherType)) {
                    let totalPaidAmount = 0;
                    if (voucherDto.pendingInvoices?.length > 0) {
                        console.log("Pending invoices before update:", voucherDto.pendingInvoices);
                        const invoiceIds = voucherDto.pendingInvoices.map(v => v.invoiceId);
                        const pendingVouchers = await this.voucherRepository.find({ where: { invoiceId: (0, typeorm_1.In)(invoiceIds) } });
                        const pendingVoucherMap = new Map(pendingVouchers.map(v => [v.invoiceId, v]));
                        await Promise.all(voucherDto.pendingInvoices.map(async (invoice) => {
                            const pendingVoucher = pendingVoucherMap.get(invoice.invoiceId);
                            if (pendingVoucher) {
                                pendingVoucher.amount = invoice.amount;
                                pendingVoucher.paidAmount = invoice.paidAmount;
                                pendingVoucher.reminigAmount = invoice.reminigAmount;
                                pendingVoucher.paymentStatus = pendingVoucher.reminigAmount === 0
                                    ? payment_status_enum_1.PaymentStatus.COMPLETED
                                    : payment_status_enum_1.PaymentStatus.PENDING;
                                await this.voucherRepository.save(pendingVoucher);
                            }
                            const paidAmount = parseFloat(invoice.paidAmount.toString()) || 0;
                            totalPaidAmount += paidAmount;
                        }));
                        console.log("Updated pending invoices:", voucherDto.pendingInvoices);
                    }
                    voucherEntity.amount = totalPaidAmount;
                }
                let toAccount = null;
                if (voucherDto.toAccount) {
                    toAccount = await this.accountRepository.findOne({ where: { id: voucherDto.toAccount } });
                    if (!toAccount) {
                        throw new Error('To account not found for CONTRA transaction.');
                    }
                }
                const voucherAmount = Number(voucherEntity.amount);
                let accountBalance = Number(fromAccount?.totalAmount || 0);
                switch (voucherEntity.voucherType) {
                    case voucher_type_enum_1.VoucherTypeEnum.RECEIPT:
                        if (fromAccount)
                            fromAccount.totalAmount = accountBalance + voucherAmount;
                        break;
                    case voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE:
                        if (fromAccount)
                            fromAccount.totalAmount = accountBalance + voucherAmount;
                        break;
                    case voucher_type_enum_1.VoucherTypeEnum.PAYMENT:
                        if (fromAccount)
                            fromAccount.totalAmount = accountBalance - voucherAmount;
                        break;
                    case voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE:
                        if (fromAccount)
                            fromAccount.totalAmount = accountBalance - voucherAmount;
                        break;
                    case voucher_type_enum_1.VoucherTypeEnum.CONTRA:
                        if (fromAccount)
                            fromAccount.totalAmount = accountBalance - voucherAmount;
                        if (toAccount)
                            toAccount.totalAmount += voucherAmount;
                        break;
                    case voucher_type_enum_1.VoucherTypeEnum.JOURNAL:
                        if (voucherDto.journalType === voucher_entity_1.DebitORCreditEnum.Credit) {
                            fromAccount.totalAmount = accountBalance - voucherAmount;
                        }
                        else {
                            toAccount.totalAmount += voucherAmount;
                        }
                        break;
                    default:
                        throw new Error(`Unhandled voucher type: ${voucherEntity.voucherType}`);
                }
                const accountsToSave = [fromAccount, toAccount].filter(account => account !== null);
                await this.accountRepository.save(accountsToSave);
            }
            voucherEntity.voucherId = generatedVoucherId;
            if (voucherDto.invoiceId && voucherEntity.voucherType === voucher_type_enum_1.VoucherTypeEnum.RECEIPT) {
                console.log("Attempting to find estimate for invoice:", voucherDto.invoiceId);
                const estimate = await this.estimateRepo.findOne({ where: { invoiceId: voucherDto.invoiceId } });
                if (estimate) {
                    voucherEntity.estimate = estimate;
                    if (receiptPdf) {
                        console.log("Updating receiptPdfUrl with:", receiptPdf);
                        estimate.receiptPdfUrl = receiptPdf;
                        await this.estimateRepo.save(estimate);
                    }
                }
            }
            voucherEntity.invoiceId = voucherDto.invoiceId;
            await this.voucherRepository.insert(voucherEntity);
            return new common_response_1.CommonResponse(true, 65152, `Voucher Created Successfully with ID: ${generatedVoucherId}`);
        }
        catch (error) {
            console.error(`Error creating voucher details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(error?.code || 5416, `Failed to create voucher details: ${error.message}`);
        }
    }
    async getPendingVouchers(req) {
        const ledger = await this.ledgerRepo.findOne({ where: { id: req.ledgerId } });
        if (!ledger) {
            throw new common_1.NotFoundException('Ledger not found.');
        }
        const pendingVouchers = await this.voucherRepository.find({
            where: {
                ledgerId: ledger,
                paymentStatus: payment_status_enum_1.PaymentStatus.PENDING,
            },
            select: ['invoiceId', 'amount', 'paidAmount', 'reminigAmount'],
        });
        return { status: true, errorCode: 201, data: pendingVouchers, internalMessage: "" };
    }
    async getBankAmount(req) {
        let fromAccount = null;
        let toAccount = null;
        if (req.fromAccount) {
            fromAccount = await this.accountRepository.findOne({ where: { id: req.fromAccount } });
        }
        if (req.toAccount) {
            toAccount = await this.accountRepository.findOne({ where: { id: req.toAccount } });
        }
        if (!fromAccount && !toAccount) {
            throw new common_1.NotFoundException('Accounts not found.');
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
    async handleVoucher(voucherDto, pdf) {
        try {
            let filePath = null;
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
                }
                catch (fileError) {
                    console.error(`❌ File upload failed: ${fileError.message}`, fileError.stack);
                    throw new error_response_1.ErrorResponse(5418, `Failed to upload file: ${fileError.message}`);
                }
            }
            if ((voucherDto.id && voucherDto.id !== null) || (voucherDto.voucherId && voucherDto.voucherId.trim() !== '')) {
                console.log(`🔄 Updating existing voucher with ID: ${voucherDto.voucherId}`);
                return await this.updateVoucher(voucherDto);
            }
            console.log(`🆕 Creating new voucher with ID: ${voucherDto.voucherId}`);
            return await this.createVoucher(voucherDto, filePath);
        }
        catch (error) {
            console.error(`❌ Error in handleVoucher: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5417, `Failed to handle voucher: ${error.message}`);
        }
    }
    async getAllVouchers() {
        const vouchers = await this.voucherRepository.find();
        return this.voucherAdapter.entityToDto(vouchers);
    }
    async deleteVoucherDetails(dto) {
        try {
            const voucher = await this.voucherRepository.findOne({
                where: { voucherId: String(dto.voucherId) }
            });
            if (!voucher) {
                return new common_response_1.CommonResponse(false, 404, 'Voucher not found');
            }
            await this.voucherRepository.delete({ voucherId: String(dto.voucherId) });
            return new common_response_1.CommonResponse(true, 200, 'Voucher deleted successfully');
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, error.message);
        }
    }
    async getVoucherNamesDropDown() {
        const data = await this.voucherRepository.find({
            select: ['id', 'voucherId'],
            relations: ['branchId']
        });
        if (data.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data);
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
        voucher_adapter_1.VoucherAdapter,
        estimate_repo_1.EstimateRepository,
        account_repo_1.AccountRepository,
        product_repo_1.ProductRepository,
        ledger_repo_1.LedgerRepository])
], VoucherService);
//# sourceMappingURL=voucher-service.js.map