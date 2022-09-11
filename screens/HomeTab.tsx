import {
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  FlatList,
  ListRenderItem,
  Dimensions,
} from "react-native";
import { useState, useEffect, ReactElement } from "react";
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
    { url: "https://i.imgur.com/8N4eONn.png" },
  ]);

  const dimensions = Dimensions.get("window");
  const screenWidth = dimensions.width;

  useEffect(() => {
    firebase_db
      .ref("/images")
      .once("value")
      .then((snapshot) => {
        console.log("파베 연동");
        setImageList(snapshot.val());
      });
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

  return (
    <View style={styles.container}>
      {/*최근 게시글, 팔로잉 게시글 선택*/}
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
            {/*
            <FlatList
              style={{ flex: 1, width: screenWidth }}
              numColumns={2}
              data={imageList}
              renderItem={({ item }: { item: ImageObject }) => {
                return <RenderImage url={item.url}></RenderImage>;
              }}
            ></FlatList>
            */}
            <ScrollView
              style={{
                width: 100 * vw,
                marginBottom: 50,
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
                  <AutoHeightImage
                    source={{ uri: a.url }}
                    width={45 * vw}
                    style={{
                      marginBottom: 20,
                      borderRadius: 10,
                    }}
                  ></AutoHeightImage>
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
