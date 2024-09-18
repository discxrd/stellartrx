import { BoostButton } from "entities/boost";
import { CoinCounter } from "features/coinCounter";
import { PowerCounter } from "features/powerAmount";
import { $userStore, UserIcon, syncQuery } from "entities/user";
import { useCallback, useEffect, useState } from "react";
import { Blackhole } from "shared/ui/blackhole";
import { BoostForm } from "features/boostForm";
import { NavigationBar } from "widgets/navigationBar";
import { useUnit } from "effector-react";
import { StartButton } from "features/startButton";

export const Home = () => {
  const { name, started } = useUnit($userStore);

  const [formOpen, setFormOpen] = useState(false);

  const openForm = useCallback(() => {
    setFormOpen(true);
  }, [setFormOpen]);

  const closeForm = useCallback(() => {
    setFormOpen(false);
  }, [setFormOpen]);

  return (
    <div className="h-screen text-foreground flex justify-between flex-col tracking-wide">
      <div className="flex flex-col h-full mt-8 mb-2 mx-4 justify-between">
        <UserIcon name={name} />
        <Blackhole />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col m-auto gap-2">
            <CoinCounter />
            <PowerCounter />
          </div>
          <div className="flex gap-2">
            {started ? (
              <>
                <BoostButton onClick={openForm} />
              </>
            ) : (
              <StartButton />
            )}
          </div>
        </div>
      </div>
      <BoostForm isOpen={formOpen} onClose={closeForm} />
      <NavigationBar />
    </div>
  );
};
