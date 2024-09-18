import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { InitDataDto } from './dto/init-data.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { TaskService } from 'src/task/task.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Get('profile')
  async profile(@Req() req: any) {
    var updatingUser = req.user;

    await this.taskService.checkTelegram(updatingUser);
    await this.taskService.checkInvition(updatingUser);
    await this.taskService.checkBoost(updatingUser);
    // updatingUser = await this.userService.autoClaimBoosts(updatingUser);
    updatingUser = await this.userService.checkGiftPower(updatingUser);
    updatingUser = await this.userService.calcCoins(updatingUser);
    updatingUser = await this.userService.updateLastAccess(updatingUser);
    updatingUser.completed_tasks = await this.userService.findCompletedTasks(
      updatingUser.id,
    );

    // Clear referrals
    updatingUser.referrals = updatingUser.referrals.map(
      (referral: { name: string; trxToInviter: number }) => {
        return { name: referral.name, trxToInviter: referral.trxToInviter };
      },
    );

    // console.log(updatingUser);

    return { ...updatingUser, tasks: await this.taskService.findAll() };
  }

  @Get('claim/:id')
  async claim(@Param('id') id: number) {
    return await this.userService.claimBoost(id);
  }

  @Get('start')
  async start(@Req() req: any) {
    await this.userService.start(req.user);
  }

  @Post('completeTask')
  async completeTask(@Req() req: any, @Body() { taskId }: CompleteTaskDto) {
    await this.taskService.fastComplete(taskId, req.user);
  }

  @Post('auth')
  async authenticate(@Req() req: any, @Body() initData: InitDataDto) {
    const authenticationToken = await this.userService.authenticate(initData);

    if (authenticationToken) {
      return { token: authenticationToken };
    }

    throw new HttpException('Invalid WebAppData', HttpStatus.UNAUTHORIZED);
  }
}
