import clsx from "clsx";

interface WalletTabButtonProps {
  active: boolean;
  isLeft?: boolean;
  setTab: () => void;
  children: React.ReactNode;
}

export const WalletTabButton = ({
  active,
  setTab,
  isLeft,
  children,
}: WalletTabButtonProps) => {
  return (
    <button
      className={clsx(
        active ? "bg-primary" : "bg-container opacity-70",
        active ? "text-on-primary" : "text-foreground",
        isLeft ? "rounded-l-xl" : "rounded-r-xl",
        "p-4 w-full font-bold text-l"
      )}
      onClick={setTab}
    >
      {children}
    </button>
  );
};
