interface ClaimButtonProps {
  onClick: () => void;
}

export const ClaimButton = ({ onClick }: ClaimButtonProps) => {
  return (
    <button
      className="font-semibold text-l px-4 bg-primary text-on-primary rounded-xl active:opacity-50"
      onClick={onClick}
    >
      Send
    </button>
  );
};
