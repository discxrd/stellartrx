import { createEvent, createStore } from "effector";
import { interval } from "patronum";

export const boostTimerStart = createEvent();
export const boostTimerStop = createEvent();

const { tick } = interval({
  timeout: 1000,
  start: boostTimerStart,
  stop: boostTimerStop,
});

interface IBoostTimer {
  time: number;
  started: boolean;
  ended: boolean;
}

export const $boostTimerStore = createStore<IBoostTimer>({
  time: 0,
  started: false,
  ended: false,
})
  .on(tick, (state) => ({
    time: state.time > 0 ? state.time - 1 : 0,
    ended: state.time === 0,
    started: state.started,
  }))
  .on(boostTimerStart, () => ({
    time: 60 * 30,
    started: true,
    ended: false,
  }));

$boostTimerStore.watch((boostTimer) => {
  if (boostTimer.ended) {
    boostTimerStop();
  }
});
