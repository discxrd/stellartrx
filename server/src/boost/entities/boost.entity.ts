import { User } from "src/user/entities/user.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Boost extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.boosts, { onDelete: "SET NULL" })
  user: User;

  @CreateDateColumn({ name: "created_time" })
  createdTime: Date;

  @Column({ nullable: true })
  power: number;

  @Column()
  address: string;

  @Column()
  status: "pending" | "success";

  @Column({ nullable: true })
  txid: string;
}
