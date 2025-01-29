import { Injectable } from "@nestjs/common";
import { VoucherDto } from "./dto/voucher.dto";
import { VoucherEntity } from "./entity/voucher.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";
import { VendorEntity } from "src/vendor/entity/vendor.entity";
import { AccountEntity } from "src/account/entity/account.entity";
import { VoucherResDto } from "./dto/voucher-res.dto";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { ProductEntity } from "src/product/entity/product.entity";
import { EstimateEntity } from "src/estimate/entity/estimate.entity";

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


    const vendor = new VendorEntity();
    vendor.id = dto.vendorId
    entity.vendorId = vendor

    const estimatePayment = new EstimateEntity()
    estimatePayment.invoiceId = dto.invoice
    entity.estimate = estimatePayment
    // Basic fields
    entity.role = dto.role;
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
    entity.GSTORTDS = dto.GSTORTDS;
    entity.SCST = dto.SCST;
    entity.CGST = dto.CGST;
    entity.amount = dto.amount;
    if (dto.creditAmount && dto.amount) {
      entity.remainingAmount = dto.creditAmount - dto.amount;
    } else {
      entity.remainingAmount = dto.remainingAmount;
    }

    // EMI-related fields
    entity.initialPayment = dto.initialPayment;
    entity.numberOfEmi = dto.numberOfEmi;
    entity.emiNumber = dto.emiNumber;
    // entity.emiAmount = dto.emiAmount;

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
          voucher.role,
          voucher.purpose,
          voucher.creditAmount,
          voucher.paymentType,
          voucher.clientId?.clientId || "",
          voucher.clientId?.name || "Unknown",
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
          voucher.vendorId ? voucher.vendorId.id : null,
          voucher.vendorId ? voucher.vendorId.name : "",
          voucher.quantity,
          voucher.generationDate,
          voucher.expireDate,
          voucher.shippingAddress,
          voucher.buildingAddress,
          voucher.remainingAmount,
          voucher.hsnCode,
          voucher.GSTORTDS,
          voucher.SCST,
          voucher.CGST,
          voucher.amount,
          voucher.subDealer ? voucher.subDealer.id : null,
          voucher.subDealer ? voucher.subDealer.name : "",
          voucher.upiId,
          voucher.checkNumber,
          voucher.cardNumber,
          voucher.initialPayment,
          voucher.numberOfEmi,
          voucher.emiNumber,
          // voucher.emiAmount,
          voucher.fromAccount?.accountNumber || "",
          voucher.toAccount?.accountNumber || "",
          voucher.product?.id || null,
          voucher.product?.productName || "",
          voucher.estimate?.id || null,
          voucher.estimate?.invoiceId,
          voucher.staffId?.name || "",
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
          voucher.role,
          voucher.purpose,
          voucher.creditAmount,
          voucher.paymentType,
          voucher.clientId?.clientId || "",
          voucher.clientId?.name || "Unknown",
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
          voucher.vendorId ? voucher.vendorId.id : null,
          voucher.vendorId ? voucher.vendorId.name : "",
          voucher.quantity,
          voucher.generationDate,
          voucher.expireDate,
          voucher.shippingAddress,
          voucher.buildingAddress,
          voucher.remainingAmount,
          voucher.hsnCode,
          voucher.GSTORTDS,
          voucher.SCST,
          voucher.CGST,
          voucher.amount,
          voucher.subDealer ? voucher.subDealer.id : null,
          voucher.subDealer ? voucher.subDealer.name : "",
          voucher.upiId,
          voucher.checkNumber,
          voucher.cardNumber,
          voucher.initialPayment,
          voucher.numberOfEmi,
          voucher.emiNumber,
          // voucher.emiAmount,
          voucher.fromAccount?.accountNumber || "",
          voucher.toAccount?.accountNumber || "",
          voucher.product?.id || null,
          voucher.product?.productName || "",
          voucher.estimate?.id || null,
          voucher.estimate?.invoiceId,
          voucher.staffId?.name || "",
        )
      ];
    }
  }





}
