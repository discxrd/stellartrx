import { createRoute, createHistoryRouter, redirect } from "atomic-router";
import { createEvent, sample } from "effector";
import { syncQuery } from "entities/user";
import { createBrowserHistory } from "history";
import { appStarted } from "shared/config/init";
import { HomeIcon } from "shared/ui/icons";
import { RefsIcon } from "shared/ui/icons";
import { TasksIcon } from "shared/ui/icons";
import { WalletIcon } from "shared/ui/icons";

export const routes = {
  private: {
    home: createRoute<{}>(),
    wallet: createRoute<{}>(),
    referrals: createRoute<{}>(),
    tasks: createRoute<{}>(),
    boost: createRoute<{ power: number }>(),
  },
};

export const navigationMap = [
  {
    title: "Home",
    icon: HomeIcon,
    route: routes.private.home,
    path: "/",
  },
  {
    title: "Wallet",
    icon: WalletIcon,
    route: routes.private.wallet,
    path: "/wallet",
  },
  {
    title: "Refs",
    icon: RefsIcon,
    route: routes.private.referrals,
    path: "/referals",
  },
  {
    title: "Tasks",
    icon: TasksIcon,
    route: routes.private.tasks,
    path: "/tasks",
  },
];

export const routeMap = [
  {
    route: routes.private.home,
    path: "/",
  },
  {
    route: routes.private.wallet,
    path: "/wallet",
  },
  {
    route: routes.private.referrals,
    path: "/referals",
  },
  {
    route: routes.private.tasks,
    path: "/tasks",
  },
  {
    route: routes.private.boost,
    path: "/boost/:power",
  },
];

export const router = createHistoryRouter({
  routes: routeMap,
});

export const goToReferrals = createEvent();
export const goToBoost = createEvent();

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
});

redirect({
  clock: goToReferrals,
  route: routes.private.referrals,
});

redirect({
  clock: goToBoost,
  route: routes.private.home,
});

sample({
  clock: [
    routes.private.referrals.opened,
    routes.private.tasks.opened,
    routes.private.wallet.opened,
    routes.private.home.opened,
  ],
  target: syncQuery.start,
});
