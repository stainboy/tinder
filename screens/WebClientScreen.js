import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  View
} from "react-native";
import { WebBrowser } from "expo";
import { parseString } from "react-native-xml2js";

import { MonoText } from "../components/StyledText";
import { WebClientView } from "../components/WebClientView";

export default class WebClientScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  // promiseSetTimeout = (ms) =>
  //   new Promise((resolve) => window.setTimeout(resolve, ms));

  promiseParseString(xml) {
    return new Promise(function(resolve, reject) {
      parseString(xml, function(err, data) {
        if (err !== null) reject(err);
        else resolve(data);
      });
    });
  }

  // promiseParseString = xml => new Promise(resolve => parseString(xml, resolve));

  constructor(props) {
    super(props);
    this.loadRemoteContent = this.loadRemoteContent.bind(this);
    this.state = { isLoading: false };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.welcomeContainer}>
            <Image
              source={require("../assets/images/sap.png")}
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              以下内容从WebClient后端动态加载
            </Text>
            <Button title="点击加载内容" onPress={this.loadRemoteContent} />
          </View>

          {this.renderWebClientContent()}
        </ScrollView>
      </View>
    );
  }

  renderWebClientContent() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    } else if (this.state.ui) {
      return <WebClientView metadata={this.state.ui} data={this.state.data} />;
    }
  }

  loadRemoteContent() {
    this.setState({
      isLoading: true,
      ui: null,
      data: null
    });

    Promise.all([
      fetch("https://raw.githubusercontent.com/stainboy/tinder/master/server/wwwroot/sales_order_listview.xml")
        .then(res => res.text())
        .then(res => this.promiseParseString(res)),
      fetch("https://raw.githubusercontent.com/stainboy/tinder/master/server/wwwroot/sales_order_list.json").then(res =>
        res.json()
      ),
      new Promise(resolve => setTimeout(resolve, 500))
    ])
      .then(([ui, data]) => {
        this.setState({
          isLoading: false,
          ui: ui,
          data: data
        });
        // console.log(ui);
        // console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use
          useful development tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync(
      "https://docs.expo.io/versions/latest/guides/development-mode"
    );
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      "https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes"
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
