import { Injectable } from '@nestjs/common';
import { ProductAssignDto } from './dto/product-assign.dto';
import { ProductAssignEntity } from './entity/product-assign.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ProductEntity } from 'src/product/entity/product.entity';

@Injectable()
export class ProductAssignAdapter {
  convertDtoToEntity(dto: ProductAssignDto): ProductAssignEntity {
    const entity = new ProductAssignEntity();

    entity.id = dto.id;
    const staff = new StaffEntity()
    staff.staffId = dto.staffId
    entity.staffId = staff
    const branch = new BranchEntity()
    branch.id = dto.branchId
    entity.branchId = branch;
    const product = new ProductEntity()
    product.id = dto.productId
    entity.productId = product
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
