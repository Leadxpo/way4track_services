import { Injectable } from '@nestjs/common';
import { EstimateDto } from './dto/estimate.dto';
import { EstimateResDto } from './dto/estimate-res.dto';
import { EstimateEntity } from './entity/estimate.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { ProductEntity } from 'src/product/entity/product.entity';

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

        entity.quantity = dto.quantity;
        if (dto.GSTORTDS) entity.GSTORTDS = dto.GSTORTDS;
        if (dto.SCST) entity.SCST = dto.SCST;
        if (dto.CGST) entity.CGST = dto.CGST;
        entity.hsnCode = dto.hsnCode;

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
                };
            });
        }


        return entity;
    }

    convertEntityToResDto(entity: EstimateEntity): EstimateResDto {
        const dto = new EstimateResDto(
            entity.id,
            entity.clientId.clientId,
            entity.clientId.name,
            entity.clientId.address,
            entity.clientId.email,
            entity.clientId.phoneNumber,
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
                amount: product.totalCost / product.quantity,
            })),
            entity.estimateId,
            entity.invoiceId,
            entity.GSTORTDS,
            entity.SCST,
            entity.CGST,
            entity.hsnCode
        );
        return dto;
    }
}

