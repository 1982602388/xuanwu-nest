import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // 1. 验证商品是否存在及库存
    // 2. 计算订单总金额
    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // 3. 创建订单
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9), // 临时使用随机ID
      customerName: createOrderDto.customerName,
      phoneNumber: createOrderDto.phoneNumber,
      address: createOrderDto.address,
      totalAmount,
      status: OrderStatus.PENDING,
      items: createOrderDto.items.map((item) => ({
        id: Math.random().toString(36).substr(2, 9),
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        orderId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4. 保存订单到数据库
    // TODO: 实现数据库保存逻辑

    return order;
  }
}
