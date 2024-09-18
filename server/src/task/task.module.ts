import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { Logger, Module } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  providers: [TaskService, Logger],
  exports: [TaskService, TypeOrmModule],
})
export class TaskModule {}
