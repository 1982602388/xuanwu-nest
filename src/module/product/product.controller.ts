import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: '创建新产品' })
  @ApiResponse({ status: 201, description: '成功创建产品', type: Product })
  @ApiParam({
    name: 'id',
    required: true,
    description: '产品的唯一标识符',
    schema: { type: 'string' },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
          if (!allowedMimes.includes(file.mimetype)) {
            return callback(new Error('Invalid file type'), null);
          }
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createProductDto.imageUrl = `uploads/${file.filename}`;
    }
    return await this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有产品' })
  @ApiResponse({
    status: 200,
    description: '成功获取产品列表',
    type: [Product],
  })
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id获取产品' })
  @ApiResponse({
    status: 200,
    description: '成功获取产品列表',
    type: [Product],
  })
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(+id);
  }
}
