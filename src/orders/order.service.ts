import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CommonResponse } from "src/models/common-response";
import { HiringIdDto } from "src/hiring/dto/hiring-id.dto";
import { OrderRepository } from "./repo/order-repo";
import { CreateOrderDto } from "./dto/order.dto";
import { OrderAdapter } from "./order.adapter";
import { OrderEntity } from "./entity/orders.entity";
import { ErrorResponse } from "src/models/error-response";
import { DeleteDto } from "src/cart/dto/cart.dto";
import { DeviceRepository } from "src/devices/repo/devices.repo";
import { randomUUID } from "crypto";
@Injectable()
export class OrderService {
  constructor(
    private readonly repo: OrderRepository,
    private readonly adapter: OrderAdapter,
    private readonly deviceRepository: DeviceRepository
  ) { }

  async handleCreateOrder(dto: CreateOrderDto): Promise<CommonResponse> {
    console.log("payload :", dto);
    try {
      // Validate input
      if (!dto.orderItems || dto.orderItems.length === 0) {
        return new CommonResponse(false, 400, "Order items are required");
      }
  
      // Create separate order for each item
      const createdOrders = [];
      const batchId = randomUUID();
      for (const item of dto.orderItems) {
        const singleOrderDto = {
          ...dto,
          orderItems: [item], // Only one item per order
          batchId:batchId
        };
  
        const entity = this.adapter.toEntity(singleOrderDto);
        const savedOrder = await this.repo.save(entity);
        createdOrders.push(savedOrder);
      }
  
      return new CommonResponse(true, 201, `${createdOrders.length} order(s) created successfully`, createdOrders);
    } catch (error) {
      console.error("Order creation failed:", error);
      throw new ErrorResponse(500, error.message);
    }
  }
  
  // async deleteOrder(dto: HiringIdDto): Promise<CommonResponse> {
  //     try {
  //         const existing = await this.repo.findOne({ where: { id: dto.id } });
  //         if (!existing) return new CommonResponse(false, 404, 'order not found');
  //         await this.repo.delete({ id: dto.id });
  //         return new CommonResponse(true, 200, 'order deleted');
  //     } catch (error) {
  //         throw new ErrorResponse(500, error.message);
  //     }
  // }

  async deleteOrder(dto: DeleteDto): Promise<CommonResponse> {
    const ids = dto.ids ?? (dto.id ? [dto.id] : []);

    if (!ids.length) {
      throw new BadRequestException("No valid order IDs provided");
    }

    // Find all existing IDs from the database
    const existingOrders = await this.repo.find({
      where: { id: In(ids) },
      select: ["id"], // Only select the ID for efficiency
    });

    const foundIds = existingOrders.map((order) => order.id);
    const notFoundIds = ids.filter((id) => !foundIds.includes(id));

    // Delete only the found IDs
    if (foundIds.length > 0) {
      await this.repo.delete({ id: In(foundIds) });
    }

    // Construct response message
    const deletedCount = foundIds.length;
    const message =
      `${deletedCount} order(s) deleted.` +
      (notFoundIds.length > 0
        ? ` Some order(s) not found: [${notFoundIds.join(", ")}]`
        : "");

    return new CommonResponse(true, 200, message);
  }

  async getOrderList(): Promise<CommonResponse> {
    try {
      const data = await this.repo.find({ relations: ["client", "deliveryAddressId", "buildingAddressId", 'refund'] });

      const enrichedOrders = await Promise.all(
        data.map(async (order) => {
          const dto = { id: order.id, companyCode: order.companyCode, unitCode: order.unitCode };
          const response = await this.getOrderWithProductDetails(dto);
          return response.data;
        })
      );

      return new CommonResponse(true, 200, "Order list with product details fetched", enrichedOrders);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }


  async getOrderById(dto: HiringIdDto): Promise<CommonResponse> {
    try {
      console.log(dto);
     
      const entity = await this.repo.findOne({
        where: { id: dto.id },
        relations: ["client", "deliveryAddressId", "buildingAddressId", "refund",'refund.deviceId'],
      });
      if (!entity) return new CommonResponse(false, 404, "order not found");
      return new CommonResponse(
        true,
        200,
        "order fetched",
        entity
      );
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getOrderWithProductDetails(dto: HiringIdDto): Promise<CommonResponse> {
    const order = await this.repo.findOne({ where: { id: dto.id }, relations: ['client', "deliveryAddressId", "buildingAddressId", "refund",'refund.deviceId'] });
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    console.log(order, "?????");
    const enrichedItems = await Promise.all(
      order.orderItems.map(async (item) => {
        const device = await this.deviceRepository.findOne({
          where: { id: Number(item.deviceId) },
          relations: ["webProduct"],
        });

        return {
          ...item,
          productName: device?.webProductName || null,
          deviceImage: device?.image || null,
        };
      })
    );
    const enrichedOrder = {
      ...order,
      orderItems: enrichedItems,
    };

    return new CommonResponse(
      true,
      200,
      "Order details fetched",
      enrichedOrder
    );
  }
}
