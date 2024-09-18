import { Injectable, Logger } from "@nestjs/common";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { isUserSubscribed } from "src/utils/telegram";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: Logger
  ) {}

  async findAll(): Promise<Task[]> {
    this.logger.debug("Fetching all tasks");
    return await this.taskRepository.find({ cache: true });
  }

  async findOne(where: Object): Promise<Task | null> {
    this.logger.debug(`Fetching task ${JSON.stringify(where)}`);
    return await this.taskRepository.findOne({ where, cache: true });
  }

  async create(
    title: "Boost" | "Telegram" | "Twitter" | "Instagram" | "YouTube",
    reward: number,
    description: string,
    tgId: string,
    link: string,
    fastComplete: boolean
  ): Promise<Task> {
    const task = this.taskRepository.create({
      title,
      reward,
      description,
      tgId,
      link,
      fastComplete,
    });

    this.logger.debug(`Creating task ${task}`);

    await this.taskRepository.insert(task);

    return task;
  }

  async delete(id: number): Promise<void> {
    this.logger.debug(`Deleting task ${id}`);

    await this.taskRepository.delete({ id });
  }

  async complete(task: Task, user: User): Promise<void> {
    this.logger.debug(`Completing task ${task.id} for user ${user.id}`);

    const bugUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ["completed_tasks"],
    });

    if (bugUser.completed_tasks.find((t) => t.id === task.id)) {
      this.logger.error(`User ${user.id} already completed task ${task.id}`);
      return;
    }

    bugUser.completed_tasks.push(task);
    bugUser.shib += task.reward;

    await this.userRepository.save(bugUser);
    // .createQueryBuilder()
    // .relation(User, "completed_tasks")
    // .of(user)
    // .add(task);
  }

  async fastComplete(taskId: number, user: User): Promise<void> {
    const task = await this.findOne({ id: taskId });

    if (!task.fastComplete) {
      this.logger.debug(`Task ${task.id} is not fastComplete`);
      return;
    }

    await this.complete(task, user);
  }

  async checkTelegram(user: User): Promise<void> {
    const tasks = await this.findAll();

    for (const task of tasks) {
      if (user.completed_tasks.find((t) => t.id === task.id)) {
        continue;
      } else if (
        !task.fastComplete &&
        task.tgId &&
        (await isUserSubscribed(user.telegramId.toString(), task.tgId))
      ) {
        await this.complete(task, user);
      }
    }

    // await this.userRepository.save(user);
  }

  async checkInvition(user: User): Promise<void> {
    if (user.completed_tasks.some((task) => task.title === "Invition")) {
      return;
    }

    if (user.referrals.length > 0) {
      const task = await this.findOne({ title: "Invition" });

      await this.complete(task, user);
    }
  }

  async checkBoost(user: User): Promise<void> {
    if (user.completed_tasks.some((task) => task.title === "Boost")) {
      return;
    }

    if (user.boosts.some((boost) => boost.status === "success")) {
      const task = await this.findOne({ title: "Boost" });

      await this.complete(task, user);
    }
  }
}
