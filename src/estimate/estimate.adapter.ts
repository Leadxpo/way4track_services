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
        entity.estimateDate = dto.estimateDate;
        entity.expireDate = dto.expireDate;
        entity.productOrService = dto.productOrService;
        entity.description = dto.description;
        entity.amount = dto.totalAmount;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.quantity = dto.quantity

        const clientEntity = new ClientEntity();
        clientEntity.clientId = dto.clientId;
        entity.clientId = clientEntity;

        const branchEntity = new BranchEntity();
        branchEntity.id = dto.branchId;
        entity.branchId = branchEntity;

        const vendorEntity = new VendorEntity();
        vendorEntity.id = dto.vendorId;
        entity.vendorId = vendorEntity;

        entity.quantity = dto.quantity;
        // if (dto.GSTORTDS) entity.GSTORTDS = dto.GSTORTDS;
        // entity.hsnCode = dto.hsnCode;
        if (dto.SCST) entity.SCST = dto.SCST;
        if (dto.CGST) entity.CGST = dto.CGST;

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
                    hsnCode: productDetail.hsnCode
                }))
                : [];
        }



        return entity;
    }



    convertEntityToResDto(entities: EstimateEntity[]): EstimateResDto[] {
        return entities.map(entity => new EstimateResDto(
            entity.id,
            entity.clientId ? entity.clientId.clientId : null,  // ✅ Null check added
            entity.clientId ? entity.clientId.name : '',  // ✅ Null check added
            entity.clientId ? entity.clientId.address : '',
            entity.clientId ? entity.clientId.email : '',
            entity.clientId ? entity.clientId.phoneNumber : '',
            entity.branchId ? entity.branchId.id : null,  // ✅ Null check added
            entity.branchId ? entity.branchId.branchName : '',  // ✅ Null check added
            entity.branchId ? entity.branchId.branchAddress : '',
            entity.branchId ? entity.branchId.email : '',
            entity.branchId ? entity.branchId.branchNumber : '',
            entity.buildingAddress,
            entity.shippingAddress,
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
                hsnCode: product.hsnCode
            })) ?? [],  // ✅ Default empty array
            entity.estimateId,
            entity.invoiceId,
            // entity.GSTORTDS,
            // entity.hsnCode,
            entity.SCST,
            entity.CGST,
            entity.vendorId ? entity.vendorId.id : null,  // ✅ Null check added
            entity.vendorId ? entity.vendorId.name : null,  // ✅ Null check added
            entity.vendorId ? entity.vendorId.vendorPhoneNumber : null,
            entity.estimatePdfUrl,
            entity.invoicePdfUrl // ✅ Null check added
        ));
    }


}

