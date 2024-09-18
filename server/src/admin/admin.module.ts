import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boost } from 'src/boost/entities/boost.entity';
import { User } from 'src/user/entities/user.entity';
import { Withdraw } from 'src/withdraw/entities/withdraw.entity';
import { AdminController } from './admin.controller';
import { AdminMiddleware } from 'src/middlewares/admin.middleware';
import { AdminService } from './admin.service';
import { Task } from 'src/task/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Boost, Withdraw, Task])],
  exports: [TypeOrmModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes(AdminController);
  }
}
