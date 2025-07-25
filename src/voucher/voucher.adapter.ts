import { Injectable } from "@nestjs/common";
import { VoucherDto } from "./dto/voucher.dto";
import { VoucherEntity } from "./entity/voucher.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";
// import { VendorEntity } from "src/vendor/entity/vendor.entity";
import { AccountEntity } from "src/account/entity/account.entity";
import { VoucherResDto } from "./dto/voucher-res.dto";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { ProductEntity } from "src/product/entity/product.entity";
import { EstimateEntity } from "src/estimate/entity/estimate.entity";
import { LedgerEntity } from "src/ledger/entity/ledger.entity";

@Injectable()
export class VoucherAdapter {
  dtoToEntity(dto: VoucherDto): VoucherEntity {
    const entity = new VoucherEntity();
    entity.name = dto.name;

    // Branch
    const branch = new BranchEntity();
    branch.id = dto.branchId;
    entity.branchId = branch;

    // Accounts
    if (dto.toAccount) {
      const toAccount = new AccountEntity();
      toAccount.id = dto.toAccount;
      entity.toAccount = toAccount;
    }

    if (dto.fromAccount) {
      const fromAccount = new AccountEntity();
      fromAccount.id = dto.fromAccount;
      entity.fromAccount = fromAccount;
    }
    // Client
    const client = new ClientEntity();
    client.clientId = dto.clientId;
    entity.clientId = client;

    const staff = new StaffEntity();
    staff.id = dto.staffId;
    entity.staffId = staff;

    const payment = new StaffEntity();
    staff.id = dto.staffId;
    entity.staffId = payment;

    const product = new ProductEntity();
    product.id = dto.product;
    entity.product = product;

    const subDealer = new SubDealerEntity();
    subDealer.id = dto.subDealerId
    entity.subDealer = subDealer

    const estimatePayment = new EstimateEntity()
    estimatePayment.id = dto.estimate
    entity.estimate = estimatePayment
    entity.invoiceId = dto.invoiceId
    // Basic fields
    // entity.role = dto.role;
    entity.purpose = dto.purpose;
    entity.creditAmount = dto.creditAmount;
    entity.paymentType = dto.paymentType;
    entity.quantity = dto.quantity;
    entity.voucherType = dto.voucherType;
    entity.generationDate = dto.generationDate;
    entity.expireDate = dto.expireDate;
    entity.shippingAddress = dto.shippingAddress;
    entity.buildingAddress = dto.buildingAddress;

    // Tax fields
    entity.hsnCode = dto.hsnCode;
    entity.journalType = dto.journalType;
    entity.SGST = dto.SGST;
    entity.CGST = dto.CGST;
    entity.amount = dto.amount;
    if (dto.creditAmount && dto.amount) {
      entity.reminigAmount = dto.creditAmount - dto.amount;
    } else {
      entity.reminigAmount = dto.reminigAmount;
    }
    // Company and unit info
    entity.upiId = dto.upiId;
    entity.checkNumber = dto.checkNumber;
    entity.checkNumber = dto.checkNumber;
    entity.cardNumber = dto.cardNumber;
    entity.companyCode = dto.companyCode
    entity.unitCode = dto.unitCode;
    entity.paymentStatus = dto.paymentStatus
    // Optional fields
    entity.voucherId = dto.voucherId;
    if (dto.id) {
      entity.id = dto.id;
    }
    if (dto.ledgerId) {
      const ledger = new LedgerEntity();
      ledger.id = dto.ledgerId
      entity.ledgerId = ledger
    }
    entity.voucherGST = dto.voucherGST
    entity.supplierLocation = dto.supplierLocation

    entity.paidAmount = dto.paidAmount
    entity.TDS = dto.TDS
    entity.TCS = dto.TCS
    entity.pendingInvoices = dto.pendingInvoices
    entity.dueDate = dto.dueDate
    return entity;
  }

