import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn({ type: 'smallint' })
    user_id: number

    @Column({ type: "varchar", length: 24 })
    account_name: string

    @Column({ type: "varchar", length: 20 })
    real_name: string

    @Column({ type: "char", length: 32 })
    passwd: string

    @Column({ type: "char", length: 6 })
    passwd_salt: string

    @Column({ type: "varchar", length: 15, default: '' })
    mobile: string

    @Column({ type: "tinyint", default: 3 })
    role: number

    @Column({ type: "tinyint" , default: 0})
    user_status: number

    @Column({ type:"smallint", default: 0 })
    create_by: string

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    create_time: Date

    @Column({ default: 0 })
    update_by: number

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    update_time: Date
}
