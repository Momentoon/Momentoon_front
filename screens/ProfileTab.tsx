import {
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  FlatList,
  ListRenderItem,
  Dimensions,
  Platform,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import AutoHeightImage from "react-native-auto-height-image";
import { RootTabScreenProps } from "../types";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { firebase_db } from "../firebaseConfig";
import { useSelector } from "react-redux";

var { vw, vh, vmin, vmax } = require("react-native-viewport-units");

export default function ProfileTab({
  navigation,
}: RootTabScreenProps<"ProfileTab">) {
  const reduxState: any = useSelector((state) => state);
  const [imageList, setImageList] = useState([
    {
      content: "",
      url: "",
      user: "",
    },
  ]);

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "black",
          height: 259,
          width: "100%",
          paddingTop: 60,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View style={styles.profileImg}></View>
        <View style={{ backgroundColor: "black" }}>
          <Text style={styles.userName}>{reduxState.currentUser}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  profileImg: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "gray",
  },
  userName: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
});
