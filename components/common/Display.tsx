/** @format */

import { isNil } from "lodash";
import React from "react";
import { StyleProp, View } from "react-native";
import { tw } from "../../components/Themed";
import { SofiaRegularText } from "../StyledText";
export const Info = (props: {
  title: string;
  text?: string;
  style?: StyleProp<any>;
  children?: React.ReactNode;
}) => {
  return (
    <View style={tw.style(props.style, "flex")}>
      <SofiaRegularText style={tw.style("text-brand text-lg")}>
        {props.title}
      </SofiaRegularText>

      {!isNil(props.text) && (
        <SofiaRegularText style={tw.style("text-gray-500")}>
          {props.text}
        </SofiaRegularText>
      )}
      {props.children && props.children}
    </View>
  );
};
