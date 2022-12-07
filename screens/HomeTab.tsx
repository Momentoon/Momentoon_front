import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
  Platform,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import ArticleDetail from "./ArticleDetail";
import { useState, useEffect, ReactElement, useCallback } from "react";
import { useSelector } from "react-redux";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import AutoHeightImage from "react-native-auto-height-image";
import MasonryList from "@react-native-seoul/masonry-list";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import FoucesdIcon from "../assets/images/common/ic_focused.png";
import { firebase_db } from "../firebaseConfig";

var { vw, vh, vmin, vmax } = require("react-native-viewport-units");

export interface ImageObject {
  url: string;
}

export default function HomeTab({ navigation }: RootTabScreenProps<"TabOne">) {
  const [feedMenu, setFeedMenu] = useState("recent");
  const [imageList, setImageList] = useState([
    {
      content: "",
      url: "https://i.imgur.com/8N4eONn.png",
      user: "",
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const dimensions = Dimensions.get("window");
  const screenWidth = dimensions.width;

  const reduxState: any = useSelector((state) => state);

  useEffect(() => {
    firebase_db
      .ref("/images")
      .once("value")
      .then((snapshot) => {
        console.log("파베 연동");
        //console.log(snapshot.val());
        setImageList(snapshot.val());
      });

    console.log(reduxState.currentUser);
  }, []);

  const RenderImage = (props: ImageObject) => {
    const { url } = props;
    return (
      <View>
        <AutoHeightImage
          source={{ uri: url }}
          width={45 * vw}
          style={{
            borderRadius: 10,
          }}
        ></AutoHeightImage>
        {/*<Text style={{ color: "black" }}>{url}</Text>*/}
      </View>
    );
  };

  const wait = (timeout: any) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    firebase_db
      .ref("/images")
      .once("value")
      .then((snapshot) => {
        console.log("파베 연동");
        //console.log(snapshot.val());
        setImageList(snapshot.val());
      });
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      {/*최근 게시글, 팔로잉 게시글 선택*/}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "black",
          width: 150,
          marginTop: 20,
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={() => {
            setFeedMenu("recent");
          }}
        >
          <View
            style={{
              backgroundColor: "black",
              alignItems: "center",
              marginLeft: 18,
            }}
          >
            <Text style={styles.menuText}>Recent</Text>
            <Image
              source={FoucesdIcon}
              style={
                feedMenu == "recent" ? styles.focusedIcon : { display: "none" }
              }
            ></Image>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            setFeedMenu("follow");
          }}
        >
          <View style={{ backgroundColor: "black", alignItems: "center" }}>
            <Text style={styles.menuText}>Follow</Text>
            <Image
              source={FoucesdIcon}
              style={
                feedMenu == "follow" ? styles.focusedIcon : { display: "none" }
              }
            ></Image>
          </View>
        </Pressable>
      </View>
      <View style={{ marginTop: 20, backgroundColor: "black" }}>
        {feedMenu == "recent" ? (
          <View style={{ backgroundColor: "black" }}>
            <ScrollView
              style={{
                width: 100 * vw,
                marginBottom: 50,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="white"
                />
              }
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
                    onPress={() =>
                      navigation.navigate("ArticleDetail", { contents: a })
                    }
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
        ) : (
          <View style={{ backgroundColor: "black" }}>
            <Text style={{ color: "white" }}>팔로우만 보기</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  menuText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  focusedIcon: {
    marginTop: 5,
    width: 8,
    height: 8,
  },
});
