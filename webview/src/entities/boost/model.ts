import { createEvent, createStore } from "effector";
import { checkBoostStatus, getAddressQuery } from "./api";
import { boostTimerStop } from "shared/utils/timer";

export const clearBoost = createEvent();

export const $addressStore = createStore<string>("")
  .on(clearBoost, () => "")
  .on(getAddressQuery.finished.success, (_, { result }) => result.address)
  .on(boostTimerStop, () => "");

export const $boostStatusStore = createStore<boolean>(false)
  .on(clearBoost, () => false)
  .on(checkBoostStatus.finished.success, (_, { result }) => {
    return result.status === "success";
  });
