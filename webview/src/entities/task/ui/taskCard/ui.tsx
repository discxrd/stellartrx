import clsx from "clsx";
import { Task } from "entities/task";
import { numberWithSpaces } from "shared/utils/numberWithSpace";

interface TaskCardProps extends Task {
  icon: JSX.Element;
  onClick: () => void;
}

export const TaskCard = ({
  description,
  reward,
  completed,
  onClick,
  icon,
}: TaskCardProps) => {
  return (
    <div
      onClick={completed ? undefined : onClick}
      className={clsx(
        "flex justify-between px-7 py-4 gap-7 bg-container rounded-xl",
        completed && "opacity-60"
      )}
    >
      <div className="flex gap-7">
        <div className="my-auto w-[2rem] items-center">{icon}</div>
        <div className="flex flex-col flex-1">
          <p className="font-medium text-xl">{description}</p>

          <div className="flex gap-1">
            <img
              className="w-[1.5rem] h-[1.5rem] m-auto"
              src="/SHIB.png"
              alt="Shib icon"
            />
            <p className="w-full my-auto font-semibold text-lg opacity-95">
              {numberWithSpaces(reward)}
            </p>
          </div>
        </div>
      </div>
      <img
        className="w-[1.5rem] h-[1.5rem] my-auto"
        src="/arrow.png"
        alt="Arrow icon"
      />
    </div>
  );
};
