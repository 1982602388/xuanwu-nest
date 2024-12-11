import { Module } from '@nestjs/common';
import { WechatAuthController } from './wechat-auth.controller';
import { WechatAuthService } from './wechat-auth.service';

@Module({
  controllers: [WechatAuthController],
  providers: [WechatAuthService],
  exports: [WechatAuthService],
})
export class WechatAuthModule {}
