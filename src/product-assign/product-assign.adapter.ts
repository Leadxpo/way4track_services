import { Injectable } from '@nestjs/common';
import { ProductAssignDto } from './dto/product-assign.dto';
import { ProductAssignEntity } from './entity/product-assign.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';

@Injectable()
export class ProductAssignAdapter {


  convertDtoToEntity(dto: ProductAssignDto): ProductAssignEntity {
    const entity = new ProductAssignEntity();

    entity.id = dto.id;

    // Handle staff
    if (dto.staffId) {
      const staff = new StaffEntity();
      staff.id = dto.staffId;
      entity.staffId = staff;
    }

    // Handle branch
    if (dto.branchId) {
      const branch = new BranchEntity();
      branch.id = dto.branchId;
      entity.branchId = branch;
    }

    if (dto.requestId) {
      const request = new RequestRaiseEntity();
      request.id = dto.requestId;
      entity.requestId = request;
    }

    // Handle product
    if (dto.productId) {
      const product = new ProductEntity();
      product.id = dto.productId;
      entity.productId = product;
    }

    entity.imeiNumberFrom = dto.imeiNumberFrom || null;
    entity.imeiNumberTo = dto.imeiNumberTo || null;
    entity.branchOrPerson = dto.branchOrPerson || null;
    entity.productAssignPhoto = dto.productAssignPhoto || null;
    entity.isAssign = dto.isAssign
    // entity.assignedQty = dto.assignedQty
    entity.inHands = dto.inHands
    entity.assignTime = dto.assignTime
    entity.assignTo = dto.assignTo




    entity.companyCode = dto.companyCode;
    entity.unitCode = dto.unitCode;

    if (dto.imeiNumberFrom && dto.imeiNumberTo) {
      entity.numberOfProducts = this.calculateNumberOfProducts(dto.imeiNumberFrom, dto.imeiNumberTo);
    } else {
      entity.numberOfProducts = 0;
    }

    return entity;
  }


  calculateNumberOfProducts(imeiFrom: string, imeiTo: string): number {
    const from = parseInt(imeiFrom, 10);
    const to = parseInt(imeiTo, 10);

    if (isNaN(from) || isNaN(to)) {
      console.error(`Invalid IMEI range: imeiFrom=${imeiFrom}, imeiTo=${imeiTo}`);
      return 0;
    }

    return to - from + 1; // Adjust logic based on your business rule
  }

}
