import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useState, useEffect } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import ImagePicker from "react-native-image-crop-picker";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function CreateModal() {
  /*
  useEffect(() => {
    [...Array(currentFrameNum)].map((a) => {
      console.log(a);
    });
  }, []);*/

  const dimensions = Dimensions.get("window");
  const screenHeight = dimensions.height;

  const [menuList, setMenuList] = useState([
    {
      title: "Frame",
      icon: (
        <MaterialCommunityIcons name="image-frame" size={50} color="black" />
      ),
    },
    {
      title: "Filter",
      icon: (
        <MaterialIcons name="face-retouching-natural" size={50} color="black" />
      ),
    },
    {
      title: "Bubble",
      icon: <SimpleLineIcons name="bubbles" size={50} color="black" />,
    },
    {
      title: "Back-\nground",
      icon: <FontAwesome name="image" size={50} color="black" />,
    },
  ]);

  const [imageList, setImageList] = useState(["", "", "", ""]);

  //const [currentFrameNum, setCurrentFrameNum] = useState(4);

  const choosePhotoFromLibrary = (i: number) => {
    console.log("이미지 선택");
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      //console.log(image);
      var temp = [...imageList];
      temp[i] = image.path;
      setImageList(temp);
    });
  };

  return (
    <View style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

      <ScrollView style={{ width: "100%", backgroundColor: "black" }}>
        <View
          style={{
            width: "100%",
            backgroundColor: "black",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            marginTop: 50,
          }}
        >
          {imageList.map((a, i) => (
            <TouchableOpacity
              onPress={() => {
                choosePhotoFromLibrary(i);
              }}
            >
              <View
                style={{
                  width: 160,
                  height: 160,
                  marginBottom: 17,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {a === "" ? (
                  <FontAwesome name="camera" size={50} color="black" />
                ) : (
                  <Image
                    source={{ uri: a }}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                  ></Image>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View
        style={{
          width: "100%",
          height: 300,
          backgroundColor: "black",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "black",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {menuList.map((a) => (
            <View
              style={{
                flex: 0.2,
                aspectRatio: 0.7,
                backgroundColor: "black",
                marginTop: 10,
              }}
            >
              <TouchableOpacity>
                <View
                  style={{
                    aspectRatio: 1,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {a.icon}
                </View>
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: "black",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {a.title}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={{
            width: "90%",
            height: 48,
            backgroundColor: "#C4C4C4",
            marginTop: 25,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Complete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  completeBtn: {
    height: 48,
  },
});
