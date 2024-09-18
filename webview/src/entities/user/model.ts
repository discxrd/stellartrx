import { createEvent, createStore, sample } from "effector";
import { authQuery, startQuery, syncQuery } from "./api/api";
import { tokenService } from "./tokenService";
import { IUser } from "./api";
import { withdrawQuery } from "entities/withdraw/api";
import { interval } from "patronum";

export const sync = createEvent();
export const start = createEvent();
export const startTimer = createEvent();

const { tick } = interval({
  timeout: 1000,
  start: startTimer,
});

export const $userStore = createStore<IUser>({
  started: false,
  coins: 0,
  trx: 0,
  telegramId: 0,
  trxToInviter: 0,
  shib: 300000,
  isPartner: true,
  trxFromReferrals: 0,
  canWithdraw: false,
  power: 1,
  name: "user",
  withdraws: [],
  boosts: [],
  referrals: [],
  tasks: [],
  completed_tasks: [],
})
  .on(syncQuery.finished.success, (_, { result }: { result: IUser }) => {
    result.coins = Number(result.coins);
    return result;
  })
  .on(tick, (state) => ({
    ...state,
    coins: state.started
      ? state.coins + state.power * 0.000005787
      : state.coins,
  }))
  .on(start, (state) => ({
    ...state,
    started: true,
  }));
const $started = $userStore.map(({ started }) => started);

sample({
  clock: [authQuery.finished.success],
  fn: ({ result }) => tokenService.setToken(result.token),
});

$started.watch((started) => {
  startTimer();
});

start.watch(() => {
  startQuery.start();
  startTimer();
});

authQuery.finished.success.watch(() => {
  syncQuery.start();
});

withdrawQuery.finished.success.watch(() => {
  syncQuery.start();
});

startQuery.finished.success.watch(() => {
  syncQuery.start();
});
