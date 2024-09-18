import { createInternalRequestFx } from "shared/api";
import { TokenDto, IUser, AuthDto, TaskDto } from "./types";
import { createMutation, createQuery } from "@farfetched/core";

export const authQuery = createMutation({
  effect: createInternalRequestFx<AuthDto, TokenDto>((body) => ({
    url: "/user/auth",
    method: "post",
    body,
  })),
});

export const syncQuery = createQuery({
  effect: createInternalRequestFx<void, IUser>({
    url: "/user/profile",
  }),
});

export const startQuery = createQuery({
  effect: createInternalRequestFx<void, any>({
    url: "/user/start",
  }),
});

export const completeTaskQuery = createQuery({
  effect: createInternalRequestFx<TaskDto, any>((body) => ({
    url: "user/completeTask",
    method: "post",
    body,
  })),
});
