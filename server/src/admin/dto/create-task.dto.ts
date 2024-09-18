import { IsNumber, IsString } from 'class-validator';
export class CreateTaskDto {
  @IsString()
  type: 'Boost' | 'Telegram' | 'Twitter' | 'Instagram' | 'YouTube' | 'Invition';
  @IsNumber()
  reward: number;
  @IsString()
  description: string;
  @IsNumber()
  tgId: number;
  @IsString()
  link: string;
  @IsNumber()
  fastComplete: number;
}
