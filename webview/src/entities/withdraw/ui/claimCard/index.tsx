interface ClaimCardProps {
  icon: string;
  onClick: () => void;
  children: React.ReactNode;
}

export const ClaimCard = ({ icon, onClick, children }: ClaimCardProps) => {
  return (
    <div className="flex px-7 py-4 gap-7 bg-container rounded-xl">
      <img className="w-[3rem] h-[3rem]" src={icon} alt="icon" />
      <p className="m-auto font-semibold text-l">{children}</p>
      <button
        className="font-semibold text-l px-4 my-2 bg-primary text-on-primary rounded-xl active:opacity-50"
        onClick={onClick}
      >
        Send
      </button>
    </div>
  );
};
