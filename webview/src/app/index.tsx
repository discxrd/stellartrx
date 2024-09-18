import {
  WebAppProvider,
  useExpand,
  useInitData,
  useShowPopup,
  type InitDataUnsafe,
} from "@vkruglikov/react-telegram-web-app";
import { RouterProvider } from "atomic-router-react";
import { Pages } from "pages";
import { router } from "shared/routing";
import "./index.css";
import { appStarted } from "shared/config/init";
import { useEffect, useState } from "react";
import { AuthDto, authQuery, sync, syncQuery } from "entities/user";
import { useUnit } from "effector-react";
import { MoonLoader, RingLoader } from "react-spinners";
import { useReferral } from "shared/hooks/useReferral";
import isMobile from "shared/hooks/useIsMobile";
import { Blackhole } from "shared/ui/blackhole";

export const App = () => {
  const showPopUp = useShowPopup();
  const [isExpanded, expand] = useExpand();
  const pending = useUnit(syncQuery.$pending);
  const failed = useUnit(syncQuery.$failed);
  const success = useUnit(syncQuery.$succeeded);
  const [isPhone, setIsPhone] = useState(isMobile());
  const referralId = useReferral();

  const [initDataUnsafe, initData] = useInitData();

  useEffect(() => {
    appStarted();
    expand();
    console.log("Mobile = ", isMobile());
    console.log(navigator.userAgent);

    if (typeof initDataUnsafe?.user?.id !== "number" || !initData) {
      showPopUp({
        title: "Error",
        message: "No initData provided",
      });
    } else {
      const authData: AuthDto = {
        initData: initData,
        referral: referralId ? referralId : undefined,
      };
      authQuery.start(authData);
    }
  }, []);

  return (
    <WebAppProvider options={{ smoothButtonsTransition: true }}>
      <RouterProvider router={router}>
        {!isPhone ? (
          <div className="h-screen text-foreground flex py-14 pb-32 gap-4 flex-col bg-background">
            <p className="mx-auto text-3xl font-bold">Oops!</p>
            <p className="mx-auto text-xl font-semibold opacity-80">
              It would be better on phone!
            </p>
            <Blackhole />
          </div>
        ) : pending ? (
          <div className="h-screen text-foreground flex flex-col bg-background">
            <div className="m-auto">
              <MoonLoader color="#ffffff" />
            </div>
          </div>
        ) : failed ? (
          <div className="h-screen text-foreground flex py-14 pb-32 gap-4 flex-col bg-background">
            <p className="mx-auto text-3xl font-bold">Something went wrong!</p>
            <p className="mx-auto text-xl font-semibold opacity-80">
              Retry or wait a bit
            </p>
            <Blackhole />
          </div>
        ) : (
          success && <Pages />
        )}
      </RouterProvider>
    </WebAppProvider>
  );
};
