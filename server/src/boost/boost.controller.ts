import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CreateBoostDto } from './dto/create-boost.dto';
import { BoostService } from './boost.service';
import { IPNPaymentDto } from './dto/payment.dto';

@Controller('boost')
export class BoostController {
  constructor(private readonly boostService: BoostService) {}

  @Get('check/:address')
  async check(@Param('address') address: string) {
    const status = await this.boostService.findOne(address);

    if (!status) {
      throw new BadRequestException('Failed to check status');
    }

    return { status };
  }

  @Post('address')
  async address(@Req() request: any, @Body() dto: CreateBoostDto) {
    if (dto.power < 10) {
      throw new BadRequestException('Minimum power is 10');
    }

    const address = await this.boostService.getWalletAddress(
      request.user,
      dto.power,
    );

    return { address };
  }

  @Post('ipn')
  @HttpCode(200)
  async ipn(@Body() payment: IPNPaymentDto) {
    console.log('New IPN: ', payment);

    if (Number(payment.status) !== 100) {
      console.log('IPN is not depoist');
      return;
    }

    if (payment.currency !== 'TRX') {
      console.log('IPN currency is not TRX');
      return;
    }

    const boost = await this.boostService.getBoostByAddress(payment.address);

    if (!boost) {
      console.log('Cant find boost');
      return;
    }

    const boost_cost = boost.power * 10;
    const boost_fee = (boost_cost / 100) * 3.9;
    const boost_total_cost = boost_cost + boost_fee;

    if (payment.amount < boost_total_cost) {
      console.log(
        `Total cost is not correct: ${payment.amount} < ${boost_total_cost}`,
      );
      console.log(`Fee: ${payment.fee} != ${boost_fee}`);
      return;
    }

    console.log('Confirming boost: ', boost);

    await this.boostService.confirmBoostByAddress(
      payment.address,
      payment.txn_id,
    );
  }
}
