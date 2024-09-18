export type TBoost = {
  id: number;
  power: number;
  createdTime: Date;
  txid: string;
  status: "canceled" | "pending" | "failed" | "success";
};

export interface CreateBoostDto {
  power: number;
}

export interface AddressDto {
  address: string;
}

export interface BoostStatusDto {
  status: string;
}

export interface ClaimBoostDto {
  id: number;
}
