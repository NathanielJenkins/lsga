/** @format */

import { isNil } from "lodash";
import { useSelector } from "react-redux";
import { RootState, store } from "../store";
import { addDays, randomRgb } from "../utils/Date";
import UserGarden, { getUniqueVeggieIdsFromGrid } from "./UserGardens";
import Veggie from "./Veggie";

export class TaskType {
  public static readonly plant = "plant";
}

export default interface Task {
  id: string;
  title: string;
  description: string;
  offset: number;
  type: "plant" | "general";
}

export interface TaskDate {
  task: Task;
  date?: Date | string;
}

export const getPlantingTask = (veggie: Veggie) => {
  const title = `Plant ${veggie.displayName}`;
  const description = veggie.seedingNotes;
  const offset = 0;

  return { title, description, offset };
};

export const getAllTasks = (userGarden: UserGarden) => {
  const { veggies } = store.getState().veggies;
  const { veggieSteps, plantingDates } = userGarden;

  // map tasks to data
  const tasks: { [veggieName: string]: Array<[TaskDate, boolean]> } = {};

  // get starting date
  const veggieIds = getUniqueVeggieIdsFromGrid(userGarden);

  for (let vid of veggieIds) {
    const veggie = veggies[vid];
    if (!veggie) continue;

    //get the planting date;
    const plantingDate = plantingDates.find(pd => pd.veggieName === vid);
    if (!plantingDate) continue;

    let startDate: Date = new Date();
    // if (plantingDate.datePlanted) startDate = plantingDate.datePlanted;
    // else startDate = new Date(plantingDate.first);

    // iterate through the tasks and assign them a date and completed status
    for (let sts of veggie.stepsToSuccess || []) {
      const veggieSteps = userGarden.veggieSteps || {};
      const completedTask = veggieSteps[vid]?.find(t => sts.id === t.task.id);
      if (completedTask) {
        const taskDate = {
          task: completedTask.task,
          date: new Date(completedTask.date)
        };
        if (tasks[vid]) tasks[vid].push([taskDate, true]);
        else tasks[vid] = new Array<[TaskDate, boolean]>([taskDate, true]);
      } else {
        const dateToComplete = new Date(startDate);
        dateToComplete.setDate(dateToComplete.getDate() + sts.offset);

        const taskDate = { task: sts, date: dateToComplete };
        if (tasks[vid]) tasks[vid].push([taskDate, false]);
        else tasks[vid] = new Array<[TaskDate, boolean]>([taskDate, false]);
      }
    }
  }

  return { tasks };

  // check if the
};

export const getPaginationTasks = (
  veggieTasks: { [veggieName: string]: Array<[TaskDate, boolean]> },
  first: Date
) => {
  const last = addDays(first, 7);
  const vts: { [veggieName: string]: Array<[TaskDate, boolean]> } = {
    ...veggieTasks
  };
  const vtss: { [veggieName: string]: Array<[TaskDate, boolean]> } = {};
  for (let [veggieName, tasks] of Object.entries(vts)) {
    const filteredTasks = tasks.filter(t => {
      return new Date(t[0].date) >= first && new Date(t[0].date) <= last;
    });
    if (filteredTasks.length) vtss[veggieName] = filteredTasks;
  }

  return vtss;
};

export const getChartData = (
  veggieTasks: {
    [veggieName: string]: Array<[TaskDate, boolean]>;
  },
  veggies: {
    [name: string]: Veggie;
  }
) => {
  const labels =
    Object.keys(veggieTasks).map(k => veggies[k].displayName) || [];
  const colors = Object.keys(veggieTasks).map(k => veggies[k].color) || [];

  const data: Array<number> =
    Object.keys(veggieTasks).map(l => {
      const completed = veggieTasks[l].filter(t => t[1] === true);
      const inCompleted = veggieTasks[l].filter(t => t[1] === false);

      let ratio: number =
        completed.length / (completed.length + inCompleted.length);
      return ratio;
    }) || [];
  return { data, labels, colors };
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


      for (let i = 0; i < userGarden.grid.length; i++) {
    const veggieName = userGarden.grid[i];
    const veggie = veggies[userGarden.grid[i]];
    if (!veggie || !veggie.stepsToSuccess || tasks[veggieName]) {
      continue;
    }

    // check the plant date for
    const mostRecentCompletedTaskIndex =
      (userGarden.veggieSteps &&
        userGarden.veggieSteps[veggie.name].length - 1) ||
      -1;

    // if the most recent is not planted
    let offsetDate: Date;
    if (mostRecentCompletedTaskIndex === -1) {
      const plantingDate = userGarden.plantingDates.find(
        pd => pd.veggieName === veggie.name
      );
      if (!plantingDate) continue;
      offsetDate = new Date(first);
    }

    for (
      let i = mostRecentCompletedTaskIndex + 1;
      i < veggie.stepsToSuccess.length;
      i++
    ) {
      const task = veggie.stepsToSuccess[i];
      const completion = userGarden.veggieSteps[i];
      offsetDate = addDays(offsetDate, task.offset);


      if (offsetDate > last) break;
      if (!tasks[veggieName]) tasks[veggieName] = new Array({task, completion});
      else tasks[veggieName].push({task, });
    }
  }
*/
