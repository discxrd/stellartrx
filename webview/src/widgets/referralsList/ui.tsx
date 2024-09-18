import { TReferral, ReferralCard } from "entities/referral";

interface ReferralsListProps {
  referrals: TReferral[];
}

export const ReferralsList = ({ referrals }: ReferralsListProps) => {
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex w-full justify-between">
        <p className="text-xl font-bold">List of your friends</p>
      </div>
      <div
        style={{
          overflow: "scroll",
          flex: "1 1 0",
          display: "flex",
          flexDirection: "column",
        }}
        className="gap-2"
      >
        {referrals.length === 0 ? (
          <p className="w-full text-lg font-medium text-center text-foreground opacity-50">
            No referrals
          </p>
        ) : null}
        {referrals.map((referral: TReferral) => (
          <ReferralCard {...referral} key={referral.name} />
        ))}
      </div>
    </div>
  );
};
