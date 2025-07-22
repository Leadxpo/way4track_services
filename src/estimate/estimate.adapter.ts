import { Injectable } from '@nestjs/common';
import { ClientEntity } from 'src/client/entity/client.entity';
import { EstimateResDto } from './dto/estimate-res.dto';
import { EstimateDto } from './dto/estimate.dto';
import { EstimateEntity } from './entity/estimate.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';


@Injectable()
export class EstimateAdapter {
    convertDtoToEntity(dto: EstimateDto): EstimateEntity {
        const entity = new EstimateEntity();
        entity.id = dto.id;
        entity.buildingAddress = dto.buildingAddress;
        entity.shippingAddress = dto.shippingAddress;
        entity.taxableState = dto.taxableState;
        entity.supplyState = dto.supplyState;
        entity.estimateDate = dto.estimateDate;
        entity.expireDate = dto.expireDate;
        entity.productOrService = dto.productOrService;
        entity.description = dto.description;
        entity.amount = dto.totalAmount;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.quantity = dto.quantity
        entity.accountId = dto.accountId

        const clientEntity = new ClientEntity();
        clientEntity.clientId = dto.clientId;
        entity.clientId = clientEntity;

        const branchEntity = new BranchEntity();
        branchEntity.id = dto.branchId;
        entity.branchId = branchEntity;

        const vendorEntity = new VendorEntity();
        vendorEntity.id = dto.vendorId;
        entity.vendorId = vendorEntity;

        // entity.hsnCode = dto.hsnCode;
        entity.quantity = dto.quantity;
        entity.prefix = dto.prefix;
        entity.invoicePrefix = dto.invoicePrefix;
        if (dto.isGST) entity.isGST = dto.isGST;
        if (dto.isTDS) entity.isTDS = dto.isTDS;
        if (dto.SCST) entity.SCST = dto.SCST;
        if (dto.CGST) entity.CGST = dto.CGST;
        if (dto.TDS) entity.TDS = dto.TDS;

        entity.estimatePdfUrl = dto.estimatePdfUrl
        entity.invoicePdfUrl = dto.invoicePdfUrl 

        if (!dto.productDetails || dto.productDetails.length === 0) {
            entity.productDetails = [];
        } else {
            entity.productDetails = Array.isArray(dto.productDetails)
                ? dto.productDetails.map((productDetail) => ({
                    type: productDetail.type,
                    productId: productDetail.productId,
                    productName: productDetail.productName,
                    quantity: productDetail.quantity,
                    costPerUnit: productDetail.costPerUnit,
                    totalCost: productDetail.totalCost,
                    hsnCode: productDetail.hsnCode,
                    description: productDetail.description
                }))
                : [];
        }
        return entity;
    }



    convertEntityToResDto(entities: EstimateEntity[]): EstimateResDto[] {
        return entities.map(entity => {
            const accountEntity = entity.branchId && Array.isArray(entity.branchId.accounts)
            ? entity.branchId?.accounts?.find(item => String(item.id) === entity.accountId) || null
            : null;
                const account = accountEntity
                ? {
                    id: accountEntity.id,
                    name: accountEntity.name,
                    accountNumber: accountEntity.accountNumber,
                    ifscCode: accountEntity.ifscCode,
                    bankName: accountEntity.accountName
                  }
                : null;
              
    
            return new EstimateResDto(
                entity.id,
                entity.clientId?.clientId ?? null,
                entity.clientId?.name ?? '',
                entity.clientId?.address ?? '',
                entity.clientId?.email ?? '',
                entity.clientId?.phoneNumber ?? '',
                entity.clientId?.GSTNumber ?? '',
                entity.branchId?.id ?? null,
                entity.branchId?.branchName ?? '',
                entity.branchId?.branchAddress ?? '',
                entity.branchId?.email ?? '',
                entity.branchId?.branchNumber ?? '',
                entity.branchId?.GST ?? '',
                entity.branchId?.CIN ?? '',
                account, // ✅ Plain object or null
                entity.accountId,
                entity.buildingAddress,
                entity.shippingAddress,
                entity.taxableState,
                entity.supplyState,
                entity.estimateDate,
                entity.expireDate,
                entity.productOrService,
                entity.description,
                entity.amount,
                entity.companyCode,
                entity.unitCode,
                entity.productDetails?.map(product => ({
                    type: product.type,
                    productId: product.productId,
                    name: product.productName,
                    quantity: product.quantity,
                    costPerUnit: product.costPerUnit,
                    totalCost: product.totalCost,
                    hsnCode: product.hsnCode,
                    description:product.description
                })) ?? [],
                entity.estimateId,
                entity.invoiceId,
                entity.prefix,
                entity.invoicePrefix,
                entity.isGST,
                entity.isTDS,
                entity.SCST,
                entity.CGST,
                entity.TDS,
                entity.vendorId?.id ?? null,
                entity.vendorId?.name ?? null,
                entity.vendorId?.vendorPhoneNumber ?? null,
                entity.estimatePdfUrl,
                entity.invoicePdfUrl
            );
        });
    }
    

}

