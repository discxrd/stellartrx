import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boost } from './entities/boost.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import Coinpayments from 'coinpayments';
import { sendBoostNotification } from 'src/utils/telegram';

@Injectable()
export class BoostService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Boost)
    private readonly boostRepository: Repository<Boost>,
    private readonly logger: Logger,
  ) {}

  private readonly payments = new Coinpayments({
    key:
      process.env.COINPAYMENTS_PUBLIC_KEY ||
      '630dc10dcc72c4dadda9a3dbcf47abae47e852e9c26f1daa378d790f802bbbe3',
    secret:
      process.env.COINPAYMENTS_PRIVATE_KEY ||
      '92501aAfd5Da21c46811233D44CbE2c7bfbAc43243A8E4Fa91318FB71b40cE14',
  });

  async findOne(where: Object): Promise<Boost | null> {
    return await this.boostRepository.findOne({ where });
  }

  async deleteBoostByAddress(address: string): Promise<boolean> {
    const boost = await this.boostRepository.findOne({
      where: { address },
    });

    if (!boost) {
      return false;
    }

    await boost.remove();

    return true;
  }

  async createBoost(
    user: User,
    power: number,
    address: string,
  ): Promise<Boost> {
    const boost = new Boost();

    boost.user = user;
    boost.power = power;
    boost.address = address;
    boost.status = 'pending';

    await boost.save();

    return boost;
  }

  async confirmBoostByAddress(address: string, txid: string): Promise<Boost> {
    const boosts = await this.boostRepository.find({
      where: {
        address,
        status: 'pending',
      },
      relations: ['user'],
    });
    const boost = boosts[0];

    console.log(boost);

    const user = await this.userRepository.findOne({
      where: { id: boost.user.id },
      relations: ['referredBy'],
    });

    boost.status = 'success';
    boost.txid = txid;

    user.power += boost.power;
    user.canWithdraw = true;

    await boost.save();

    await sendBoostNotification(boost.power, txid, user);

    const parentUser = user.referredBy;

    if (parentUser) {
      const collected = parentUser.isPartner
        ? boost.power
        : ((boost.power * 10) / 100) * 5;

      parentUser.trx += collected;
      parentUser.trxFromReferrals += collected;
      user.trxToInviter += collected;

      await parentUser.save();
    }

    await user.save();

    return boost;
  }

  async getBoostStatusByAddress(address: string): Promise<string> {
    const boosts = await this.boostRepository.find({
      where: { address },
    });

    const boost = boosts[0];

    if (!boost) {
      return null;
    }

    return boost.status;
  }

  async getBoostByAddress(address: string): Promise<Boost> {
    const boosts = await this.boostRepository.find({
      where: { address, status: 'pending' },
    });

    return boosts[0];
  }

  async getWalletAddress(user: User, power: number): Promise<string> {
    user.boosts.filter((b) => {
      if (b.status === 'pending' && b.power == power) return b.address;
    });

    const response = await this.payments.getCallbackAddress({
      currency: 'TRX',
      ipn_url: 'https://stellartrx.com/api/boost/ipn',
    });

    const boost_cost = power * 10;
    const boost_fee = (boost_cost / 100) * 0.5;
    const boost_total_cost = boost_cost + boost_fee;

    console.log(
      `User ${JSON.stringify(
        user,
      )} requested wallet address for ${power} TRX: ${
        response.address
      } cost: ${boost_total_cost}`,
    );

    await this.createBoost(user, power, response.address);

    return response.address;
  }
}
