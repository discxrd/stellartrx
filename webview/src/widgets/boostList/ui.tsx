import { BoostCard, TBoost } from "entities/boost";

interface BoostListProps {
  boosts: TBoost[];
}

export const BoostList = ({ boosts }: BoostListProps) => {
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
      {boosts.length === 0 ||
      boosts.every((boost: TBoost) => boost.status !== "success") ? (
        <p className="w-full text-lg font-medium text-center text-foreground opacity-50">
          No boosts
        </p>
      ) : (
        boosts?.map(
          (boost: TBoost) =>
            boost.status === "success" && (
              <BoostCard {...boost} key={boost.createdTime.toString()} />
            )
        )
      )}
    </div>
  );
};
