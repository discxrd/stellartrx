import { createMutation, createQuery } from "@farfetched/core";
import { createInternalRequestFx } from "shared/api";
import { WithdrawQueryDto } from "./types";

export const withdrawQuery = createMutation({
  effect: createInternalRequestFx<WithdrawQueryDto, any>((body) => ({
    url: "/withdraw",
    method: "post",
    body,
  })),
});

export const cancelWithdrawQuery = createQuery({
  effect: createInternalRequestFx<void, any>({
    url: "/withdraw",
    method: "delete",
  }),
});
