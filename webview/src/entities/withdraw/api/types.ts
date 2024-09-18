export type TWithdraw = {
  coin: "SHIB" | "TRX";
  address: string;
  amount: number;
  status: "canceled" | "pending" | "failed" | "success";
  createdTime: Date;
};

export interface WithdrawQueryDto {
  coin: "SHIB" | "TRX";
  address: string;
  amount: number;
}
