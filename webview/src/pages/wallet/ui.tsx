import { useUnit } from "effector-react";
import { $userStore, syncQuery } from "entities/user";
import { useEffect, useState } from "react";
import { numberWithSpaces } from "shared/utils/numberWithSpace";
import { NavigationBar } from "widgets/navigationBar";
import { WithdrawForm } from "features/withdrawForm";
import { ClaimCard } from "entities/withdraw";
import { TransactionTabs } from "widgets/transactionTabs/ui";
import { ReferralEarnings } from "features/referralEarnings";

export const Wallet = () => {
  const { trx, shib, withdraws, boosts } = useUnit($userStore);

  const [isOpenBoostForm, setOpenBoostForm] = useState(false);
  const [coin, setCoin] = useState<"SHIB" | "TRX">("SHIB");

  const handleClick = () => {
    syncQuery.start();
  };

  const toggleWithdrawForm = () => {
    setOpenBoostForm(!isOpenBoostForm);
  };

  const openShibClaimForm = () => {
    setCoin("SHIB");
    toggleWithdrawForm();
  };

  const openTrxClaimForm = () => {
    setCoin("TRX");
    toggleWithdrawForm();
  };

  return (
    <div className="h-screen bg-background text-foreground flex justify-between flex-col flex-1 tracking-wide">
      <div className="flex flex-col h-full mt-8 mb-2 mx-4 gap-4 flex-1">
        <p className="w-full text-center font-extrabold text-3xl">
          Claim yours tokens!
        </p>
        <div className="flex flex-col gap-2">
          <ClaimCard icon="SHIB.png" onClick={openShibClaimForm}>
            {numberWithSpaces(shib)} SHIB
          </ClaimCard>
          <ClaimCard icon="TRX.png" onClick={openTrxClaimForm}>
            {trx.toFixed(6)} TRX
          </ClaimCard>
          <ReferralEarnings />
        </div>

        <TransactionTabs boosts={boosts} withdraws={withdraws} />
      </div>
      <WithdrawForm
        isOpen={isOpenBoostForm}
        onClose={toggleWithdrawForm}
        coin={coin}
        setCoin={setCoin}
        handleClick={handleClick}
      />
      <NavigationBar />
    </div>
  );
};
