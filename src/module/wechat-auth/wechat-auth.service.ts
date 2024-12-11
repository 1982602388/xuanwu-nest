import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WechatAuthService {
  private readonly appId = 'wx086c3cf87a4b1575'; // 替换为您的微信AppID
  private readonly appSecret = '2ea1ed933aa7da1307ab47632d2e1459'; // 替换为您的微信AppSecret

  async getAccessToken(code: string) {
    try {
      const response = await axios.get(
        'https://api.weixin.qq.com/sns/oauth2/access_token',
        {
          params: {
            appid: this.appId,
            secret: this.appSecret,
            code,
            grant_type: 'authorization_code',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        '获取微信access_token失败',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserInfo(accessToken: string, openId: string) {
    try {
      const response = await axios.get(
        'https://api.weixin.qq.com/sns/userinfo',
        {
          params: {
            access_token: accessToken,
            openid: openId,
            lang: 'zh_CN',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log('error', error);
      throw new HttpException('获取用户信息失败', HttpStatus.BAD_REQUEST);
    }
  }
}
