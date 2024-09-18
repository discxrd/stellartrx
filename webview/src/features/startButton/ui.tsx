import { start } from "entities/user";

export const StartButton = () => {
  return (
    <button
      onClick={() => {
        start();
      }}
      className="bg-primary text-on-primary rounded-xl font-bold text-2xl py-2 w-full active:opacity-50 transition-all"
    >
      Start
    </button>
  );
};
