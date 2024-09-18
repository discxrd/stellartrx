import { IsNotEmpty, IsNumber } from 'class-validator';

export class CompleteTaskDto {
  @IsNotEmpty()
  @IsNumber()
  taskId: number;
}
