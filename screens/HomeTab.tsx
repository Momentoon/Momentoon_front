import { StyleSheet, Image, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { withSafeAreaInsets } from "react-native-safe-area-context";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import FoucesdIcon from "../assets/images/common/ic_focused.png";
import { firebase_db } from "../firebaseConfig";

export default function HomeTab({ navigation }: RootTabScreenProps<"TabOne">) {
  const [feedMenu, setFeedMenu] = useState("recent");
  const [imageList, setImageList] = useState([{ url: "" }]);

  useEffect(() => {
    firebase_db
      .ref("/images")
      .once("value")
      .then((snapshot) => {
        console.log("파베 연동");
        setImageList(snapshot.val());

        console.log(imageList);
      });
  }, []);

  return (
    <View style={styles.container}>
      {/*<Text style={styles.title}>홈화면</Text>*/}
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
            <Text style={{ color: "white" }}>전체보기</Text>
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
    paddingLeft: 18,
    paddingRight: 18,
    //alignItems: "center",
    //justifyContent: "center",
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
