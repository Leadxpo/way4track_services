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
import { OrderEntity, OrderStatus } from "./entity/orders.entity";
import { ErrorResponse } from "src/models/error-response";
import { DeleteDto } from "src/cart/dto/cart.dto";
import { DeviceRepository } from "src/devices/repo/devices.repo";
import { randomUUID } from "crypto";
import { ClientEntity } from "src/client/entity/client.entity";
import { orderCancelTemplate } from "src/templates/orderCancelTemplate";
import { orderDeliveredTemplate } from "src/templates/orderDeliveredTemplate";
import { orderMailTemplate } from "src/templates/orderMail";
import { sendMail } from "./utility/sendMail";
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
          totalAmount: item.amount,
          batchId: batchId
        };

        const entity = this.adapter.toEntity(singleOrderDto);
        const savedOrder = await this.repo.save(entity);
        createdOrders.push(savedOrder);
      }
      // Generate HTML using reusable template
      const html = orderMailTemplate({
        order_id: dto.razorpay_order_id,          // Razorpay generated order ID
        name: dto.name,      // Ensure this field exists in CreateOrderDto
        order_summary: dto.orderItems,    // Whatever format you pass (string or list)
        order_total: dto.totalAmount,
        support_email: "support@way4track.com"
      });
      const clientDetails = await ClientEntity.findOne({ where: { id: dto.clientId } })
      // Send email
      const mailResponse = await sendMail({
        to: clientDetails.email || "ark.kumar03@gmail.com",   // send to customer
        subject: "Order Confirmation",
        html
      });

      return new CommonResponse(
        true,
        201,
        `${createdOrders.length} order(s) created successfully`,
        {
          orders: createdOrders,
          mail: mailResponse.data
        }
      );
    } catch (error) {
      console.error("Order creation failed:", error);
      throw new ErrorResponse(500, error.message);
    }
  }

  async UpdateOrder(dto: CreateOrderDto): Promise<CommonResponse> {
    console.log("payload :", dto);

    try {
      // Convert and save order
      const entity = this.adapter.toEntity(dto);
      const savedOrder = await this.repo.save(entity);

      // Fetch client details
      const clientDetails = await ClientEntity.findOne({
        where: { id: dto.clientId }
      });

      if (!clientDetails) {
        return new CommonResponse(false, 404, "Client not found");
      }

      // -------- EMAIL LOGIC BY ORDER STATUS -------- //
      switch (dto.orderStatus) {

        /*---------------------------------------------------------
          1. PENDING
        ---------------------------------------------------------*/
        case OrderStatus.PENDING:
          return new CommonResponse(true, 200, "Order is pending", savedOrder);

        /*---------------------------------------------------------
          2. ORDER SUCCESS
        ---------------------------------------------------------*/
        case OrderStatus.ORDERSUCESS:
          return new CommonResponse(true, 200, "Order success", savedOrder);

        /*---------------------------------------------------------
          3. ABORTED
        ---------------------------------------------------------*/
        case OrderStatus.ABORTED:
          return new CommonResponse(true, 200, "Order aborted", savedOrder);

        /*---------------------------------------------------------
          4. ORDER CANCELLED → SEND CANCEL EMAIL
        ---------------------------------------------------------*/
        case OrderStatus.CANCELED: {
          const cancelHtml = orderCancelTemplate({
            order_id: dto.razorpay_order_id,
            name: dto.name,
            cancellation_reason: dto.description || "The order was cancelled.",
            support_email: "support@way4track.com",
          });

          const cancelMailResponse = await sendMail({
            to: clientDetails.email,
            subject: "Your Order Has Been Cancelled",
            html: cancelHtml
          });

          return new CommonResponse(
            true,
            200,
            "Order cancelled & email sent",
            { mailResponse: cancelMailResponse, order: savedOrder }
          );
        }

        /*---------------------------------------------------------
          5. ORDER RECEIVED (Warehouse)
        ---------------------------------------------------------*/
        case OrderStatus.Received:
          return new CommonResponse(true, 200, "Order received", savedOrder);

        /*---------------------------------------------------------
          6. ORDER DISPATCHED (Shipping)
        ---------------------------------------------------------*/
        case OrderStatus.Dispatched:
          return new CommonResponse(true, 200, "Order dispatched", savedOrder);

        /*---------------------------------------------------------
          7. ORDER DELIVERED → SEND DELIVERY EMAIL
        ---------------------------------------------------------*/
        case OrderStatus.Delivered: {
          const deliveredHtml = orderDeliveredTemplate({
            order_id: dto.razorpay_order_id,
            name: dto.name,
            delivery_address: dto.deliveryAddressId || "Customer address not available",
            delivered_at: dto.delivaryDate || new Date().toLocaleString(),
            support_email: "support@way4track.com",
          });

          const deliveredMailResponse = await sendMail({
            to: clientDetails.email,
            subject: "Your Order Has Been Delivered",
            html: deliveredHtml
          });

          return new CommonResponse(
            true,
            200,
            "Order delivered & email sent",
            { mailResponse: deliveredMailResponse, order: savedOrder }
          );
        }

        /*---------------------------------------------------------
          8. RETURN REQUEST RAISED
        ---------------------------------------------------------*/
        case OrderStatus.request_raised:
          return new CommonResponse(true, 200, "Return request raised", savedOrder);

        /*---------------------------------------------------------
          9. RETURN APPROVED
        ---------------------------------------------------------*/
        case OrderStatus.request_approved:
          return new CommonResponse(true, 200, "Return request approved", savedOrder);

        /*---------------------------------------------------------
          10. RETURN REJECTED
        ---------------------------------------------------------*/
        case OrderStatus.request_reject:
          return new CommonResponse(true, 200, "Return request rejected", savedOrder);

        /*---------------------------------------------------------
          11. RETURN COMPLETED
        ---------------------------------------------------------*/
        case OrderStatus.request_sucess:
          return new CommonResponse(true, 200, "Return request completed", savedOrder);

        // ---------------------------------------------------------
        default:
          return new CommonResponse(false, 400, "Unknown order status");
      }

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
        relations: ["client", "deliveryAddressId", "buildingAddressId", "refund", 'refund.deviceId'],
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
    const order = await this.repo.findOne({ where: { id: dto.id }, relations: ['client', "deliveryAddressId", "buildingAddressId", "refund", 'refund.deviceId'] });
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
