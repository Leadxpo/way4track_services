import { Injectable } from '@nestjs/common';
import { ProductAssignDto } from './dto/product-assign.dto';
import { ProductAssignEntity } from './entity/product-assign.entity';

@Injectable()
export class ProductAssignAdapter {
  convertDtoToEntity(dto: ProductAssignDto): ProductAssignEntity {
    const entity = new ProductAssignEntity();

    entity.id = dto.id;
    entity.staffId = { id: dto.staffId } as any;
    entity.branchId = { id: dto.branchId } as any;
    entity.productId = { id: dto.productId } as any;
    entity.imeiNumberFrom = dto.imeiNumberFrom;
    entity.imeiNumberTo = dto.imeiNumberTo;
    entity.branchOrPerson = dto.branchOrPerson
    entity.productAssignPhoto = dto.productAssignPhoto

    entity.companyCode = dto.companyCode
    entity.unitCode = dto.unitCode
    if (dto.imeiNumberFrom && dto.imeiNumberTo) {
      entity.numberOfProducts = this.calculateNumberOfProducts(dto.imeiNumberFrom, dto.imeiNumberTo);
    } else {
      entity.numberOfProducts = 0;
    }

    return entity;
  }

  private calculateNumberOfProducts(imeiFrom: string, imeiTo: string): number {
    const imeiFromNum = parseInt(imeiFrom, 10);
    const imeiToNum = parseInt(imeiTo, 10);

    if (isNaN(imeiFromNum) || isNaN(imeiToNum) || imeiToNum < imeiFromNum) {
      throw new Error('Invalid IMEI range provided');
    }

    return imeiToNum - imeiFromNum + 1;
  }
}
