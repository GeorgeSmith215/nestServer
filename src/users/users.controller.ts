import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from "./users.service";
import { AuthService } from "../logical/auth/auth.service";

@Controller('user')
export class UsersController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    // @Post('find-one')
    // findOne(@Body() body: any) {
    //   return this.usersService.findOne(body.username);
    // }

    // JWT验证 - Step 1: 用户请求登录
    @Post('login')
    async login(@Body() loginParams: any) {
        console.log('JWT验证 - Step 1: 用户请求登录');
        console.log('输入信息', loginParams)
        const authResult = await this.authService.validateUser(loginParams.accountName, loginParams.password);
        if (authResult) {
            return this.authService.certificate(authResult);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('register')
    async register(@Body() body: any) {
        return await this.usersService.register(body);
    }
}
