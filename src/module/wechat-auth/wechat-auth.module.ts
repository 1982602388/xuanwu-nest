import { Module } from '@nestjs/common';
import { WechatAuthController } from './wechat-auth.controller';
import { WechatAuthService } from './wechat-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
@Module({
  controllers: [WechatAuthController],
  providers: [WechatAuthService],
  exports: [WechatAuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: '2ea1ed933aa7da1307ab47632d2e1459', // 替换为您的密钥
      signOptions: { expiresIn: '2d' }, // 可选：设置token过期时间
    }),
  ],
})
export class WechatAuthModule {}
