import { useUnit } from "effector-react";
import { $userStore, syncQuery } from "entities/user";
import { BecomeSponsorButton } from "features/becomeSponsor";
import { CopyLinkButton } from "features/copyLinkButton";
import { InviteFriendButton } from "features/inviteFriendButton";
import { useEffect } from "react";
import { GiftIcon } from "shared/ui/icons";
import { NavigationBar } from "widgets/navigationBar";
import { ReferralsList } from "widgets/referralsList";

export const Referrals = () => {
  const { referrals, isPartner } = useUnit($userStore);

  return (
    <div className="h-screen bg-background text-foreground flex flex-col justify-between tracking-wide">
      <div className="flex flex-col h-full mt-8 mb-2 mx-4 gap-8 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-[12px]">
            <p className="w-full text-center font-extrabold text-3xl">
              Invite friends!
            </p>
          </div>
          <div className="flex bg-container gap-4 p-4 rounded-xl align-middle">
            <div className="my-auto">
              <GiftIcon />
            </div>
            <div>
              <p className="font-medium text-lg">
                Invite your friends to the universe of mining TRON and get +5000
                SHIB
              </p>
              <p className="font-medium text-lg">
                and +{isPartner ? "10%" : "5%"} from deposits
              </p>
            </div>
          </div>
          <BecomeSponsorButton />
        </div>

        <ReferralsList referrals={referrals} />
        <div className="flex w-full gap-3">
          <InviteFriendButton />
          <CopyLinkButton />
        </div>
      </div>
      <NavigationBar />
    </div>
  );
};
