import { createRoutesView } from "atomic-router-react";
import { HomeRoute } from "./home";
import { ReferralsRoute } from "./referrals";
import { TasksRoute } from "./tasks";
import { WalletRoute } from "./wallet";
import { BoostRoute } from "./boost";

export const Pages = createRoutesView({
  routes: [HomeRoute, ReferralsRoute, TasksRoute, WalletRoute, BoostRoute],
});
