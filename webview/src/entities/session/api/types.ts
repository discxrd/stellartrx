import { InitDataUnsafe } from "@vkruglikov/react-telegram-web-app";
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

export interface IUser {
  telegramId: number;
  coins: number;
  power: number;
  name: string;
  shib: number;
  withdraws: TWithdraw[];
  referrals: TReferral[];
  boosts: TBoost[];
  completed_tasks: Task[];
  tasks: Task[];
}
