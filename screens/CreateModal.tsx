import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useState, useEffect, useRef } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import ImagePicker from "react-native-image-crop-picker";
import ColorPicker from "react-native-color-picker-ios";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import ViewShot from "react-native-view-shot";
import { firebase_storage } from "../firebaseConfig";
import { firebase_db } from "../firebaseConfig";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootTabScreenProps } from "../types";

export default function CreateModal({
  navigation,
}: RootTabScreenProps<"Create">) {
  const viewShotRef = useRef<any>();

  const [currentMode, setCurrentMode] = useState(0);

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

  /*갤러리에서 이미지 가져오기*/
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

  /*프레임추가*/
  const addFrame = () => {
    var temp = [...imageList];
    temp.push("");
    setImageList(temp);
  };

  /*프레임 삭제*/
  const deleteFrame = (i: number) => {
    var temp = [...imageList];
    temp.splice(i, 1);
    setImageList(temp);
  };

  /*완성된 이미지 추출*/
  const captureViewShot = async () => {
    const imageURI = await viewShotRef.current.capture();
    //console.log(imageURI);
    /*
    console.log(imageURI);
    var test = [...imageList];
    test[0] = imageURI;
    setImageList(test);*/

    uploadStorage(imageURI, uuidv4());
  };

  /*이미지 파이어베이스 스토리지에 업로드*/
  const uploadStorage = async (uri: string, name: String) => {
    const reference = firebase_storage.ref(`/images/UPLOAD/${name}`);

    await reference.put(await uriToBlob(encodeURI(uri)));

    //console.log(await reference.getDownloadURL());
    uploadDatabase(await reference.getDownloadURL());
  };

  /*이미지 파이어베이스 리얼타임 데이터베이스에 업로드*/
  const uploadDatabase = async (imgURL: string) => {
    firebase_db
      .ref("/images")
      .once("value")
      .then(async (snapshot) => {
        //console.log(snapshot.val().length);
        const reference = firebase_db.ref(`/images/${snapshot.val().length}`);
        await reference.update({ url: imgURL });
        navigation.goBack();
      });
  };

  const uriToBlob = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  /*uuid 생성 함수*/
  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  //배경 색
  const [bgColor, setBGcolor] = useState("black");

  useEffect(() => {
    if (currentMode == 4) {
      ColorPicker.showColorPicker(
        { supportsAlpha: true, initialColor: "black" },
        (color) => {
          setCurrentMode(0);
          setBGcolor(color);
        }
      );
    }
  }, [currentMode]);

  return (
    <View style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

      {currentMode === 0 || currentMode === 4 ? ( //기본 모드
        <>
          <ScrollView style={{ width: "100%", backgroundColor: "black" }}>
            <ViewShot
              ref={viewShotRef}
              style={{ flex: 1, backgroundColor: bgColor }}
              options={{
                fileName: uuidv4(),
                format: "jpg",
                quality: 1.0,
              }}
            >
              <View
                style={{
                  width: "100%",
                  backgroundColor: bgColor,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  marginTop: 50,
                  paddingLeft: "8%",
                  paddingRight: "8%",
                }}
              >
                {imageList.map((a, i) => (
                  <>
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
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 10,
                            }}
                          ></Image>
                        )}
                      </View>
                    </TouchableOpacity>
                  </>
                ))}
              </View>
            </ViewShot>
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
              {menuList.map((a, i) => (
                <View
                  style={{
                    flex: 0.2,
                    aspectRatio: 0.7,
                    backgroundColor: "black",
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentMode(i + 1);
                    }}
                  >
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
              onPress={captureViewShot}
            >
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>Complete</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : currentMode === 1 ? ( //프레임 편집 모드
        <>
          <ScrollView style={{ width: "100%", backgroundColor: "black" }}>
            <View
              style={{
                width: "100%",
                backgroundColor: "black",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginTop: 50,
                paddingLeft: "8%",
                paddingRight: "8%",
              }}
            >
              {imageList.map((a, i) => (
                <>
                  <View
                    style={{
                      width: 160,
                      height: 160,
                      marginBottom: 17,
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                      }}
                    >
                      {a === "" ? (
                        <FontAwesome name="camera" size={50} color="black" />
                      ) : (
                        <Image
                          source={{ uri: a }}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 10,
                          }}
                        ></Image>
                      )}
                    </View>
                    <TouchableOpacity
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        position: "absolute",
                        backgroundColor: "#ADADAD",
                        alignSelf: "flex-end",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        deleteFrame(i);
                      }}
                    >
                      <Feather name="minus" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </>
              ))}

              <TouchableOpacity onPress={addFrame}>
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
                  <FontAwesome name="plus" size={50} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View
            style={{
              width: "100%",
              height: 200,
              backgroundColor: "black",
              alignItems: "center",
            }}
          >
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
              onPress={() => {
                setCurrentMode(0);
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>Complete</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
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
