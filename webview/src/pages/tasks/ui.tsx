import { syncQuery } from "entities/user";
import { useEffect } from "react";
import { NavigationBar } from "widgets/navigationBar";
import { TaskList } from "widgets/taskList";

export const Tasks = () => {
  return (
    <div className="h-screen bg-background text-foreground flex justify-between flex-col tracking-wide">
      <div className="flex flex-col h-full mt-8 mb-2 mx-4 gap-8">
        <div className="flex flex-col gap-[12px]">
          <img className=" m-auto w-[7rem]" src="/SHIB.png" alt="Shib icon" />
          <p className="w-full text-center font-extrabold text-3xl">
            Earn free SHIB tokens!
          </p>
        </div>
        <TaskList />
      </div>
      <NavigationBar />
    </div>
  );
};
