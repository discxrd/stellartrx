import { parseInitData } from '@telegram-apps/sdk';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Boost } from 'src/boost/entities/boost.entity';
import { InitDataDto } from './dto/init-data.dto';
import { validate } from '@telegram-apps/init-data-node';
import { Task } from 'src/task/entities/task.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Boost)
    private readonly boostRepository: Repository<Boost>,
    private readonly logger: Logger,
  ) {}

  async findOne(where: Object): Promise<User | null> {
    return await this.userRepository.findOne({ where, cache: true });
  }

  async findCompletedTasks(userId: number): Promise<Task[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['completed_tasks'],
    });

    return user.completed_tasks;
  }

  async addReferral(referralId: number): Promise<void> {
    const user = await this.findOne({ telegramId: referralId });

    if (!user) {
      return;
    }

    user.shib += 5000;

    await this.userRepository.save(user);
  }

  async claimBoost(boostId: number): Promise<string> {
    const boost = await this.boostRepository.findOne({
      where: { id: boostId },
      relations: ['user'],
    });

    if (!boost) {
      return 'Boost not found';
    }
    const isBoostElapsed =
      Date.now() - boost.createdTime.getTime() > 30 * 24 * 60 * 60 * 1000;

    if (!isBoostElapsed) {
      return 'Boost not expired';
    }

    const user = boost.user;

    user.trx += boost.power * 30 * 24 * 60 * 60 * 0.000005787;

    await this.userRepository.save(user);
    await this.boostRepository.remove(boost);

    return 'Boost claimed';
  }

  async checkGiftPower(user: User): Promise<User> {
    if (!user.giftPower) {
      return user;
    }

    const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    const timeDifference = Date.now() - user.createdTime.getTime();

    if (timeDifference > thirtyDaysInMilliseconds) {
      user.giftPower = false;
      user.power--;
      console.log('asdsd');

      await this.userRepository.update(user.id, {
        giftPower: user.giftPower,
        coins: 0,
        power: user.power,
        trx: user.trx + 1 * 0.000005787 * (thirtyDaysInMilliseconds / 1000),
      });

      this.logger.debug(`Removed gift power from user ${user.id}`);
    }

    return user;
  }

  async calcCoins(user: User): Promise<User> {
    if (!user.started) {
      return user;
    }
    user.coins = 0;
    user.power = 0;

    if (user.giftPower) {
      const elapsedTime = (Date.now() - user.createdTime.getTime()) / 1000;
      user.coins = elapsedTime * 0.000005787;
      user.power++;
    }

    for (const boost of user.boosts) {
      if (boost.status === 'success') {
        const updateTime = new Date('2024-08-27T00:00:00');
        const createdTime =
          boost.createdTime.getTime() > updateTime.getTime()
            ? boost.createdTime.getTime()
            : updateTime.getTime();

        const isBoostElapsed =
          Date.now() - createdTime > 30 * 24 * 60 * 60 * 1000;

        if (!isBoostElapsed) {
          const elapsedTime = (Date.now() - createdTime) / 1000;
          user.coins += boost.power * 0.000005787 * elapsedTime;

          user.power += boost.power;
        }
      }
    }

    await this.userRepository.update(user.id, {
      coins: user.coins,
      power: user.power,
    });

    return user;
  }

  async updateLastAccess(user: User): Promise<User> {
    user.lastAccess = new Date();

    await this.userRepository.update(user.id, { lastAccess: user.lastAccess });

    return user;
  }

  async start(user: User): Promise<void> {
    this.logger.debug(`Starting user ${user.id}`);

    user.started = true;

    await this.userRepository.update(user.id, { started: true });
  }

  async authenticate(initDataDto: InitDataDto): Promise<string | null> {
    const botToken = process.env.TELEGRAM_USER_BOT_TOKEN;
    const referralId = initDataDto.referral;
    const userData = parseInitData(initDataDto.initData);

    validate(initDataDto.initData, botToken);

    let user = await this.userRepository.findOne({
      where: { telegramId: userData.user.id },
    });

    if (!user) {
      user = await this.userRepository.create({
        telegramId: userData.user.id,
        name: userData.user.firstName,
        hash: userData.hash,
        lastAccess: new Date(),
        coins: 0,
      });

      if (referralId && Number(referralId) !== userData.user.id) {
        const referredByUser = await this.findOne({
          telegramId: Number(referralId),
        });

        await this.addReferral(Number(referralId));

        user.referredBy = referredByUser;

        this.logger.debug(`User ${user.id} referred by ${referredByUser.id}`);
      }

      await this.userRepository.save(user);
    }

    this.logger.debug(`Authenticating user ${user.id}`);

    return user.hash;
  }
}
