import { User } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Withdraw {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.withdraws, { onDelete: "SET NULL" })
  user: User;

  @Column()
  address: string;

  @Column()
  amount: number;

  @Column({ default: "pending" })
  status: "pending" | "completed" | "failed" | "canceled";

  @CreateDateColumn({ name: "created_time" })
  createdTime: Date;

  @Column()
  coin: "SHIB" | "TRX";
}
