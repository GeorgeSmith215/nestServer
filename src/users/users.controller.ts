import { Controller, Post, Body, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from "../logical/auth/auth.service";
import { UsersService } from "./users.service";
import { ValidationPipe } from '../core/pipe/validation.pipe';
import  { RegisterInfoDTO, LoginDTO } from "./user.dto";
import { ApiTags, ApiBearerAuth, ApiBody } from "@nestjs/swagger";

@ApiBearerAuth() // Swagger 的 JWT 验证
@ApiTags('user')
@Controller('user')
export class UsersController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    // @Post('find-one')
    // findOne(@Body() body: any) {
    //   return this.usersService.findOne(body.username);
    // }

    // JWT验证 - Step 1: 用户请求登录
    @Post('login')
    @ApiBody({
        description: '用户登录',
        type: LoginDTO,
    })
    async login(@Body() loginParams: LoginDTO) {
        console.log('JWT验证 - Step 1: 用户请求登录');
        console.log('输入信息', loginParams)
        const authResult = await this.authService.validateUser(loginParams.username, loginParams.password);
        if (authResult) {
            return this.authService.certificate(authResult);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @Post('register')
    async register(@Body() body: RegisterInfoDTO) { // 指定 DTO类型
        return await this.usersService.register(body);
    }
}
