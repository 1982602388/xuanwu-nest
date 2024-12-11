import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { WechatLoginDto } from './dto/wechat-login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @Post('wechat')
  async wechatLogin(@Body() loginDto: WechatLoginDto) {
    return this.loginService.wechatLogin(loginDto);
  }
}
