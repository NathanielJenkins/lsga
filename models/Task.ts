/** @format */

import { isNil } from "lodash";
import { store } from "../store";
import UserGarden from "./UserGardens";
import Veggie from "./Veggie";

export class TaskType {
  public static readonly plant = "plant";
}

export default interface Task {
  title: string;
  description: string;
  offset: number;
}

export const getPlantingTask = (veggie: Veggie) => {
  const title = `Plant ${veggie.displayName}`;
  const description = veggie.seedingNotes;
  const offset = 0;

  return { title, description, offset };
};

export const getWeeklyTasks = (
  userGarden: UserGarden,
  first: Date,
  last: Date
) => {
  const { veggies } = store.getState().veggies;

  const tasks: { [veggieName: string]: Array<Task> } = {};
  for (let i = 0; i < userGarden.grid.length; i++) {
    const veggieName = userGarden.grid[i];
    const veggie = veggies[userGarden.grid[i]];
    if (!veggie) continue;

    // check the plant date for
    if (!userGarden.plantingDates[i]) {
      tasks[veggieName] = new Array(getPlantingTask(veggie));
    }
  }

  return tasks;

  // check if the
};

/*
  const mostRecentCompletedTaskIndex =
      (userGarden.veggieSteps && userGarden.veggieSteps[veg.name].length - 1) || -1;
    
    // if the most recent is not planted
    

    const taskToComplete =
      veg.stepsToSuccess && veg.stepsToSuccess[mostRecentCompletedTaskIndex];
    if (!taskToComplete) continue;

    let offset = 0;
    for (
      let i = mostRecentCompletedTaskIndex;
      i < veg.stepsToSuccess.length;
      i++
    ) {
      const task = veg.stepsToSuccess[i];

      offset += taskToComplete.offset;
      const date = new Date(first.getDate() + offset);
      if (date < last) {
        if (!tasks[veg.name]) tasks[veg.name] = new Array(task);
        else tasks[veg.name].push(task);
      }
    }
*/
