import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { TaskModule } from 'src/task/task.module';
import { Boost } from 'src/boost/entities/boost.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, Logger],
  imports: [
    TypeOrmModule.forFeature([User, Boost]),
    forwardRef(() => TaskModule),
  ],
  exports: [TypeOrmModule, UserService],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/user/auth')
      .forRoutes(UserController);
  }
}
