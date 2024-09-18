import clsx from "clsx";
import { TWithdraw } from "entities/withdraw";
import moment from "moment";

export const WithdrawCard = ({
  coin,
  amount,
  createdTime,
  status,
}: TWithdraw) => {
  return (
    <div className="flex p-4 bg-container rounded-2xl items-center">
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
      <p
        className={clsx(
          "text-center font-extrabold text-opacity-90 mx-auto",
          status === "success" && "bg-success",
          status === "pending" && "text-foreground",
          status === "failed" && "bg-error text-background"
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </p>
      <div className="flex gap-2 items-center ml-auto">
        <p className="font-semibold">{amount}</p>
        {coin === "TRX" ? (
          <img
            className="w-[1.8rem] h-[1.8rem]"
            src="/TRX.png"
            alt="Tronix icon"
          />
        ) : (
          <img
            className="w-[1.8rem] h-[1.8rem]"
            src="/SHIB.png"
            alt="Shib icon"
          />
        )}
      </div>
    </div>
  );
};
