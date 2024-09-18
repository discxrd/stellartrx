import clsx from "clsx";
import { useUnit } from "effector-react";
import {
  $addressStore,
  $boostStatusStore,
  checkBoostStatus,
  getAddressQuery,
} from "entities/boost";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { BeatLoader } from "react-spinners";
import { routes } from "shared/routing";
import { CopyIcon, PowerIcon } from "shared/ui/icons";
import { SuccessIcon } from "shared/ui/icons/success";
import { $boostTimerStore, boostTimerStart } from "shared/utils/timer";
import { NavigationBar } from "widgets/navigationBar";

export const Boost = () => {
  const { power } = useUnit(routes.private.boost.$params);
  const address = useUnit($addressStore);
  const [copied, setCopied] = useState(false);
  const pending = useUnit(getAddressQuery.$pending);
  const status = useUnit($boostStatusStore);
  const { time, started, ended } = useUnit($boostTimerStore);

  const copy = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [setCopied]);

  const getAddress = () => {
    getAddressQuery.start({ power });
    boostTimerStart();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (address !== "" && !status) checkBoostStatus.start({ address });
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="h-screen text-foreground flex justify-between flex-col">
      <div className="flex flex-col h-full mt-8 mb-2 mx-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 bg-container font-medium p-4 rounded-xl text-foreground">
            <p className="text-2xl font-bold mb-2">Order details</p>
            <div className="flex justify-between opacity-90">
              <p>Power: </p>
              <div className="flex gap-1">
                <p>{power}</p>
                <PowerIcon />
              </div>
            </div>
            <div className="flex justify-between opacity-90">
              <p>Rent period:</p>
              <p>30 days</p>
            </div>
            <div className="flex justify-between opacity-90">
              <p>Total profit:</p>
              <p>{(power * 60 * 60 * 24 * 30 * 0.000005787).toFixed(2)} TRX</p>
            </div>
            <div className="flex justify-between opacity-90">
              <p>Daily profit:</p>
              <p>{(power * 60 * 60 * 24 * 0.000005787).toFixed(2)} TRX</p>
            </div>
            <div className="flex justify-between opacity-90">
              <p>Price:</p>
              <p>{power * 10} TRX</p>
            </div>
            <div className="flex justify-between opacity-90">
              <p>Fee:</p>
              <p>4%</p>
            </div>
            <div className="flex justify-between opacity-90">
              <p>Total price:</p>
              <p>{(power * 10 * 1.04).toFixed(2)} TRX</p>
            </div>
          </div>
          <div className="flex flex-col bg-container p-4 rounded-xl gap-2">
            <p className="text-2xl font-bold text-foreground mb-2">Payment</p>
            <p className="text-lg text-foreground opacity-90 font-medium">
              Send {(power * 10 * 1.04).toFixed(2)} TRX to this address:
            </p>
            <div
              className={clsx(
                "flex",
                address === "" && "blur",
                status && "blur"
              )}
            >
              <div className="flex rounded-l-md bg-[#18181B] px-4 w-full">
                <div className="text-nowrap opacity-75 overflow-hidden overflow-ellipsis my-auto w-[17rem]">
                  <a
                    className="text-foreground text-md font-medium tracking-wide"
                    href="/#"
                  >
                    {address}
                  </a>
                </div>
              </div>
              <CopyToClipboard text={address}>
                <p
                  onClick={copy}
                  className="p-2 pl-1 pr-4 rounded-r-md  bg-[#18181B] active:opacity-50 transition-all"
                >
                  <SuccessIcon
                    className={clsx(
                      "w-[1.6rem] h-[1.5rem]",
                      "opacity-75",
                      !copied && "hidden"
                    )}
                  />
                  <CopyIcon
                    className={clsx(
                      "w-[1.5rem] h-[1.5rem]",
                      "opacity-75",
                      copied && "hidden"
                    )}
                  />
                </p>
              </CopyToClipboard>
            </div>
            {started && !ended && (
              <p className="opacity-60 self-center font-normal">
                You have {moment.utc(time * 1000).format("mm:ss")} to pay
              </p>
            )}
          </div>
        </div>
        <button
          onClick={getAddress}
          disabled={address !== ""}
          className={clsx(
            "w-full rounded-xl py-4 transition-all flex justify-center text-center font-bold text-xl",
            address === "" && !pending
              ? "bg-primary text-on-primary active:opacity-50"
              : status
              ? "bg-success"
              : "bg-[#18181B] text-primary text-opacity-40"
          )}
        >
          {pending ? (
            <BeatLoader
              color="#ECEDEE"
              className="opacity-40 h-7 items-center"
            />
          ) : address === "" ? (
            "Get address"
          ) : status ? (
            "Payment successful!"
          ) : (
            "Awaiting payment..."
          )}
        </button>
      </div>
      <NavigationBar />
    </div>
  );
};
