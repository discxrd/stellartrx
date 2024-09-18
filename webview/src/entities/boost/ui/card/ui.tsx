import clsx from "clsx";
import { TBoost, claimBoost } from "entities/boost";
import { syncQuery } from "entities/user";
import moment from "moment";
import { useEffect, useState } from "react";
import { PowerIcon } from "shared/ui/icons";

export const BoostCard = ({ power, createdTime, txid, id }: TBoost) => {
  const startDate = moment(createdTime);
  const endDate = startDate.add(30, "days");
  const nowDate = moment();

  const canClaim = endDate.isAfter(nowDate);
  const diff = moment.duration(endDate.diff(nowDate));

  const onClick = () => {
    console.log("sex");
    claimBoost.start({ id });
    syncQuery.start();
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-container rounded-2xl items-center">
      <div className="flex w-full">
        <div className="flex gap-2 items-center">
          <img
            className="w-[1.8rem] h-[1.8rem]"
            src="/date.png"
            alt="Date icon"
          />
          <p className="text-foreground text-opacity-80 font-semibold">
            {moment(createdTime).format("DD.MM.YY")}
          </p>
        </div>

        <div className="flex gap-2 items-center ml-auto">
          <p className="font-semibold">{power}</p>
          <PowerIcon className="w-[1.55rem] my-auto" />
        </div>
      </div>

      <div className="flex w-full pl-1 gap-2">
        <p className="text-foreground text-opacity-90 font-semibold">TXID:</p>
        <div className="overflow-hidden overflow-ellipsis text-nowrap">
          <a
            href={`https://tronscan.org/#/transaction/${txid}`}
            className="underline text-foreground text-opacity-90 font-semibold"
          >
            {txid}
          </a>
        </div>
      </div>
      <div className="flex w-full pl-1 gap-2">
        <button
          onClick={onClick}
          // disabled={!canClaim}
          className={clsx(
            "w-full rounded-xl font-bold text-2xl py-2 transition-all",
            !canClaim
              ? "bg-foreground opacity-100 active:opacity-50 text-on-primary"
              : "bg-[#18181B] text-primary text-opacity-40"
          )}
        >
          {canClaim ? `${diff.days()} days ${diff.hours()} hours` : "Claim"}
        </button>
      </div>
    </div>
  );
};
