import { useUnit } from "effector-react";
import { $userStore, completeTaskQuery } from "entities/user";
import { TaskCard } from "entities/task/ui/taskCard/ui";
import { goToBoost, goToReferrals } from "shared/routing";
import { XIcon } from "react-share";
import { syncQuery } from "entities/user";

export const TaskList = () => {
  const { tasks, completed_tasks } = useUnit($userStore);

  const onInviteClick = () => {
    goToReferrals();
  };

  const onBoostClick = () => {
    goToBoost();
  };

  const goToUrl = (url: string) => {
    window.open(url, "_blank");
    syncQuery.start();
  };

  const fastComplete = (taskId: number) => {
    completeTaskQuery.start({ taskId });
  };

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
      {tasks.map((task) => (
        <TaskCard
          {...task}
          completed={completed_tasks.some((el) => el.id === task.id)}
          description={task.description}
          onClick={
            task.title === "Invition"
              ? onInviteClick
              : task.title === "Boost"
              ? onBoostClick
              : () => {
                  if (task.fastComplete) fastComplete(task.id);
                  goToUrl(task.link);
                }
          }
          icon={
            task.title.includes("Invition") ? (
              <img className="mx-auto h-[2rem]" src="/people.png" alt="icon" />
            ) : task.title.includes("Boost") ? (
              <img className="mx-auto h-[2rem]" src="/boost.png" alt="icon" />
            ) : task.title.includes("Telegram") ? (
              <img
                className="mx-auto h-[1.6rem]"
                src="/telegram.png"
                alt="icon"
              />
            ) : task.title.includes("Twitter") ? (
              <img
                className="mx-auto w-[1.6rem]h-[1.6rem]"
                src="/X.png"
                alt="icon"
              />
            ) : task.title.includes("Youtube") ? (
              <img
                className="mx-auto w-[1.6rem]h-[1.6rem]"
                src="/Youtube.png"
                alt="icon"
              />
            ) : (
              <img
                className="mx-auto w-[1.6rem]h-[1.6rem]"
                src="/Instagram.png"
                alt="icon"
              />
            )
          }
          key={task.id}
        />
      ))}
      <p className="mt-2 w-full text-xl font-medium text-center text-foreground opacity-40">
        Coming soon...
      </p>
    </div>
  );
};
