/** @format */

import { FontAwesome5 } from "@expo/vector-icons";
import { isNil } from "lodash";
import React from "react";
import { View } from "react-native";
import Task, { KnownTaskTitle, TaskType } from "../../models/Task";
import { PlantingType } from "../../models/Veggie";
import { SofiaBoldText, SofiaRegularText } from "../StyledText";
import { tw } from "../Themed";
interface StepsToSuccessProps {
  directSeedSteps: Array<Task>;
  indoorsSeedSteps: Array<Task>;
  currentPage?: string;
  setCurrentPage?: React.Dispatch<React.SetStateAction<string>>;
}
export function StepsToSuccess(props: StepsToSuccessProps) {
  const { startingPage, hasDirect, hasIndoors } = getStartingPage(
    props.indoorsSeedSteps,
    props.directSeedSteps
  );

  let currentPage: string;
  let setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  [currentPage, setCurrentPage] = props.currentPage
    ? [props.currentPage, props.setCurrentPage]
    : React.useState(startingPage);

  const getHeader = (title: string, subPage: PlantingType) => {
    return (
      <SofiaBoldText
        style={tw.style("text-2xl text-gray-400", {
          "text-brand": currentPage === subPage
        })}
        onPress={() => setCurrentPage(subPage as string)}>
        {title}
      </SofiaBoldText>
    );
  };

  return (
    <View style={tw.style("my-3 mb-5")}>
      <View style={tw.style("flex flex-row items-center justify-center mb-2")}>
        {hasDirect && getHeader("Direct Seed", PlantingType.directSeedSteps)}

        {hasIndoors && hasDirect && (
          <SofiaBoldText style={tw.style("text-2xl text-gray-400 mx-2")}>
            |
          </SofiaBoldText>
        )}
        {hasIndoors && getHeader("Seed Indoors", PlantingType.indoorsSeedSteps)}
      </View>
      {currentPage === PlantingType.directSeedSteps &&
        StepList({ tasks: props.directSeedSteps })}
      {currentPage === PlantingType.indoorsSeedSteps &&
        StepList({ tasks: props.indoorsSeedSteps })}
    </View>
  );
}

interface StepListProps {
  tasks: Array<Task>;
}
export function getStartingPage(
  indoorsSeedSteps: Array<Task>,
  directSeedSteps: Array<Task>
) {
  const hasIndoors = !isNil(indoorsSeedSteps);
  const hasDirect = !isNil(directSeedSteps);
  const startingPage = hasDirect
    ? PlantingType.directSeedSteps
    : PlantingType.indoorsSeedSteps;
  return { startingPage, hasDirect, hasIndoors };
}

export function StepList(props: StepListProps) {
  const getOffset = (task: Task) => {
    if (task.type === TaskType.plant) return;
    return (
      <View style={tw.style("flex flex-row items-center m-3 ml-8")}>
        <View style={tw.style("h-8 w-0.5 bg-gray-400 mr-4")}></View>
        <SofiaRegularText style={tw.style("text-gray-400")}>
          {task.offset[0]} - {task.offset[1]} Days (From Seeding)
        </SofiaRegularText>
      </View>
    );
  };

  const getStep = (task: Task) => {
    return (
      <View key={task.id} style={tw.style("flex flex-col mx-2")}>
        {getOffset(task)}

        <View style={tw.style("shadow-brand p-4 flex justify-center w-full")}>
          <View style={tw.style("flex flex-row items-center")}>
            <SofiaBoldText style={tw.style(" text-xl text-gray-500 mr-2")}>
              <FontAwesome5 size={16} name={getIcon(task.title)} />
            </SofiaBoldText>
            <SofiaBoldText style={tw.style("text-xl text-gray-500")}>
              {task.title}
            </SofiaBoldText>
          </View>

          <SofiaRegularText style={tw.style("text-gray-500 leading-4")}>
            {task.description}
          </SofiaRegularText>
        </View>
      </View>
    );
  };

  const getIcon = (title: KnownTaskTitle) => {
    switch (title) {
      case KnownTaskTitle.DirectSeed:
        return "leaf";
      case KnownTaskTitle.Germination:
        return "water";
      case KnownTaskTitle.Harvest:
        return "carrot";
      case KnownTaskTitle.Pruning:
        return "hand-scissors";
      case KnownTaskTitle.ThinSeedlings:
        return "seedling";
      default:
        return "smile";
    }
  };

  const steps = props.tasks?.map(t => getStep(t));
  return (
    <View>
      <SofiaRegularText
        style={tw.style("text-lg text-gray-500 text-center mb-4")}>
        Steps To Success
      </SofiaRegularText>
      {steps}
    </View>
  );
}
