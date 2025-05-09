import { CreateOrderDto } from "./dto/order.dto";
import { OrderEntity } from "./entity/orders.entity";

export class OrderAdapter {
  toEntity(dto: CreateOrderDto): OrderEntity {
    const entity = new OrderEntity();
    if (dto.id) entity.id = dto.id;
    entity.name = dto.name;
    entity.totalAmount = dto.totalAmount;
    entity.paymentStatus = dto.paymentStatus;
    entity.orderDate = dto.orderDate;
    entity.delivaryDate = dto.delivaryDate;
    entity.deliveryAddress = dto.deliveryAddress;
    entity.orderStatus = dto.orderStatus;
    entity.companyCode = dto.companyCode;
    entity.unitCode = dto.unitCode;
    entity.orderItems = dto.orderItems;
    entity.client = dto.clientId ? ({ id: dto.clientId } as any) : null;
    return entity;
  }

  toResponse(entity: OrderEntity): CreateOrderDto {
    return {
      id: entity.id,
      name: entity.name,
      totalAmount: entity.totalAmount,
      paymentStatus: entity.paymentStatus,
      orderDate: entity.orderDate,
      deliveryAddress: entity.deliveryAddress,
      orderStatus: entity.orderStatus,
      orderItems: entity.orderItems,
      companyCode: entity.companyCode,
      unitCode: entity.unitCode,
      clientId: entity.client?.id,
      delivaryDate: entity.delivaryDate,
    };
  }
}
