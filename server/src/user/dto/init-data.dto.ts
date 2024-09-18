import { IsNotEmpty, IsString } from "class-validator";

export class InitDataDto {
  @IsNotEmpty()
  @IsString()
  initData: string;

  referral?: string;
}
