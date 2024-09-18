import { TWithdraw, WithdrawCard } from "entities/withdraw";

interface WithdrawListProps {
  withdraws: TWithdraw[];
}

export const WithdrawList = ({ withdraws }: WithdrawListProps) => {
  return (
    <div
      style={{
        overflow: "auto",
        flex: "1 1 0",
        display: "flex",
        flexDirection: "column",
      }}
      className="gap-2"
    >
      {withdraws?.length === 0 ? (
        <p className="w-full text-lg font-medium text-center text-foreground opacity-50">
          No withdraws
        </p>
      ) : null}
      {withdraws?.map((withdraw: TWithdraw) => (
        <WithdrawCard {...withdraw} key={withdraw.createdTime.toString()} />
      ))}
    </div>
  );
};
