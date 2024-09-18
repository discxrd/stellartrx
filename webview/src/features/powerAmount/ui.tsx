import { useUnit } from "effector-react";
import { $userStore } from "entities/user";
import { PowerIcon } from "shared/ui/icons";

export const PowerCounter = () => {
  const power = useUnit($userStore).power;

  return (
    <div className="w-fit flex items-center m-auto justify-center gap-2">
      <p className="font-bold text-[1.55rem] text-center">{power}</p>
      <PowerIcon className="w-[1.55rem] mt-1" />
    </div>
  );
};
