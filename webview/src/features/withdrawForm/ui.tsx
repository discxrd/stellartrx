import clsx from "clsx";
import { useUnit } from "effector-react";
import { $userStore } from "entities/user";
import { withdrawQuery } from "entities/withdraw/api";
import { useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { Popup } from "shared/ui/popup";
import { numberWithSpaces } from "shared/utils/numberWithSpace";

interface WithdrawFormProps {
  isOpen: boolean;
  onClose: () => void;
  coin: "TRX" | "SHIB";
  setCoin: (coin: "TRX" | "SHIB") => void;
  handleClick: () => void;
}

export const WithdrawForm = ({
  isOpen,
  onClose,
  coin,
  setCoin,
  handleClick,
}: WithdrawFormProps) => {
  const [amountBiggerThanBalance, setAmountBiggerThanBalance] = useState(false);
  const [addressValidated, setAddressValidated] = useState(false);
  const [amountValidated, setAmountValidated] = useState(false);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const user = useUnit($userStore);

  const onAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;

    if (address === "") {
      setAddressValidated(false);
    } else {
      setAddressValidated(true);
    }

    setAddress(e.target.value);
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    e.target.value.replace(/[^0-9.]/g, "");

    if (
      (coin === "TRX" && amount < 20) ||
      (coin === "SHIB" && amount < 300000) ||
      typeof amount !== "number"
    ) {
      setAmountValidated(false);
    } else {
      setAmountValidated(true);
    }

    if (
      (coin === "TRX" && amount > user.trx) ||
      (coin === "SHIB" && amount > user.shib)
    ) {
      setAmountBiggerThanBalance(true);
    } else {
      setAmountBiggerThanBalance(false);
    }

    setAmount(e.target.value);
  };

  const handleWithdraw = () => {
    withdrawQuery.start({
      coin,
      amount: Number(amount),
      address,
    });
    handleClick();
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <p className="ml-4 text-foreground text-opacity-80 text-xl font-bold">
          Amount
        </p>
        <div className="flex">
          <input
            placeholder="Amount"
            max={user.coins}
            value={amount}
            type="number"
            onChange={onAmountChange}
            className="rounded-l-md p-2 px-4 w-full text-opacity-85 bg-[#18181B] text-lg text-foreground focus:outline-none"
          ></input>
          <p className="p-2 px-4 rounded-r-md font-semibold text-foreground text-opacity-85 text-lg bg-[#18181B]">
            {coin}
          </p>
        </div>
        <p
          className={clsx(
            "ml-4 text-error text-opacity-50 text-lg font-extrabold",
            amountValidated && "hidden"
          )}
        >
          Minimum withdraw amount is{" "}
          {coin === "TRX" ? 20 : numberWithSpaces(300000)} {coin}
        </p>
        <p
          className={clsx(
            "ml-4 text-error text-opacity-50 text-lg font-extrabold",
            !amountBiggerThanBalance && "hidden"
          )}
        >
          Amount must be less than your balance
        </p>
        {amountValidated && !amountBiggerThanBalance && (
          <p
            className={clsx(
              "ml-4 text-error text-opacity-50 text-lg font-extrabold",
              user.canWithdraw && "hidden"
            )}
          >
            You must buy at least 10 power to withdraw
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className="ml-4 text-foreground text-opacity-80 text-xl font-bold">
          Wallet address {coin === "SHIB" && "(BEP-20)"}
        </p>
        <input
          placeholder="Address"
          value={address}
          type="text"
          onChange={onAddressChange}
          className="rounded-md p-2 px-4 w-full text-opacity-85 bg-[#18181B] text-lg text-foreground focus:outline-none"
        ></input>
        <p
          className={clsx(
            "ml-4 text-error text-opacity-50 text-lg font-extrabold",
            addressValidated && "hidden"
          )}
        >
          Address cannot be empty
        </p>
      </div>
      <div className="flex">
        <button
          className={clsx(
            coin === "TRX"
              ? "bg-primary text-on-primary"
              : "bg-[#18181B] opacity-80 text-foreground",
            " p-2 w-full rounded-l-xl font-bold text-l"
          )}
          onClick={() => setCoin("TRX")}
        >
          TRX
        </button>
        <button
          className={clsx(
            coin === "SHIB"
              ? "bg-primary  text-on-primary"
              : "bg-[#18181B] opacity-80 text-foreground",
            "text-foreground p-2 w-full rounded-r-xl font-bold text-l"
          )}
          onClick={() => setCoin("SHIB")}
        >
          SHIB
        </button>
      </div>
      <button
        type="button"
        disabled={
          !addressValidated ||
          !amountValidated ||
          amountBiggerThanBalance ||
          !user.canWithdraw
        }
        onClick={handleWithdraw}
        className={clsx(
          "w-full rounded-xl disabled:bg-[#18181B] bg-primary font-bold text-xl py-4 transition-all",
          !addressValidated ||
            !amountValidated ||
            amountBiggerThanBalance ||
            !user.canWithdraw
            ? " text-primary text-opacity-40 font-bold text-xl"
            : "text-on-primary opacity-100 active:opacity-50"
        )}
      >
        Withdraw
      </button>
      <p
        className={clsx(
          "ml-4 text-foreground text-opacity-50 text-lg font-extrabold self-center",
          addressValidated && "hidden"
        )}
      >
        There is 2 TRX comission!
      </p>
    </Popup>
  );
};