  entityToDto(entity: VoucherEntity | VoucherEntity[]): VoucherResDto[] {
    if (Array.isArray(entity)) {
      return entity.map((voucher) => {
        return new VoucherResDto(
          voucher.id,
          voucher.name,
          voucher.branchId?.id || 0,
          voucher.branchId?.branchName || "Unknown",
          voucher.supplierLocation,
          voucher.purpose,
          voucher.creditAmount,
          voucher.paymentType,
          voucher.clientId?.clientId || "",
          voucher.clientId?.name || "Unknown",
          voucher.ledgerId?.id || 0,
          voucher.ledgerId?.name || "Unknown",
          voucher.staffId?.staffId || "",
          voucher.staffId?.name || "",
          voucher.toAccount?.accountName || "",
          voucher.fromAccount?.accountName || "",
          voucher.voucherType,
          voucher.voucherId,
          voucher.companyCode,
          voucher.unitCode,
          voucher.paymentStatus,
          voucher.productType,
          voucher.quantity,
          voucher.generationDate,
          voucher.expireDate,
          voucher.shippingAddress,
          voucher.buildingAddress,
          voucher.reminigAmount,
          voucher.hsnCode,
          voucher.journalType,
          voucher.SGST,
          voucher.CGST,
          voucher.amount,
          voucher.subDealer ? voucher.subDealer.id : null,
          voucher.subDealer ? voucher.subDealer.name : "",
          voucher.upiId,
          voucher.checkNumber,
          voucher.cardNumber,
          voucher.fromAccount?.id || 0,
          voucher.toAccount?.id || 0,
          voucher.product?.id || null,
          voucher.product?.productName || "",
          voucher.estimate?.id || null,
          voucher.invoiceId,
          voucher.staffId?.name || "",
          voucher.estimate?.receiptPdfUrl ? voucher.estimate.receiptPdfUrl : "",
          voucher?.dueDate ? voucher.dueDate : null,
          voucher.createdAt,
          voucher?.productDetails ? voucher.productDetails : [],
        );
      });
    } else {
      const voucher = entity;
      return [
        new VoucherResDto(
          voucher.id,
          voucher.name,
          voucher.branchId?.id || 0,
          voucher.branchId?.branchName || "Unknown",
          voucher.supplierLocation,
          voucher.purpose,
          voucher.creditAmount,
          voucher.paymentType,
          voucher.clientId?.clientId || "",
          voucher.clientId?.name || "Unknown",
          voucher.ledgerId?.id || 0,
          voucher.ledgerId?.name || "Unknown",
          voucher.staffId?.staffId || "",
          voucher.staffId?.name || "",
          voucher.toAccount?.accountName || "",
          voucher.fromAccount?.accountName || "",
          voucher.voucherType,
          voucher.voucherId,
          voucher.companyCode,
          voucher.unitCode,
          voucher.paymentStatus,
          voucher.productType,
          voucher.quantity,
          voucher.generationDate,
          voucher.expireDate,
          voucher.shippingAddress,
          voucher.buildingAddress,
          voucher.reminigAmount,
          voucher.hsnCode,
          voucher.journalType,
          voucher.SGST,
          voucher.CGST,
          voucher.amount,
          voucher.subDealer ? voucher.subDealer.id : null,
          voucher.subDealer ? voucher.subDealer.name : "",
          voucher.upiId,
          voucher.checkNumber,
          voucher.cardNumber,
          // voucher.initialPayment,
          // voucher.numberOfEmi,
          // voucher.emiNumber,
          // voucher.emiAmount,
          voucher.fromAccount?.id || 0,
          voucher.toAccount?.id || 0,
          voucher.product?.id || null,
          voucher.product?.productName || "",
          voucher.estimate?.id || null,
          voucher.estimate?.invoiceId,
          voucher.staffId?.name || "",
          voucher.estimate?.receiptPdfUrl ? voucher.estimate.receiptPdfUrl : "",
          voucher?.dueDate ? voucher.dueDate : null,
          voucher?.createdAt ? voucher.createdAt : null,
          voucher?.productDetails ? voucher.productDetails : [],
        )
      ];
    }
  }





}