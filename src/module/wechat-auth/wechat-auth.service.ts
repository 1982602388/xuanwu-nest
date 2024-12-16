import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
@Injectable()
export class WechatAuthService {
  private readonly appId = 'wx086c3cf87a4b1575'; // 替换为您的微信AppID
  private readonly appSecret = '2ea1ed933aa7da1307ab47632d2e1459'; // 替换为您的微信AppSecret
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findOrCreateUser(openid: string, userInfo: any, phone: string) {
    let user = await this.userRepository.findOne({ where: { openid } });

    if (!user) {
      user = this.userRepository.create({
        openid,
        nickname: userInfo.nickname,
        avatarUrl: userInfo.headimgurl,
        phone,
        // 其他用户信息字段
      });
      await this.userRepository.save(user);
    }
    return user;
  }
  async toLoginByCode(code: string) {
    // async toLoginByCode(code: string, userInfo?: any, phone?: string) {
    try {
      const response = await axios.get(
        'https://api.weixin.qq.com/sns/jscode2session',
        {
          params: {
            appid: this.appId,
            secret: this.appSecret,
            js_code: code,
            grant_type: 'authorization_code',
          },
        },
      );
      const { openid, session_key, errcode } = response.data;
      // const decryptedData = await this.decryptData(
      //   phoneInfo.encryptedData,
      //   phoneInfo.iv,
      //   session_key,
      // );
      // const userinfo = await this.getUserInfo(openid);
      // console.log('decryptedData', decryptedData);
      // const user = await this.findOrCreateUser(openid, userInfo, phone);

      // console.log('session_key', session_key);
      // 如果微信服务端抛出错误，则将错误直接返回给前端
      if (errcode) {
        // https://betheme.net/news/txtlist_i90049v.html?action=onClick
        throw new HttpException(
          { ...response },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        const token = this.jwtService.sign({ openid, session_key });
        // 根据session_key和openid 组合成一个用户登录唯一标识token 并维护其生命周期（比如会话变更  就需要重新让其登录）
        // 之后的小程序端的每一个请求都需要携带此token 让我鉴权

        return {
          // user,
          token,
        };
      }
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        '获取微信access_token失败',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserInfo(openId: string) {
    try {
      const res = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
        params: {
          grant_type: 'client_credential',
          appid: this.appId,
          secret: this.appSecret,
        },
      });
      console.log('res', res.data, openId);
      const response = await axios.get(
        'https://api.weixin.qq.com/sns/userinfo',
        {
          params: {
            access_token: res.data.access_token,
            openid: openId,
            lang: 'zh_CN',
          },
        },
      );
      // console.log('response', response.data);
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw new HttpException('获取用户信息失败', HttpStatus.BAD_REQUEST);
    }
  }

  decryptData(encryptedData: string, iv: string, sessionKey: string): any {
    const decodedSessionKey = Buffer.from(sessionKey, 'base64');
    const decodedIv = Buffer.from(iv, 'base64');
    const decodedEncryptedData = Buffer.from(encryptedData, 'base64');

    const decipher = crypto.createDecipheriv(
      'aes-128-cbc',
      decodedSessionKey,
      decodedIv,
    );
    decipher.setAutoPadding(true);
    let decoded = decipher.update(decodedEncryptedData).toString('utf8');
    decoded += decipher.final('utf8');

    return JSON.parse(decoded);
  }
}
