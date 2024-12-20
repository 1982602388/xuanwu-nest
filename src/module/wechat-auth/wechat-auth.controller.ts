import { Controller, Get, Body, Res, Post } from '@nestjs/common';
import { WechatAuthService } from './wechat-auth.service';
import { Response } from 'express';

@Controller('wechat-auth')
export class WechatAuthController {
  constructor(private readonly wechatAuthService: WechatAuthService) {}

  @Get('wechat-auth')
  async wechatLogin(@Res() res: Response) {
    const redirectUri = encodeURIComponent(
      'http://106.53.173.170:9001/wechat-auth/callback',
    );
    const appId = 'wx086c3cf87a4b1575'; // 替换为您的微信AppID
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;

    return res.redirect(url);
  }

  @Post('callback')
  async wechatCallback(@Body() body: any) {
    // // 检查用户是否已注册，若未注册则创建新用户
    // const user = await this.wechatAuthService.findOrCreateUser(
    //   tokenInfo.openid,
    //   userInfo,
    // );

    // 1. 获取access_token
    const userInfo = await this.wechatAuthService.toLoginByCode(
      body.code,
      // body.userInfo,
      // body.phoneInfo,
    );

    // 2. 获取用户信息
    // const userInfo = await this.wechatAuthService.getUserInfo(
    //   tokenInfo.access_token,
    //   tokenInfo.openid,
    // );

    // 3. 处理用户登录逻辑
    // TODO: 在这里实现您的用户登录逻辑，比如：
    // - 检查用户是否存在
    // - 如果不存在则创建新用户
    // - 生成JWT token
    // - 返回用户信息和token

    return {
      success: true,
      data: {
        userInfo,
        // user,
        // token: tokenInfo, // 如果您使用JWT，在这里返回token
        // token: generatedToken, // 如果您使用JWT，在这里返回token
      },
    };
  }
}
