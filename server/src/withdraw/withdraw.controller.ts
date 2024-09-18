import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { WithdrawService } from './withdraw.service';
import { sendWithdrawNotfication } from 'src/utils/telegram';
import { Withdraw } from './entities/withdraw.entity';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post()
  async withdraw(@Req() req, @Body() dto: CreateWithdrawDto) {
    const result = await this.withdrawService.createWithdraw(
      dto.address,
      dto.coin,
      dto.amount,
      req.user,
    );

    if (!(result instanceof Withdraw)) {
      throw new BadRequestException(result);
    }

    await sendWithdrawNotfication(
      result.id,
      dto.address,
      dto.coin,
      dto.amount,
      req.user,
    );

    return result;
  }
}
