import { createMutation, createQuery } from "@farfetched/core";
import { createInternalRequestFx } from "shared/api";
import {
  AddressDto,
  BoostStatusDto,
  ClaimBoostDto,
  CreateBoostDto,
} from "./types";

export const getAddressQuery = createMutation({
  effect: createInternalRequestFx<CreateBoostDto, AddressDto>((body) => ({
    url: "/boost/address",
    method: "post",
    body,
  })),
});

export const checkBoostStatus = createQuery({
  effect: createInternalRequestFx<AddressDto, BoostStatusDto>((params) => ({
    url: `/boost/check/${params.address}`,
    method: "get",
  })),
});

export const claimBoost = createQuery({
  effect: createInternalRequestFx<ClaimBoostDto, any>((params) => ({
    url: `/user/claim/${params.id}`,
    method: "get",
  })),
});
