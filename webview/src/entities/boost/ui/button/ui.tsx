interface BoostButtonProps {
  onClick: () => void;
}

export const BoostButton = ({ onClick }: BoostButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-on-primary w-full rounded-xl font-bold text-2xl py-2 active:opacity-50 transition-all"
    >
      Boost
    </button>
  );
};
