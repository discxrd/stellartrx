import { TBoost } from "entities/boost";
import { TWithdraw } from "entities/withdraw";
import { WalletTabButton } from "features/walletTabButton";
import { useState } from "react";
import { BoostList } from "widgets/boostList";
import { WithdrawList } from "widgets/withdrawList";

interface TransactionTabsProps {
  withdraws: TWithdraw[];
  boosts: TBoost[];
}

export const TransactionTabs = ({
  withdraws,
  boosts,
}: TransactionTabsProps) => {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex">
        <WalletTabButton active={tab === 0} setTab={() => setTab(0)} isLeft>
          Withdraws
        </WalletTabButton>
        <WalletTabButton active={tab === 1} setTab={() => setTab(1)}>
          Boosts
        </WalletTabButton>
      </div>
      {tab === 0 ? (
        <WithdrawList withdraws={withdraws} />
      ) : (
        <BoostList boosts={boosts} />
      )}
    </div>
  );
};
