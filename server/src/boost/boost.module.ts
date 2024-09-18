import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boost } from './entities/boost.entity';
import { BoostController } from './boost.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { BoostService } from './boost.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boost, User])],
  exports: [TypeOrmModule],
  controllers: [BoostController],
  providers: [BoostService, Logger],
})
export class BoostModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/boost/ipn')
      .forRoutes(BoostController);
  }
}
