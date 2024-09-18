export const BecomeSponsorButton = () => {
  return (
    <button
      className="bg-primary text-on-primary w-full rounded-xl font-bold text-2xl py-4 active:opacity-50 transition-all"
      onClick={() => {
        window.open("tg://user?id=5882652740", "_blank");
      }}
    >
      Become a partner
    </button>
  );
};
