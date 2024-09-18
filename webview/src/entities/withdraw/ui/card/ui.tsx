import clsx from "clsx";
import { TWithdraw } from "entities/withdraw";
import moment from "moment";
import { useEffect } from "react";

export const WithdrawCard = ({
  coin,
  amount,
  createdTime,
  status,
}: TWithdraw) => {
  return (
    <div className="flex p-4 justify-between bg-container rounded-2xl">
      {coin === "TRX" ? (
        <img
          className="my-auto w-[3rem] h-[3rem]"
          src="/SHIB.png"
          alt="Shib icon"
        />
      ) : (
        <img
          className="my-auto w-[3rem] h-[3rem]"
          src="/TRX.png"
          alt="Tronix icon"
        />
      )}
      <p className="my-auto">{amount}</p>
      <p className="my-auto">{moment(createdTime).format("DD.MM.YY")}</p>
      <p
        className={clsx(
          "my-auto w-20 text-center py-2 rounded-xl text-sm font-extrabold",
          status === "success" && "bg-success",
          status === "pending" && "text-foreground",
          status === "failed" && "bg-error text-background",
          status === "canceled" && "bg-error text-background"
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </p>
    </div>
  );
};
