/** @format */

import * as React from "react";
import { Dimensions, StyleSheet } from "react-native";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { useSelector } from "react-redux";
import { getWeeklyTasks } from "../../models/Task";
import { RootState } from "../../store";
import { IconText } from "../common/Button";
import {
  SofiaBoldText,
  SofiaRegularText,
  SofiaSemiBoldText
} from "../StyledText";
import { tw, View } from "../Themed";

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
import { isNil } from "lodash";

export const ProgressChartIO = () => {
  const { veggies } = useSelector((state: RootState) => state.veggies);
  const { activeGarden } = useSelector((state: RootState) => state.gardens);

  const [weekOffset, setWeekOffset] = React.useState(0);
  const curr = new Date(); // get current date
  const first = curr.getDate() - curr.getDay() + (weekOffset * 7); //prettier-ignore
  const last = first + 6; // last day is the first day +
  const stringFormat: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric"
  };

  const firstday = new Date(curr.setDate(first)) //prettier-ignore
  const lastday = new Date(curr.setDate(last)) //prettier-ignore

  const [data, setData] = React.useState({
    labels: ["Beets", "Beets", "Beets", "Beets", "Beets"], // optional
    data: [0.4, 0.6, 0.8, 0.4]
  });

  React.useEffect(() => {
    // console.log(getWeeklyTasks(activeGarden, firstday, lastday))

    setData({
      labels: ["d", "d", "d", "d"], // optional
      data: [Math.random(), Math.random(), Math.random(), Math.random()]
    });
  }, [weekOffset]);

  return (
    <View style={tw.style("shadow-brand m-2 flex items-center")}>
      <View style={tw.style("flex flex-row items-center justify-between")}>
        <IconText
          size={25}
          name="chevron-left"
          color="grey"
          onPress={() => setWeekOffset(weekOffset - 1)}
        />
        <View style={tw.style("flex items-center mx-4")}>
          <SofiaBoldText style={tw.style("text-lg text-gray-500 mt-2")}>
            My Weekly Tasks
          </SofiaBoldText>
          <SofiaRegularText>
            {firstday.toLocaleString("en-En", stringFormat)} -
            {lastday.toLocaleString("en-En", stringFormat)}
          </SofiaRegularText>
        </View>
        <IconText
          size={25}
          name="chevron-right"
          color="grey"
          onPress={() => setWeekOffset(weekOffset + 1)}
        />
      </View>
      <ProgressChart
        data={data}
        width={Dimensions.get("window").width - 60}
        height={220}
        radius={10}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1, index) => `rgba(103, 146, 54, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(103, 146, 54, ${opacity})`
        }}
        hideLegend={true}
      />
    </View>
  );
};

export function Timeline() {
  const { activeGarden } = useSelector((state: RootState) => state.gardens);
  const { veggies } = useSelector((state: RootState) => state.veggies);

  const gardenVeggies = [...new Set(activeGarden.grid)]
    .map(g => veggies[g])
    .filter(g => !isNil(g));

  const width = Dimensions.get("window").width - 80;
  const xStart = 50;
  const section = (width - xStart) / 11;
  const sections = [...Array(11).keys()];
  const stringFormat: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric"
  };
  return (
    <View style={tw.style("flex justify-center items-center shadow-brand m-2")}>
      <SofiaSemiBoldText style={tw.style("text-lg text-gray-500 text-left")}>
        Planting Dates
      </SofiaSemiBoldText>
      {gardenVeggies.map(g => {
        const plantingDates = activeGarden.plantingDates.find(
          pd => pd.veggieName === g?.name
        );
        const first = plantingDates?.first;
        const last = plantingDates?.last;

        const firstDate = new Date(first);
        const lastDate = new Date(last);

        const xFirst =
          xStart +
          firstDate.getMonth() * section +
          (firstDate.getDate() / 30) * section;
        const xLast =
          xStart +
          lastDate.getMonth() * section +
          (lastDate.getDate() / 30) * section;

        return (
          <Svg key={g.name} height="70" width={width}>
            <Image
              x="5"
              y="5"
              width="35"
              height="35"
              href={{ uri: g?.downloadUrl }}
            />
            {sections.map(s => (
              <Line
                x1={s * section + xStart}
                y1="20"
                x2={s * section + xStart}
                y2="30"
                stroke="rgba(103,146,54, 0.5)"
                strokeWidth="3"
              />
            ))}
            <Line
              x1={xFirst}
              y1="25"
              x2={xLast}
              y2="25"
              stroke="rgba(103,146,54, 1)"
              strokeWidth="3"
            />
            <Line
              x1={xStart}
              y1="25"
              x2="400"
              y2="25"
              stroke="rgba(103,146,54, 0.2)"
              strokeWidth="3"
            />
            <Circle cx={xFirst} cy="25" r="5" fill="rgba(103,146,54)" />
            <Circle cx={xLast} cy="25" r="5" fill="rgba(103,146,54)" />
            <Text
              fill="black"
              stroke="transparent"
              fontSize="12"
              x={xFirst}
              y="45"
              textAnchor="start">
              {firstDate.toLocaleString("en-En", stringFormat)}
            </Text>
            <Text
              fill="black"
              stroke="transparent"
              fontSize="12"
              x={xLast}
              y={lastDate.getMonth() === firstDate.getMonth() ? 15 : 45}
              textAnchor="end">
              {lastDate.toLocaleString("en-En", stringFormat)}
            </Text>
          </Svg>
        );
      })}
    </View>
  );
}
