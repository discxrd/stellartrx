import { Boost } from 'src/boost/entities/boost.entity';
import { Task } from 'src/task/entities/task.entity';
import { Withdraw } from 'src/withdraw/entities/withdraw.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  started: boolean;

  @Column({ default: true, name: 'gift_power' })
  giftPower: boolean;

  @Column({ nullable: false, type: 'bigint', name: 'telegram_id' })
  @Index({ unique: true })
  telegramId: number;

  @Column({ nullable: false })
  name: string;

  @Column({
    default: 0,
    type: 'decimal',
    precision: 40,
    scale: 20,
    transformer: new ColumnNumericTransformer(),
  })
  coins: number;

  @Column({ default: 0.0, type: 'float' })
  shib: number;

  @Column({
    default: 0,
    type: 'decimal',
    precision: 40,
    scale: 20,
    transformer: new ColumnNumericTransformer(),
  })
  trx: number;

  @Column({
    default: 0,
    type: 'decimal',
    precision: 40,
    scale: 20,
    transformer: new ColumnNumericTransformer(),
  })
  trxFromReferrals: number;

  @Column({
    default: 0,
    type: 'decimal',
    precision: 40,
    scale: 20,
    transformer: new ColumnNumericTransformer(),
  })
  trxToInviter: number;

  @Column({ default: 1, type: 'int' })
  power: number;

  @Column({ nullable: false })
  hash: string;

  @Column({ default: false, name: 'is_partner' })
  isPartner: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_time', readonly: true })
  createdTime: Date;

  @Column({ type: 'timestamp', name: 'last_access' })
  lastAccess: Date;

  @Column({ name: 'can_withdraw' })
  canWithdraw: boolean;

  @ManyToOne(() => User, (user) => user.referrals, {
    onDelete: 'SET NULL',
  })
  referredBy: User;

  @OneToMany(() => Boost, (boost) => boost.user, {
    onUpdate: 'CASCADE',
    cascade: true,
  })
  boosts: Boost[];

  @OneToMany(() => Withdraw, (withdraw) => withdraw.user, {
    onUpdate: 'CASCADE',
    cascade: true,
  })
  withdraws: Withdraw[];

  @OneToMany(() => User, (user) => user.referredBy)
  referrals: User[];

  @ManyToMany(() => Task, (task) => task.completedBy, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinTable()
  completed_tasks: Task[];
}
