import clsx from "clsx";
import { useRef, useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { PowerIcon } from "shared/ui/icons";
import { routes } from "shared/routing";
import { useUnit } from "effector-react";
import { $boostStatusStore, clearBoost } from "entities/boost";
import { Popup } from "shared/ui/popup";

interface BoostFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BoostForm = ({ isOpen, onClose }: BoostFormProps) => {
  const [validated, setValidated] = useState(false);
  const [cost, setCost] = useState(0);
  const power = useRef("");
  const status = useUnit($boostStatusStore);

  const onPowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    if (amount < 0) return;
    if (amount < 10) {
      setValidated(false);
    } else {
      setValidated(true);
    }

    power.current = e.target.value;

    setCost(
      Number(power.current) * 10 + ((Number(power.current) * 10) / 100) * 4
    );
    clearBoost();
  };

  const onBoostClick = () => {
    if (status) {
      clearBoost();
    }

    routes.private.boost.open({ power: Number(power.current) });
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 w-full">
          <p className="ml-4 text-foreground text-opacity-80 text-xl font-bold">
            Power
          </p>
          <div className="flex">
            <input
              value={power.current}
              onChange={onPowerChange}
              type="number"
              placeholder="Amount"
              className="rounded-l-md p-2 px-4 w-full text-opacity-85 bg-[#18181B] text-lg text-foreground focus:outline-none"
            ></input>
            <div className="bg-[#18181B] rounded-r-md px-[1.2rem] p-2">
              <PowerIcon className="w-[1.35rem]" color="#b6b8b8" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="ml-4 text-foreground text-opacity-80  text-xl font-bold">
            Cost
          </p>
          <div className="flex">
            <p className="rounded-md p-2 px-4 w-full text-opacity-85 bg-[#18181B] text-lg text-foreground focus:outline-none">
              {cost}
            </p>
            <p className="p-2 px-4 rounded-r-md font-semibold text-foreground text-opacity-85 text-lg bg-[#18181B]">
              TRX
            </p>
          </div>
        </div>
      </div>
      <div className={clsx("flex items-center gap-1", validated && "hidden")}>
        <p
          className={clsx(
            "ml-4 text-error text-opacity-50 text-lg font-extrabold"
          )}
        >
          Minimum power amount is 10
        </p>
        <PowerIcon className="w-4 opacity-50" color="#F31260" />
      </div>
      <div className="text-foreground text-opacity-50 text-lg font-medium">
        <p className="font-semibold text-xl mb-1">Total profit:</p>
        <div className="flex w-full justify-between">
          <p>Month: </p>
          <p>
            {(Number(power.current) * 60 * 60 * 24 * 30 * 0.000005787).toFixed(
              2
            )}{" "}
            TRX
          </p>
        </div>
        <div className="flex w-full justify-between">
          <p>Daily: </p>
          <p>
            {(Number(power.current) * 60 * 60 * 24 * 0.000005787).toFixed(2)}{" "}
            TRX
          </p>
        </div>
      </div>
      <button
        disabled={!validated}
        onClick={onBoostClick}
        className={clsx(
          "w-full rounded-xl  py-4 disabled:bg-[#18181B] transition-all flex justify-center text-center",
          !validated ? "bg-[#18181B]" : "bg-primary active:opacity-50"
        )}
      >
        <p
          className={clsx(
            "text-on-primary font-bold text-xl",
            !validated && "text-primary text-opacity-40"
          )}
        >
          Confirm
        </p>
      </button>
    </Popup>
  );
};
