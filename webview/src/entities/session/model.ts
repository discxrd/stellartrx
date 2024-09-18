import { createEvent, createStore, sample } from "effector";
import { authQuery, syncQuery } from "./api/api";
import { tokenService } from "./tokenService";
import { IUser } from "./api";
import { withdrawQuery } from "entities/withdraw/api";

export const sync = createEvent();
export const coinIncrement = createEvent();

export const $userStore = createStore<IUser>({
  coins: 0,
  telegramId: 0,
  shib: 0,
  power: 1,
  name: "testUser",
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
  .on(coinIncrement, (state) => ({
    ...state,
    coins: state.coins + state.power * 0.000005787,
  }));

sample({
  clock: [authQuery.finished.success],
  fn: ({ result }) => tokenService.setToken(result.token),
});

authQuery.finished.success.watch(() => {
  syncQuery.start();
});

withdrawQuery.finished.success.watch(() => {
  syncQuery.start();
});
