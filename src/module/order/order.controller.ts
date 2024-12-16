import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Order } from './entities/Order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
  @Get()
  @ApiOperation({ summary: '获取所有产品' })
  @ApiResponse({
    status: 200,
    description: '成功获取产品列表',
    type: [Order],
  })
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id获取产品' })
  @ApiResponse({
    status: 200,
    description: '成功获取产品列表',
    type: [Order],
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '产品的唯一标识符',
    schema: { type: 'string' },
  })
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(+id);
  }
}
