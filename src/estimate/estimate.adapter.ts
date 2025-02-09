import { Injectable } from '@nestjs/common';
import { ClientEntity } from 'src/client/entity/client.entity';
import { EstimateResDto } from './dto/estimate-res.dto';
import { EstimateDto } from './dto/estimate.dto';
import { EstimateEntity } from './entity/estimate.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';

@Injectable()
@Injectable()
@Injectable()
export class EstimateAdapter {
    convertDtoToEntity(dto: EstimateDto): EstimateEntity {
        const entity = new EstimateEntity();
        entity.id = dto.id;
        entity.buildingAddress = dto.buildingAddress;
        entity.estimateDate = dto.estimateDate;
        entity.expireDate = dto.expireDate;
        entity.productOrService = dto.productOrService;
        entity.description = dto.description;
        entity.amount = dto.totalAmount;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;

        const clientEntity = new ClientEntity();
        clientEntity.clientId = dto.clientId;
        entity.clientId = clientEntity;
        entity.quantity = dto.quantity

        const vendorEntity = new VendorEntity();
        vendorEntity.id = dto.vendorId;
        entity.vendorId = vendorEntity;

        entity.quantity = dto.quantity;
        if (dto.GSTORTDS) entity.GSTORTDS = dto.GSTORTDS;
        if (dto.SCST) entity.SCST = dto.SCST;
        if (dto.CGST) entity.CGST = dto.CGST;
        // entity.hsnCode = dto.hsnCode;

        entity.estimatePdfUrl = dto.estimatePdfUrl
        entity.invoicePdfUrl = dto.invoicePdfUrl

        if (!dto.productDetails || dto.productDetails.length === 0) {
            entity.productDetails = [];
        } else {
            entity.productDetails = dto.productDetails.map((productDetail) => {
                const totalCost = productDetail.quantity * (productDetail.costPerUnit || 0);
                return {
                    productId: productDetail.productId,
                    productName: productDetail.productName,
                    quantity: productDetail.quantity,
                    costPerUnit: productDetail.costPerUnit,
                    totalCost: totalCost || 0,
                    hsnCode: productDetail.hsnCode
                };
            });
        }


        return entity;
    }

    // convertEntityToResDto(entities: EstimateEntity[]): EstimateResDto[] {
    //     return entities.map(entity => new EstimateResDto(
    //         entity.id,
    //         entity.clientId.clientId||'',
    //         entity.clientId.name||'',
    //         entity.clientId.address,
    //         entity.clientId.email,
    //         entity.clientId.phoneNumber,
    //         entity.buildingAddress,
    //         entity.estimateDate,
    //         entity.expireDate,
    //         entity.productOrService,
    //         entity.description,
    //         entity.amount,
    //         entity.companyCode,
    //         entity.unitCode,
    //         entity.productDetails?.map(product => ({
    //             name: product.productName,
    //             quantity: product.quantity,
    //             amount: product.quantity > 0 ? product.totalCost / product.quantity : 0,
    //             costPerUnit: product.costPerUnit,
    //             totalCost: product.totalCost,
    //             hsnCode: product.hsnCode
    //         })),
    //         entity.estimateId,
    //         entity.invoiceId,
    //         entity.GSTORTDS,
    //         entity.SCST,
    //         entity.CGST,
    //         entity.hsnCode,
    //         entity.vendorId.id,
    //         entity.vendorId.name,
    //         entity.vendorId.vendorPhoneNumber
    //     ));
    // }

    convertEntityToResDto(entities: EstimateEntity[]): EstimateResDto[] {
        return entities.map(entity => new EstimateResDto(
            entity.id,
            entity.clientId ? entity.clientId.clientId : null,  // ✅ Null check added
            entity.clientId ? entity.clientId.name : '',  // ✅ Null check added
            entity.clientId ? entity.clientId.address : '',
            entity.clientId ? entity.clientId.email : '',
            entity.clientId ? entity.clientId.phoneNumber : '',
            entity.buildingAddress,
            entity.estimateDate,
            entity.expireDate,
            entity.productOrService,
            entity.description,
            entity.amount,
            entity.companyCode,
            entity.unitCode,
            entity.productDetails?.map(product => ({
                name: product.productName,
                quantity: product.quantity,
                amount: product.quantity > 0 ? product.totalCost / product.quantity : 0,
                costPerUnit: product.costPerUnit,
                totalCost: product.totalCost,
                hsnCode: product.hsnCode
            })) ?? [],  // ✅ Default empty array
            entity.estimateId,
            entity.invoiceId,
            entity.GSTORTDS,
            entity.SCST,
            entity.CGST,
            // entity.hsnCode,
            entity.vendorId ? entity.vendorId.id : null,  // ✅ Null check added
            entity.vendorId ? entity.vendorId.name : null,  // ✅ Null check added
            entity.vendorId ? entity.vendorId.vendorPhoneNumber : null,
            entity.estimatePdfUrl,
            entity.invoicePdfUrl // ✅ Null check added
        ));
    }


}

