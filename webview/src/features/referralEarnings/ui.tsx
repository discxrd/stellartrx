import { useUnit } from "effector-react";
import { $userStore } from "entities/user";

export const ReferralEarnings = () => {
  const { trxFromReferrals } = useUnit($userStore);
  return (
    <div className="flex px-7 py-4 gap-7 bg-container rounded-xl">
      <img className="w-[3rem] h-[3rem]" src={"people.png"} alt="icon" />
      <p className="m-auto font-semibold text-l">
        {trxFromReferrals.toFixed(6)} TRX
      </p>
      <button
        className="opacity-0 font-semibold text-l px-4 my-2 bg-primary text-on-primary rounded-xl"
        onClick={() => {}}
      >
        Send
      </button>
    </div>
  );
};
