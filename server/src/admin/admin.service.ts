import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boost } from 'src/boost/entities/boost.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { Withdraw } from 'src/withdraw/entities/withdraw.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';

// TODO: Full rework

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Boost)
    private readonly boostRepository: Repository<Boost>,
    @InjectRepository(Withdraw)
    private readonly withdrawRepository: Repository<Withdraw>,
  ) {}

  async getAllWithdraws(
    count: number,
    offset: number,
  ): Promise<Withdraw[] | null> {
    return this.withdrawRepository.find({
      skip: offset,
      take: count,
      relations: ['user'],
    });
  }

  async getAllBoosts(count: number, offset: number): Promise<Boost[] | null> {
    return this.boostRepository.find({
      where: {
        status: 'success',
      },
      skip: offset,
      take: count,
      relations: ['user'],
    });
  }

  async getAllUsers(count: number, offset: number): Promise<User[] | null> {
    return this.userRepository.find({
      skip: offset,
      take: count,
    });
  }

  async getUser(telegramId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { telegramId: telegramId },
      relations: ['referrals', 'boosts', 'withdraws', 'completed_tasks'],
    });
  }

  async getUserByName(name: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { name: name },
      relations: ['referrals', 'boosts', 'withdraws', 'completed_tasks'],
    });
  }

  async getWithdraw(id: number): Promise<Withdraw | null> {
    return this.withdrawRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async getBoost(id: number): Promise<Boost | null> {
    return this.boostRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async deleteUser(telegramId: number): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { telegramId },
    });

    if (!user) {
      return 'Cant find';
    }

    await this.userRepository.delete(user.id);

    return 'Success';
  }

  async cancelWithdraw(id: number): Promise<boolean | string> {
    const withdraws = await this.withdrawRepository.find({
      where: {
        id: id,
      },
    });

    const withdrawToCancel = withdraws[0];

    if (!withdrawToCancel) {
      return 'Cant find';
    }

    if (
      withdrawToCancel.status === 'canceled' ||
      withdrawToCancel.status === 'completed'
    ) {
      return 'Cant change status';
    }

    withdrawToCancel.status = 'canceled';

    await this.withdrawRepository.save(withdrawToCancel);

    return 'Success';
  }

  async cancelAndReturnWithdraw(id: number): Promise<boolean | string> {
    const withdraws = await this.withdrawRepository.find({
      where: {
        id: id,
      },
      relations: ['user'],
    });

    const withdrawToCancel = withdraws[0];

    if (!withdrawToCancel) {
      return 'Cant find';
    }

    if (withdrawToCancel.status === 'canceled') {
      return 'Already canceled';
    }

    const user = withdrawToCancel.user;
    if (withdrawToCancel.coin === 'SHIB') {
      user.shib += withdrawToCancel.amount;
    } else {
      user.trx += withdrawToCancel.amount;
    }

    withdrawToCancel.status = 'canceled';

    await this.withdrawRepository.save(withdrawToCancel);

    return 'Success';
  }

  async confirmWithdraw(id: number): Promise<boolean | string> {
    const withdraws = await this.withdrawRepository.find({
      where: {
        id: id,
      },
    });

    const withdrawToConfirm = withdraws[0];

    if (!withdrawToConfirm) {
      return 'Cant find';
    }

    if (withdrawToConfirm.status === 'completed') {
      return 'Already completed';
    }

    withdrawToConfirm.status = 'completed';

    await this.withdrawRepository.save(withdrawToConfirm);

    return 'Success';
  }

  async getWithdrawsSum(): Promise<object> {
    const trxWithdraws = await this.withdrawRepository.find({
      where: { status: 'completed', coin: 'TRX' },
    });
    const shibWithdraws = await this.withdrawRepository.find({
      where: { status: 'completed', coin: 'SHIB' },
    });
    const trx = trxWithdraws.reduce(
      (sum, withdraw) => sum + withdraw.amount,
      0,
    );
    const shib = shibWithdraws.reduce(
      (sum, withdraw) => sum + withdraw.amount,
      0,
    );

    return { trx, shib };
  }

  async getBoostsSum(): Promise<number> {
    const boosts = await this.boostRepository.find();
    return boosts.reduce(
      (sum, boost) =>
        boost.status != 'pending' ? sum + boost.power * 10 : sum,
      0,
    );
  }

  async getUsersCount(): Promise<number> {
    const [_, count] = await this.userRepository.findAndCount();
    return count;
  }

  async getBoostsCount(): Promise<number> {
    const [_, count] = await this.boostRepository.findAndCount({
      where: { status: 'success' },
    });
    return count;
  }

  async getWithdrawsCount(): Promise<number> {
    const [_, count] = await this.withdrawRepository.findAndCount();
    return count;
  }

  async createTask(taskDto: CreateTaskDto): Promise<string> {
    try {
      const newTask = this.taskRepository.create({
        title: taskDto.type,
        reward: taskDto.reward,
        description: taskDto.description,
        tgId: taskDto.tgId.toString(),
        link: taskDto.link,
        fastComplete: taskDto.fastComplete === 1,
      });

      await this.taskRepository.save(newTask);
    } catch (e) {
      return `Cant create ${e}`;
    }

    return 'Success';
  }

  async getAllTasks(count: number, offset: number): Promise<Task[] | null> {
    return this.taskRepository.find({
      skip: offset,
      take: count,
    });
  }

  async getTask(id: number): Promise<Task | null> {
    return this.taskRepository.findOne({
      where: { id },
    });
  }

  async deleteTask(id: number): Promise<string> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      return 'Cant find';
    }

    await this.taskRepository.delete(task.id);

    return 'Success';
  }

  async getTasksCount(): Promise<number> {
    const [_, count] = await this.taskRepository.findAndCount();
    return count;
  }
}
