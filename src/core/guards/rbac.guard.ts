// src/guards/rbac.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException  } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisInstance } from '../../database/redis';

@Injectable()
export class RbacGuard implements CanActivate {
  // role[用户角色]: 0-超级管理员 | 1-管理员 | 2-开发&测试&运营 | 3-普通用户（只能查看）
  constructor(private readonly role: number) {}
  async canActivate(
      context: ExecutionContext,
  ) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 获取请求头里的 token
    const authorization = request['header']('authorization') || void 0;
    if (!authorization) {
      throw new UnauthorizedException('请先进行登录');
    }
    const token = authorization.split(' ')[1]; // authorization: Bearer xxx

    //获取 redis 里缓存的token
    const redis = await RedisInstance.initRedis('TokenGuard.canActivate', 0);
    const key = `${user.userId}-${user.username}`;
    const cache = await redis.get(key);

    if (token !== cache) {
      // 如果 token 不匹配，禁止访问
      throw new UnauthorizedException('您在其他地方已登录或登录状态已过期，请先退出或重新登录');
    }

    if (user.role > this.role) {
      throw new ForbiddenException('对不起，您无权操作');
    }
    return true;
  }
}
