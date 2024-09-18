import { navigationMap } from "shared/routing";
import { Link, useRouter } from "atomic-router-react";
import clsx from "clsx";

export const NavigationBar = () => {
  const { $activeRoutes } = useRouter();
  const currentRoute = $activeRoutes.getState()[0];

  return (
    <div className="flex h-18 bg-container py-2 justify-between text-secondary px-5 text-sm font-medium">
      {navigationMap.map((route) => (
        <Link key={route.title} to={route.route}>
          <div
            className={clsx(
              "w-full text-center flex flex-col",
              currentRoute === route.route
                ? "text-primary"
                : "text-foreground text-opacity-60"
            )}
          >
            <div
              className={clsx(
                "flex justify-center px-7 py-2 rounded-full ",
                currentRoute === route.route
                  ? "bg-primary bg-opacity-30"
                  : "opacity-60"
              )}
            >
              {route.icon({
                color: currentRoute === route.route ? "#F9F9F9" : "#ECEDEE",
              })}
            </div>
            {route.title}
          </div>
        </Link>
      ))}
    </div>
  );
};
