import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('commodity')
export class CommodityEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    ccolumn_id: number

    @Column()
    commodity_name: string

    @Column({default: ''})
    commodity_desc: string

    @Column()
    market_price: number

    @Column()
    sale_money: number

    @Column({default: ''})
    c_by: string

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    c_time: Date

    @Column({default: ''})
    u_by: string

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    u_time: Date
}
