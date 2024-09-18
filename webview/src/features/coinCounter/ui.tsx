import { useUnit } from "effector-react";
import { $userStore } from "entities/user";

export const CoinCounter = () => {
  const coins = useUnit($userStore).coins;

  return (
    <div className="w-fit flex m-auto gap-2">
      <p className="text-4xl font-extrabold">{Number(coins).toFixed(6)} TRX</p>
    </div>
  );
};
