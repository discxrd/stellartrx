import { TReferral } from "entities/referral";

export const ReferralCard = ({ name, trxToInviter }: TReferral) => {
  return (
    <div className="flex p-4 justify-between bg-container rounded-2xl">
      <div className="flex gap-4">
        <div className="flex w-[2.5rem] h-[2.5rem] bg-primary rounded-full my-auto">
          <p className="text-xl text-on-primary font-bold m-auto">
            {name.charAt(0).toUpperCase()}
          </p>
        </div>
        <p className="text-xl font-bold my-auto">{name}</p>
      </div>
      <div className="flex gap-2">
        <p className="text-lg my-auto">8 000</p>
        <img
          className="w-[1.5rem] h-[1.5rem] my-auto"
          src="/SHIB.png"
          alt="SHIB icon"
        />
      </div>
      <div className="flex gap-2">
        <p className="text-lg my-auto">+{trxToInviter} TRX</p>
      </div>
    </div>
  );
};
