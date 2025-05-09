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
@Injectable()
export class OrderService {
  constructor(
    private readonly repo: OrderRepository,
    private readonly adapter: OrderAdapter
  ) {}

  async handleCreateOrder(dto: CreateOrderDto): Promise<CommonResponse> {
    try {
      let entity: OrderEntity;
      if (dto.id) {
        entity = await this.repo.findOne({ where: { id: dto.id } });
        if (!entity) return new CommonResponse(false, 404, "order not found");
        Object.assign(entity, this.adapter.toEntity(dto));
        await this.repo.save(entity);
        return new CommonResponse(true, 200, "order updated");
      } else {
        entity = this.adapter.toEntity(dto);
        await this.repo.save(entity);
        return new CommonResponse(true, 201, "order created");
      }
    } catch (error) {
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
      const data = await this.repo.find({ relations: ["client"] });
      console.log(data, "{{{{{{{{{");
      return new CommonResponse(true, 200, "order list fetched", data);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getOrderById(dto: HiringIdDto): Promise<CommonResponse> {
    try {
      console.log(dto);
      if (!dto.id) {
        return new CommonResponse(false, 400, "Client ID is required");
      }
      const entity = await this.repo.findOne({
        where: { id: dto.id },
        relations: ["client"],
      });
      if (!entity) return new CommonResponse(false, 404, "order not found");
      return new CommonResponse(
        true,
        200,
        "order fetched",
        this.adapter.toResponse(entity)
      );
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }
}
