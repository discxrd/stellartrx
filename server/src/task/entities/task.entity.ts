import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title:
    | 'Boost'
    | 'Telegram'
    | 'Twitter'
    | 'Instagram'
    | 'YouTube'
    | 'Invition';

  @Column({ default: 0.0, type: 'float' })
  reward: number;

  @Column()
  description: string;

  @Column({ name: 'tg_id', nullable: true })
  tgId: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false, type: 'bool' })
  fastComplete: boolean;

  @ManyToMany(() => User, (user) => user.completed_tasks)
  completedBy: User[];
}
