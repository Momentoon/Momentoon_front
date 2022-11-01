import { useState, useEffect, useRef, useCallback } from "react";
import { Text, View } from "../../components/Themed";
import AutoHeightImage from "react-native-auto-height-image";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

var { vw, vh, vmin, vmax } = require("react-native-viewport-units");

export default function CreateModal2({ route, navigation }) {
  const [content, setContent] = useState("");

  function test() {
    console.log("test");
  }

  useEffect(() => {
    navigation.setParams({ test: test });
  }, []);

  return (
    <View
      style={{
        paddingLeft: "6%",
        paddingRight: "6%",
        backgroundColor: "black",
      }}
    >
      <ScrollView>
        <AutoHeightImage
          source={{ uri: route.params.imageURI }}
          width={88 * vw}
          style={{
            marginTop: 20,
            borderRadius: 10,
          }}
        />

        <TextInput
          multiline={true}
          numberOfLines={4}
          style={styles.textArea}
          placeholder="Please enter information about your moment"
          onChangeText={(text) => {
            setContent(text);
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  textArea: {
    backgroundColor: "white",
    height: 200,
    padding: 20,
    marginTop: 50,
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
