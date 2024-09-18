import clsx from "clsx";
import { useUnit } from "effector-react";
import { $userStore } from "entities/user";

interface UserIconProps {
  name: string;
}

export const UserIcon = ({ name }: UserIconProps) => {
  const { isPartner } = useUnit($userStore);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div
          className={clsx(
            "flex text-on-primary w-[6rem] h-[6rem] bg-primary rounded-full m-auto",
            isPartner
              ? "outline outline-offset-4 outline-3 outline-[#ffcf40]"
              : ""
          )}
        >
          <p className="text-4xl font-bold m-auto">{name[0].toUpperCase()}</p>
        </div>
      </div>
      <div className="flex gap-2 m-auto">
        <p
          className={clsx(
            "w-fit text-2xl font-extrabold",
            isPartner ? "ml-[1.5rem]" : ""
          )}
        >
          {name}
        </p>
        {isPartner && (
          <img
            className="w-[1.5rem] h-[1.5rem] my-auto"
            src="/partner.png"
            alt="SHIB icon"
          />
        )}
      </div>
    </div>
  );
};
