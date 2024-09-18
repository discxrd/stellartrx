import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Withdraw } from "./entities/withdraw.entity";
import { User } from "src/user/entities/user.entity";
import { WithdrawController } from "./withdraw.controller";
import { WithdrawService } from "./withdraw.service";
import { AuthMiddleware } from "src/middlewares/auth.middleware";

@Module({
  imports: [TypeOrmModule.forFeature([Withdraw, User])],
  exports: [TypeOrmModule],
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(WithdrawController);
  }
}
