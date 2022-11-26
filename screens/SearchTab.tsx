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
import { SearchBar } from "react-native-elements";
import { firebase_db } from "../firebaseConfig";

var { vw, vh, vmin, vmax } = require("react-native-viewport-units");

export default function SearchTab({
  navigation,
}: RootTabScreenProps<"SearchTab">) {
  const wait = (timeout: any) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const [imageList, setImageList] = useState([
    {
      content: "",
      url: "",
      user: "",
    },
  ]);

  const [search, setSearch] = useState("");

  const searchFilterFunction = (text: String) => {
    setSearch(text);
    if (text != "") {
      firebase_db
        .ref("/images")
        .orderByChild("content")
        .equalTo(text)
        .once("value")
        .then((snapshot) => {
          if (snapshot.val() != null) {
            setImageList(snapshot.val());
            console.log(imageList);
          } else {
            setImageList([
              {
                content: "",
                url: "",
                user: "",
              },
            ]);
          }
        });
    } else {
      setImageList([
        {
          content: "",
          url: "",
          user: "",
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/*최근 게시글, 팔로잉 게시글 선택*/}
      <View style={{ marginTop: 32, backgroundColor: "black" }}>
        <SearchBar
          //searchIcon={{ size: 24 }}
          placeholder="Search for moment.."
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
        />
        <View style={{ backgroundColor: "black" }}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});
