import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWithdrawDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  coin: 'SHIB' | 'TRX';

  @IsNotEmpty()
  @IsString()
  address: string;
}
