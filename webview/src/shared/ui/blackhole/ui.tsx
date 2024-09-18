import { useHapticFeedback } from "@vkruglikov/react-telegram-web-app";
import "./ui.css";

export const Blackhole = () => {
  const [impactOccured] = useHapticFeedback();

  return (
    <div className="container m-auto">
      <div className="blackhole m-auto">
        <div className="megna m-auto">
          <div
            onClick={() => impactOccured("soft")}
            className="black m-auto active:size-[80%] transition-all"
          />
        </div>
      </div>
    </div>
  );
};
