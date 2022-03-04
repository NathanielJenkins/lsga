/** @format */

import { FontAwesome5 } from "@expo/vector-icons";
import { isNil } from "lodash";
import React from "react";
import { View } from "react-native";
import Task, { KnownTaskTitle, TaskType } from "../../models/Task";
import { SofiaBoldText, SofiaRegularText } from "../StyledText";
import { tw } from "../Themed";

class SubPage {
  public static readonly DIRECT = "DIRECT";
  public static readonly INDOORS = "INDOORS";
}

interface StepsToSuccessProps {
  directSeedSteps: Array<Task>;
  indoorsSeedSteps: Array<Task>;
}
export function StepsToSuccess(props: StepsToSuccessProps) {
  const hasIndoors = !isNil(props.indoorsSeedSteps);
  const hasDirect = !isNil(props.directSeedSteps);
  const startingPage = hasDirect ? SubPage.DIRECT : SubPage.INDOORS;
  const [currentPage, setCurrentPage] = React.useState(startingPage);

  const getHeader = (title: string, subPage: SubPage) => {
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
    <View style={tw.style("my-3")}>
      <View style={tw.style("flex flex-row items-center justify-center mb-2")}>
        {hasDirect && getHeader("Direct Seed", SubPage.DIRECT)}

        {hasIndoors && hasDirect && (
          <SofiaBoldText style={tw.style("text-2xl text-gray-400 mx-2")}>
            |
          </SofiaBoldText>
        )}
        {hasIndoors && getHeader("Seed Indoors", SubPage.INDOORS)}
      </View>
      {currentPage === SubPage.DIRECT &&
        StepList({ tasks: props.directSeedSteps })}
      {currentPage === SubPage.INDOORS &&
        StepList({ tasks: props.indoorsSeedSteps })}
    </View>
  );
}

interface StepListProps {
  tasks: Array<Task>;
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
      <View style={tw.style("flex flex-col mx-2")}>
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
