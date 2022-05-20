import { Module } from '@nestjs/common';
import { CommodityService } from './commodity.service';
import { CommodityController } from './commodity.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CommodityEntity} from "./commodity.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CommodityEntity])],
  providers: [CommodityService],
  controllers: [CommodityController],
  exports: [CommodityService]
})
export class CommodityModule {}
