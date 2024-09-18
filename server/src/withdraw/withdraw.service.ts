import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Withdraw } from "./entities/withdraw.entity";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class WithdrawService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Withdraw)
    private readonly withdrawRepository: Repository<Withdraw>
  ) {}

  async findOne(where: Object): Promise<Withdraw | null> {
    return await this.withdrawRepository.findOne({ where, cache: true });
  }

  async cancelWithdraw(id: number): Promise<void> {
    await this.withdrawRepository.update(id, { status: "canceled" });
  }

  async createWithdraw(
    address: string,
    coin: "SHIB" | "TRX",
    amount: number,
    user: User
  ): Promise<Withdraw | string> {
    const ebaniUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    console.log(ebaniUser);

    const withdraw = new Withdraw();

    withdraw.user = ebaniUser;
    withdraw.address = address;
    withdraw.amount = amount;
    withdraw.coin = coin;
    withdraw.status = "pending";

    console.log(withdraw);

    if (coin === "SHIB") {
      if (ebaniUser.shib < amount || amount < 300000) {
        return "Not enough SHIB";
      }

      ebaniUser.shib -= amount;
    } else {
      if (ebaniUser.trx < amount || amount < 20) {
        return "Not enough TRX";
      }

      ebaniUser.trx -= amount;
    }

    await ebaniUser.save();
    await this.withdrawRepository.save(withdraw);
    console.log(withdraw);

    return withdraw;
  }
}
