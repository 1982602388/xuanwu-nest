import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // 1. 验证商品是否存在及库存
    // 2. 计算订单总金额
    // const totalAmount = createOrderDto.items.reduce(
    //   (sum, item) => sum + item.price * item.quantity,
    //   0,
    // );
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Order[]; total: number }> {
    const res = await this.orderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    console.log('res', res);
    const [data, total] = res;
    return { data, total };
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(
    id: number,
    createOrderDto: Partial<CreateOrderDto>,
  ): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, createOrderDto);
    return await this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  async search(query: string): Promise<Order[]> {
    return this.orderRepository
      .createQueryBuilder('order')
      .where(
        'order.customerName LIKE :query OR order.phoneNumber LIKE :query',
        {
          query: `%${query}%`,
        },
      )
      .getMany();
  }
}
