import { useUnit } from "effector-react";
import { $userStore } from "entities/user";

export const UserIcon = () => {
  const { name } = useUnit($userStore);
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex text-on-primary w-[6rem] h-[6rem] bg-primary rounded-full m-auto">
        <p className="text-4xl font-bold m-auto">{name[0].toUpperCase()}</p>
      </div>
      <p className="w-fit text-2xl font-extrabold m-auto">{name}</p>
    </div>
  );
};
