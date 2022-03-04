/** @format */

import * as React from "react";
import { Dimensions, StyleSheet } from "react-native";
import moment from "moment";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { useDispatch, useSelector } from "react-redux";
import Task, {
  getAllTasks,
  getChartData,
  getPaginationTasks,
  TaskDate,
  TaskType
} from "../../models/Task";
import { RootState, updateActiveUserGarden, updateGardens } from "../../store";
import { IconText, SecondaryButton } from "../common/Button";
import {
  SofiaBoldText,
  SofiaRegularText,
  SofiaSemiBoldText
} from "../StyledText";
import { brandColorRBG, tw, View } from "../Themed";

import Svg, {
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask
} from "react-native-svg";
import { flatten, isEmpty, isNil } from "lodash";
import { addDays } from "../../utils/Date";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Checkbox } from "../common/Input";
import { PlantingDate, updateUserGarden } from "../../models/UserGardens";
import Veggie from "../../models/Veggie";
import { useNavigation } from "@react-navigation/native";

export const ProgressChartIO = () => {
  const { veggies } = useSelector((state: RootState) => state.veggies);
  const { activeGarden } = useSelector((state: RootState) => state.gardens);

  const [first, setFirst] = React.useState(moment().startOf("week").toDate()); // First day is the day of the month - the day of the week
  const [tasks, setTasks] =
    React.useState<{ [veggieName: string]: Array<[TaskDate, boolean]> }>();
  const [weeklyTasks, setWeeklyTasks] = React.useState<any>({});
  const [colors, setColors] = React.useState<Array<string>>([]);
  const [data, setData] = React.useState<Array<number>>([]);
  const [labels, setLabels] = React.useState<Array<string>>([]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const { tasks: _tasks } = getAllTasks(activeGarden); //prettier-ignore
    setTasks(_tasks);
    const weeklyTasks = getPaginationTasks(_tasks, first);
    const {
      data: _data,
      labels: _labels,
      colors: _colors
    } = getChartData(weeklyTasks, veggies);

    setWeeklyTasks(weeklyTasks);
    setLabels(_labels);
    setData(_data);
    setColors(_colors);

    // const isDone =
    //   !isEmpty(weeklyTasks) &&
    //   !flatten(Object.values(weeklyTasks)).some(x => x[1] === false);
  }, [veggies, activeGarden]);

  const updateWeek = (inc: boolean) => {
    const date = inc ? addDays(first, 7) : addDays(first, -7);

    setFirst(date);
    const weeklyTasks = getPaginationTasks(tasks, date);
    const {
      data: _data,
      labels: _labels,
      colors: _colors
    } = getChartData(weeklyTasks, veggies);

    setWeeklyTasks(weeklyTasks);
    setLabels(_labels);
    setData(_data);
    setColors(_colors);
  };

  const handleAddRemoveTask = (
    add: boolean,
    task: Task,
    veggieName: string
  ) => {
    const ug = { ...activeGarden };
    let currentTasks = ug.veggieSteps[veggieName] || [];
    currentTasks = [...currentTasks];
    if (add) currentTasks.push({ task, date: moment().format() });
    else currentTasks = currentTasks.filter(t => t.task.id !== task.id);
    if (task.type === TaskType.plant) {
      const plantingDates = [...ug.plantingDates];
      const plantingDateIndex = plantingDates.findIndex(
        p => p.veggieName === veggieName
      );

      if (plantingDateIndex !== -1) {
        if (add) {
          plantingDates[plantingDateIndex] = {
            ...plantingDates[plantingDateIndex],
            datePlanted: moment().format()
          };
        } else {
          plantingDates[plantingDateIndex] = {
            ...plantingDates[plantingDateIndex],
            datePlanted: null
          };
        }
      }
      ug.plantingDates = plantingDates;
    }

    ug.veggieSteps[veggieName] = currentTasks;
    dispatch(updateActiveUserGarden(ug));
  };

  return (
    <View style={tw.style("shadow-brand m-2 flex px-4")}>
      <View style={tw.style("flex flex-row items-center justify-between")}>
        <IconText
          size={25}
          name="chevron-left"
          color="grey"
          onPress={() => updateWeek(false)}
          style={tw.style("p-2 rounded")}
        />
        <View style={tw.style("flex items-center mx-4")}>
          <SofiaBoldText style={tw.style("text-lg text-gray-500 mt-2")}>
            My Weekly Tasks
          </SofiaBoldText>
          <SofiaRegularText>
            {moment(first).format("l")} -{" "}
            {moment(addDays(first, 6)).format("l")}
          </SofiaRegularText>
        </View>
        <IconText
          size={25}
          name="chevron-right"
          color="grey"
          onPress={() => updateWeek(true)}
          style={tw.style("p-2 rounded")}
        />
      </View>
      {data.length !== 0 && (
        <View style={tw.style("flex justify-center items-center")}>
          <ProgressChart
            data={{ data, labels }}
            width={Dimensions.get("window").width - 120}
            height={200}
            radius={32}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1, index) =>
                `rgba(${
                  colors[index] || brandColorRBG.map(r => r.toString())
                }, ${opacity})`
            }}
            hideLegend={true}
          />
        </View>
      )}
      <View style={tw.style("flex justify-center items-center")}>
        <View style={tw.style("flex")}>
          {data?.map((c, i) => (
            <View key={i} style={tw.style("flex flex-row items-center mt-1")}>
              <View
                style={tw.style(
                  { backgroundColor: `rgb(${colors[i]})` },
                  "h-4 w-4 rounded mr-2"
                )}
              />
              <SofiaRegularText>{labels[i]}</SofiaRegularText>
            </View>
          ))}
        </View>
      </View>

      <View style={tw.style("flex my-4")}>
        {Object.entries(weeklyTasks).length ? (
          Object.entries(weeklyTasks)?.map(([veggieName, td], i) => (
            <View key={veggieName + "task-cont"} style={tw.style("flex")}>
              <SofiaRegularText
                style={tw.style("text-gray-500 text-lg  underline")}>
                {veggies[veggieName]?.displayName}
              </SofiaRegularText>
              <View style={tw.style("flex mt-2")}>
                {(td as Array<[TaskDate, boolean]>).map(task => (
                  <View style={tw.style("my-0.5")} key={task[0].task.id}>
                    <Checkbox
                      onPress={(isChecked: boolean) =>
                        handleAddRemoveTask(isChecked, task[0].task, veggieName)
                      }
                      isChecked={task[1]}
                      text={task[0].task.title}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={tw.style("my-0.5")}>
            <SofiaRegularText
              style={tw.style("text-gray-500 text-lg text-center")}>
              No Tasks!
            </SofiaRegularText>
          </View>
        )}
      </View>
    </View>
  );
};
//
interface TimelineProps {
  gardenVeggies: Array<Veggie>;
  plantingDates: Array<PlantingDate>;
}

export function Timeline(props: TimelineProps) {
  const width = Dimensions.get("window").width - 80;
  const xStart = 50;
  const section = (width - xStart) / 12;
  const sections = [...Array(12).keys()];
  const navigation = useNavigation();
  return (
    <View style={tw.style("flex justify-center items-center shadow-brand m-2")}>
      <SofiaSemiBoldText style={tw.style("text-lg text-gray-500 my-2")}>
        Planting Dates
      </SofiaSemiBoldText>
      {props.gardenVeggies.map((g, index) => {
        const plantingDates = props.plantingDates?.find(
          pd => pd.veggieName === g?.name
        );
        const first = plantingDates?.first;
        const last = plantingDates?.last;
        const planted = plantingDates?.datePlanted;

        const lastDate = new Date(first);
        const firstDate = new Date(last);
        const plantedDate = planted ? new Date(planted) : null;

        const xFirst =
          xStart +
          firstDate.getMonth() * section +
          (firstDate.getDate() / 30) * section;
        const xLast =
          xStart +
          lastDate.getMonth() * section +
          (lastDate.getDate() / 30) * section;

        const xDatePlanted = planted
          ? xStart +
            plantedDate.getMonth() * section +
            (plantedDate.getDate() / 30) * section
          : null;

        if (!plantingDates) return <View></View>;
        return (
          <View key={g.name + index}>
            <Svg height="60" width={width}>
              <Image
                x="5"
                y="5"
                width="35"
                height="35"
                href={{ uri: g?.downloadUrl }}
              />
              {sections.map(s => (
                <Line
                  key={s}
                  x1={s * section + xStart}
                  y1="20"
                  x2={s * section + xStart}
                  y2="30"
                  stroke="rgba(103,146,54, 0.5)"
                  strokeWidth="2"
                />
              ))}
              <Line
                x1={xStart}
                y1="25"
                x2={width}
                y2="25"
                stroke="rgba(103,146,54, 0.2)"
                strokeWidth="2"
              />

              {planted ? (
                <G>
                  <Circle
                    cx={xDatePlanted}
                    cy="25"
                    r="4"
                    strokeWidth={2}
                    fill={"rgba(103,146,54, 0.4)"}
                    stroke={"rgba(103,146,54)"}
                  />
                  <Text
                    fill="gray"
                    stroke="transparent"
                    fontSize="12"
                    x={xDatePlanted}
                    y="45"
                    textAnchor="middle">
                    Planted
                  </Text>
                </G>
              ) : (
                <G>
                  <Circle cx={xFirst} cy="25" r="4" fill="rgba(103,146,54)" />
                  <Circle cx={xLast} cy="25" r="4" fill="rgba(103,146,54)" />
                  <Line
                    x1={xFirst}
                    y1="25"
                    x2={xLast}
                    y2="25"
                    stroke="rgba(103,146,54, 1)"
                    strokeWidth="2.5"
                  />
                  <Text
                    fill="gray"
                    stroke="transparent"
                    fontSize="14"
                    x={xFirst}
                    y="45"
                    textAnchor="start">
                    {moment(firstDate).format("l")}
                  </Text>
                  <Text
                    fill="gray"
                    stroke="transparent"
                    fontSize="14"
                    x={xLast}
                    y={15}
                    textAnchor="end">
                    {moment(lastDate).format("l")}
                  </Text>
                </G>
              )}
            </Svg>

            {!planted && (
              <View style={tw.style("mb-5")}>
                <SecondaryButton
                  title="Select Seeding Type"
                  onPress={() =>
                    navigation.navigate("StepsToSuccess", { veggie: g })
                  }
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
