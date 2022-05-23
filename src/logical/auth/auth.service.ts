// src/logical/auth/auth.service.ts
import {HttpException, Injectable} from '@nestjs/common';
import { UsersService } from "../../users/users.service";
import { UsersEntity } from "../../users/users.entity";
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from '../../utils/cryptogram';
import { RedisInstance } from '../../database/redis';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    // JWT验证 - Step 2: 校验用户信息
    async validateUser(username: string, password: string): Promise<UsersEntity> {
        console.log('JWT验证 - Step 2: 校验用户信息');
        const user = await this.usersService.findOne(username);
        console.log('数据库中用户信息', user)
        if (user) {
            const hashedPassword = user.passwd;
            const salt = user.passwd_salt;
            // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
            const hashPassword = encryptPassword(password, salt);
            console.log('输入密码加密：' ,hashPassword)
            if (hashedPassword === hashPassword) {
                // 密码正确
                return user
            } else {
                // 密码错误
                throw new HttpException('密码错误',400)
            }
        }
        // 查无此人
        throw new HttpException('查无此人', 401)
    }

    // JWT验证 - Step 3: 处理 jwt 签证
    async certificate(user: any) {
        const payload = { username: user.account_name, sub: user.user_id, realName: user.real_name, role: user.role };
        console.log('JWT验证 - Step 3: 处理 jwt 签证');
        try {
            const token = this.jwtService.sign(payload);
            // 实例化 redis
            const redis = await RedisInstance.initRedis('auth.certificate', 0);
            // 将用户信息和 token 存入 redis，并设置失效时间，语法：[key, seconds, value]
            await redis.setex(`${user.user_id}-${user.account_name}`, 300, `${token}`);
            console.log(token)
            return {
                code: 200,
                data: {
                    token,
                },
                msg: `登录成功`,
            };
        } catch (error) {
            throw new HttpException('账号或密码错误', 402)
        }
    }
}
