import { Injectable } from "@nestjs/common";
import { VoucherDto } from "./dto/voucher.dto";
import { VoucherEntity } from "./entity/voucher.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";
import { VendorEntity } from "src/vendor/entity/vendor.entity";
import { VoucherResDto } from "./dto/voucher-res.dto";

@Injectable()
export class VoucherAdapter {
  entityToDto(entity: VoucherEntity): VoucherResDto {
    return {
      id: entity.id,
      name: entity.name,
      quantity: entity.quantity,
      branchId: entity.branchId?.id || 0,
      branchName: entity.branchId?.branchName || "Unknown",
      role: entity.role,
      purpose: entity.purpose,
      creditAmount: entity.creditAmount,
      paymentType: entity.paymentType,
      client: entity.client && entity.client[0] ? entity.client[0].id : null,
      clientName: entity.client && entity.client[0] ? entity.client[0].name : "Unknown",
      paymentTo: entity.paymentTo,
      debitAmount: entity.debitAmount,
      transferredBy: entity.transferredBy,
      bankFrom: entity.bankFrom,
      bankTo: entity.bankTo,
      voucherType: entity.voucherType,
      generationDate: entity.generationDate,
      expireDate: entity.expireDate,
      shippingAddress: entity.shippingAddress,
      buildingAddress: entity.buildingAddress,
      balanceAmount: entity.balanceAmount,
      total: entity.total,
      hsnCode: entity.hsnCode,
      GST: entity.GST,
      SCST: entity.SCST,
      CGST: entity.CGST,
      amount: entity.amount,
      subDealerId: entity.subDealer && entity.subDealer[0] ? entity.subDealer[0].id : null,
      subDealerName: entity.subDealer && entity.subDealer[0] ? entity.subDealer[0].name : "",
      vendorId: entity.vendor && entity.vendor[0] ? entity.vendor[0].id : null,
      vendorName: entity.vendor && entity.vendor[0] ? entity.vendor[0].name : "Unknown",
      voucherId: entity.voucherId,
      // Adding new fields for completeness
      initialPayment: entity.initialPayment,
      emiCount: entity.numberOfEmi,
      emiNumber: entity.emiNumber,
      emiAmount: entity.emiAmount,
      ifscCode: entity.ifscCode,
      bankAccountNumber: entity.bankAccountNumber,
      ledgerAmount: entity.balanceAmount + entity.GST + entity.SCST + entity.CGST, // Example of calculated ledger amount
    };
  }

  dtoToEntity(dto: VoucherDto, branch: BranchEntity, client?: ClientEntity, subDealer?: SubDealerEntity, vendor?: VendorEntity): VoucherEntity {
    const entity = new VoucherEntity();
    entity.name = dto.name;
    entity.branchId = branch;
    entity.role = dto.role;
    entity.purpose = dto.purpose;
    entity.creditAmount = dto.creditAmount;
    entity.paymentType = dto.paymentType;
    entity.quantity = dto.quantity;
    if (client) {
      entity.client = [client];
    }

    if (subDealer) {
      entity.subDealer = [subDealer];
    }

    if (vendor) {
      entity.vendor = [vendor];
    }

    entity.paymentTo = dto.paymentTo;
    entity.debitAmount = dto.debitAmount;
    entity.transferredBy = dto.transferredBy;
    entity.bankFrom = dto.bankFrom;
    entity.bankTo = dto.bankTo;
    entity.voucherType = dto.voucherType;
    entity.generationDate = dto.generationDate;
    entity.expireDate = dto.expireDate;
    entity.shippingAddress = dto.shippingAddress;
    entity.buildingAddress = dto.buildingAddress;
    entity.balanceAmount = dto.balanceAmount;
    entity.total = dto.total;
    entity.hsnCode = dto.hsnCode;
    entity.GST = dto.GST;
    entity.SCST = dto.SCST;
    entity.CGST = dto.CGST;
    entity.amount = dto.amount;

    // Handle EMI-related fields and other details
    entity.initialPayment = dto.initialPayment;
    entity.numberOfEmi = dto.numberOfEmi;
    entity.emiNumber = dto.emiNumber;
    entity.emiAmount = dto.emiAmount;
    entity.ifscCode = dto.ifscCode;
    entity.bankAccountNumber = dto.bankAccountNumber;

    return entity;
  }
}
