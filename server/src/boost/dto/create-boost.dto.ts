import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBoostDto {
  @IsNotEmpty()
  @IsNumber()
  power: number;
}
