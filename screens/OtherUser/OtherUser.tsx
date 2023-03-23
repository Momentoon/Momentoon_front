import {
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import AutoHeightImage from "react-native-auto-height-image";
import { RootTabScreenProps } from "../../types";
import { Text, View } from "../../components/Themed";
import { firebase_db } from "../../firebaseConfig";
import { useSelector } from "react-redux";

import FoucesdIcon from "../../assets/images/common/ic_focused.png";

var { vw, vh, vmin, vmax } = require("react-native-viewport-units");

export default function OtherUser({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const reduxState: any = useSelector((state) => state);
  const [imageList, setImageList] = useState([
    {
      content: "",
      url: "",
      user: "",
    },
  ]);

  const [indicator, setIndicator] = useState([
    { name: "Moments", number: 0 },
    { name: "Followers", number: 0 },
    { name: "Following", number: 0 },
  ]);

  useEffect(() => {
    firebase_db
      .ref("/images")
      .orderByChild("user")
      .equalTo(route.params.userName)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val() != null) {
          console.log(snapshot.val());
          setImageList(Object.values(snapshot.val()));
        }
      });
  }, []);

  useEffect(() => {
    let temp = [...indicator];
    temp[0].number = imageList.length;
    setIndicator(temp);
  }, [imageList]);

  return (
    <View style={styles.container}>
      <View
        style={{ backgroundColor: "black", width: "100%", paddingBottom: 0 }}
      >
        <View
          style={{
            backgroundColor: "black",
            height: 160,
            width: "100%",
            paddingTop: 20,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View style={styles.profileImg}></View>
          <View style={{ backgroundColor: "black", alignItems: "center" }}>
            <Text style={styles.userName}>{route.params.userName}</Text>
            <View style={{ flexDirection: "row", backgroundColor: "black" }}>
              {indicator.map((a) => (
                <View style={styles.indicatorContainer}>
                  <Text style={styles.indicatorText}>{a.number}</Text>
                  <Text style={styles.indicatorText}>{a.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "black",
            width: "100%",
            justifyContent: "space-around",
          }}
        ></View>
      </View>
      <View style={{ backgroundColor: "black" }}>
        <ScrollView
          style={{
            width: 100 * vw,
            marginBottom: 200,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
              backgroundColor: "black",
              paddingLeft: 18,
              paddingRight: 18,
            }}
          >
            {imageList.map((a) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.push("ArticleDetail", { contents: a });
                }}
              >
                <AutoHeightImage
                  source={{ uri: a.url }}
                  width={45 * vw}
                  style={{
                    marginBottom: 20,
                    borderRadius: 10,
                  }}
                ></AutoHeightImage>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
    marginRight: 10,
    backgroundColor: "gray",
  },
  userName: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  indicatorContainer: {
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    marginRight: 5,
    marginLeft: 5,
    marginTop: 20,
  },
  indicatorText: {
    fontWeight: "700",
    fontSize: 18,
    color: "white",
  },
  menuText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    width: 100,
    justifyContent: "center",
  },
  focusedIcon: {
    marginTop: 5,
    width: 8,
    height: 8,
  },
});
