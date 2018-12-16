import React from "react";
import { View, Text } from "react-native";

import { Icon } from "expo";

import Colors from "../constants/Colors";

export class WebClientView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //   console.log(this.props.data.data[0].customer)
    return (
      <View>
        <Text>{this.props.data.data[0].customer}</Text>
      </View>
    );
  }
}
