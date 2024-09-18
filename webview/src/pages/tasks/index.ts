import { currentRoute } from "./model";
import { Tasks } from "./ui";

export const TasksRoute = {
  view: Tasks,
  route: currentRoute,
};
