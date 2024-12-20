import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './module/login/login.module';
import { OrderModule } from './module/order/order.module';
import { ProductModule } from './module/product/product.module';
// import { Product } from './module/product/entities/product.entity';
import { WechatAuthModule } from './module/wechat-auth/wechat-auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // 或其他数据库类型
      // host: '106.53.173.170',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      // password: 'hw459939',
      // database: 'codercat',
      database: 'xuanwushan',
      autoLoadEntities: true, // 添加所有实体
      // entities: [Product,User], // 添加所有实体
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 开发环境使用，生产环境请设置为 false
      logging: true,
    }),
    LoginModule,
    OrderModule,
    ProductModule,
    WechatAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
