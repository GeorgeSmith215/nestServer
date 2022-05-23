import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { getRepository, Repository } from 'typeorm'
import { UsersEntity } from "./users.entity";
import { makeSalt, encryptPassword } from "../utils/cryptogram";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>
    ) {}

    async findOne(accountName: string): Promise<UsersEntity> {
        return await this.usersRepository.findOne({ where: { account_name: accountName } });
    }

    async register(requestBody: any): Promise<UsersEntity> {
        const { accountName, realName, password, repassword, mobile } = requestBody;
        if (password !== repassword) throw new HttpException('两次密码输入不一致', 400)
        const user = await this.findOne(accountName)
        if (user) throw new HttpException('用户已存在', 400)
        const salt = makeSalt()
        const hashPwd = encryptPassword(password, salt)
        return await this.usersRepository.save({
            account_name: accountName,
            real_name: realName,
            passwd: hashPwd,
            passwd_salt: salt,
            mobile
        });
    }
}
