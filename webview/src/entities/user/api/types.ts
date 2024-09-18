import { TBoost } from "entities/boost";
import { TReferral } from "entities/referral";
import { Task } from "entities/task";
import { TWithdraw } from "entities/withdraw";

export interface TokenDto {
  token: string;
}

export interface AuthDto {
  initData: string;
  referral?: string;
}

export interface TaskDto {
  taskId: number;
}

export interface IUser {
  trxFromReferrals: number;
  trxToInviter: number;
  telegramId: number;
  trx: number;
  isPartner: boolean;
  started: boolean;
  coins: number;
  power: number;
  name: string;
  shib: number;
  canWithdraw: boolean;
  withdraws: TWithdraw[];
  referrals: TReferral[];
  boosts: TBoost[];
  completed_tasks: Task[];
  tasks: Task[];
}
