import { createInternalRequestFx } from "shared/api";
import { TokenDto, IUser, AuthDto } from "./types";
import { createMutation, createQuery } from "@farfetched/core";

export const authQuery = createMutation({
  effect: createInternalRequestFx<AuthDto, TokenDto>((body) => ({
    url: "session/auth",
    method: "post",
    body,
  })),
});

export const syncQuery = createQuery({
  effect: createInternalRequestFx<void, IUser>({
    url: "session/profile",
  }),
});
