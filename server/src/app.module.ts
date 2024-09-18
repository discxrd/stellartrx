import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { BoostModule } from "./boost/boost.module";
import { WithdrawModule } from "./withdraw/withdraw.module";
import { AdminModule } from "./admin/admin.module";
import { TaskModule } from "./task/task.module";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || "localhost", // prod: db
      port: 3306,
      username: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "root",
      database: process.env.DB_NAME || "stellar",
      autoLoadEntities: true,
      // TODO: DELETE THIS ON PROD!!!!!!!!!!!
      synchronize: true,
    }),
    BoostModule,
    WithdrawModule,
    AdminModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
