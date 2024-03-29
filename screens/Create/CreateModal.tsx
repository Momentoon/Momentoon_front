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
import * as RNFS from "react-native-fs";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import ImagePicker from "react-native-image-crop-picker";
import ColorPicker from "react-native-color-picker-ios";
import PhotoEditor from "@baronha/react-native-photo-editor";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import ViewShot from "react-native-view-shot";
import { firebase_storage } from "../../firebaseConfig";
import { firebase_db } from "../../firebaseConfig";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootTabScreenProps } from "../../types";
import { async } from "@firebase/util";

export default function CreateModal({
  navigation,
}: RootTabScreenProps<"Create">) {
  const viewShotRef = useRef<any>();

  const [currentMode, setCurrentMode] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  const [postNum, setPostNum] = useState(0);

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

  const [frameList, setFrameList] = useState([
    { title: "round", img: "https://i.imgur.com/PqvaCiD.png" },
    { title: "edge", img: "https://i.imgur.com/ciqfP0h.png" },
  ]);

  const [filterList, setFilterList] = useState([
    { title: "Sample", img: "https://i.imgur.com/vNDL3Yf.png" },
    { title: "Miyazaki Hayao", img: "https://i.imgur.com/p6ATCrH.jpg" },
    { title: "Shinkai Makoto", img: "https://i.imgur.com/tiCetNQ.jpg" },
    { title: "Wind Breaker A", img: "https://i.imgur.com/3VwVSjp.png" },
    { title: "Wind Breaker B", img: "https://i.imgur.com/7Eq2HC0.jpg" },
  ]);

  const [originalImageList, setOriginalImageList] = useState([
    { url: "", width: 160 },
    { url: "", width: 160 },
    { url: "", width: 160 },
    { url: "", width: 160 },
  ]);

  const [imageList, setImageList] = useState([
    { url: "", width: 160 },
    { url: "", width: 160 },
    { url: "", width: 160 },
    { url: "", width: 160 },
  ]);
  const stickers: Array<String> = [
    "https://i.imgur.com/NFqEru4.png",
    "https://i.imgur.com/HWT11rm.png",
    "https://i.imgur.com/z6Ouc9D.png",
  ];

  /*필터링 적용 함수*/
  const filtering = async (filterIdx: Number) => {
    originalImageList.map(async (a, i) => {
      //console.log(a.url);

      if (a.url != "") {
        var name = uuidv4();

        if (filterIdx == 0) {
          name = "tempN_" + name + ".jpg";
        } else {
          name = `temp${filterIdx}_${name}.jpg`;
        }

        console.log(name);

        const reference = firebase_storage.ref(`/images/UPLOAD/${name}`);
        await reference.put(await uriToBlob(encodeURI(a.url)));

        const getRef = await firebase_storage.ref(
          `/images/FILTERED/FCResult${name}`
        );

        while (1) {
          try {
            var test = await getRef.getDownloadURL();
            var tempList = [...imageList];
            tempList[i].url = test;
            setImageList(tempList);
            break;
          } catch (err) {
            console.log(err);
          }
        }
      }
    });
  };

  /*갤러리에서 이미지 가져오기*/
  const choosePhotoFromLibrary = (i: number) => {
    console.log("이미지 선택");
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      freeStyleCropEnabled: true,
    }).then((image) => {
      var temp = [...imageList];
      temp[i].url = image.path;
      setImageList(temp);

      var temp2 = [...originalImageList];
      temp2[i].url = image.path;
      setOriginalImageList(temp2);
    });
  };

  /*프레임추가*/
  const addFrame = () => {
    var temp = [...imageList];
    temp.push({ url: "", width: 160 });
    setImageList(temp);

    var temp2 = [...originalImageList];
    temp2.push({ url: "", width: 160 });
    setOriginalImageList(temp2);
  };

  /*프레임 삭제*/
  const deleteFrame = (i: number) => {
    var temp = [...imageList];
    temp.splice(i, 1);
    setImageList(temp);

    var temp2 = [...originalImageList];
    temp2.splice(i, 1);
    setOriginalImageList(temp2);
  };

  /*프레임 사이즈 조절*/
  const resizeFrame = (i: number) => {
    var temp = [...imageList];
    temp[i].width == 160 ? (temp[i].width = 350) : (temp[i].width = 160);
    setImageList(temp);

    var temp2 = [...originalImageList];
    temp2[i].width == 160 ? (temp2[i].width = 350) : (temp2[i].width = 160);
    setOriginalImageList(temp2);
  };

  /*완성된 이미지 추출*/
  const captureViewShot = async () => {
    const imageURI = await viewShotRef.current.capture();
    navigation.navigate("Create2", { imageURI: imageURI });
    //uploadStorage(imageURI, uuidv4());
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

  //말풍선 편집 실행
  const openBubbleEditor = async (i: number) => {
    try {
      var path;
      if (imageList[i].url.startsWith("https")) {
        path = imageList[i].url;
      } else {
        path = "file://" + imageList[i].url;
      }
      const result = await PhotoEditor.open({
        path,
        stickers,
      });
      const result2: string = result.toString();
      var temp = [...imageList];
      temp[i].url = result2;
      setImageList(temp);
    } catch (e) {
      console.log("error", e);
      //setCurrentMode(0);
    } finally {
      console.log("finally");
      //setCurrentMode(0);
    }
  };

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

    /*
    if (currentMode == 3) {
      console.log("test");
      openEditor();
    }*/
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
                  paddingBottom: 25,
                }}
              >
                {imageList.map((a, i) => (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        choosePhotoFromLibrary(i);
                      }}
                    >
                      {currentFrame == 0 ? (
                        <View
                          style={{
                            width: a.width,
                            height: 160,
                            marginBottom: 17,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            borderStyle: "solid",
                            borderWidth: 1,
                            borderColor: "black",
                          }}
                        >
                          {a.url === "" ? (
                            <FontAwesome
                              name="camera"
                              size={50}
                              color="black"
                            />
                          ) : (
                            <Image
                              source={{ uri: a.url }}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 10,
                              }}
                            ></Image>
                          )}
                        </View>
                      ) : (
                        <View
                          style={{
                            width: a.width,
                            height: 160,
                            marginBottom: 17,
                            justifyContent: "center",
                            alignItems: "center",
                            borderStyle: "solid",
                            borderWidth: 1,
                            borderColor: "black",
                          }}
                        >
                          {a.url === "" ? (
                            <FontAwesome
                              name="camera"
                              size={50}
                              color="black"
                            />
                          ) : (
                            <Image
                              source={{ uri: a.url }}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                            ></Image>
                          )}
                        </View>
                      )}
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
                backgroundColor: "#124FEE",
                marginTop: 25,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={captureViewShot}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
              >
                Complete
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : currentMode === 1 ? ( //프레임 편집 모드
        <>
          <ScrollView style={{ width: "100%", backgroundColor: bgColor }}>
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
                  {currentFrame == 0 ? (
                    <View
                      style={{
                        width: a.width,
                        height: 160,
                        marginBottom: 17,
                        borderRadius: 10,
                        borderColor: "black",
                        borderStyle: "solid",
                        borderWidth: 1,
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
                        {a.url === "" ? (
                          <FontAwesome name="camera" size={50} color="black" />
                        ) : (
                          <Image
                            source={{ uri: a.url }}
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

                      <TouchableOpacity
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          position: "absolute",
                          backgroundColor: "#ADADAD",
                          marginTop: 60,
                          alignSelf: a.width == 160 ? "baseline" : "flex-end",
                          alignItems: "center",
                          justifyContent: "center",
                          borderColor: "black",
                        }}
                        onPress={() => {
                          resizeFrame(i);
                        }}
                      >
                        <AntDesign name="arrowleft" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          position: "absolute",
                          backgroundColor: "#ADADAD",
                          marginTop: 60,
                          alignSelf: a.width == 160 ? "flex-end" : "baseline",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          resizeFrame(i);
                        }}
                      >
                        <AntDesign name="arrowright" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: a.width,
                        height: 160,
                        marginBottom: 17,
                        borderColor: "black",
                        borderStyle: "solid",
                        borderWidth: 1,
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
                        {a.url === "" ? (
                          <FontAwesome name="camera" size={50} color="black" />
                        ) : (
                          <Image
                            source={{ uri: a.url }}
                            style={{
                              width: "100%",
                              height: "100%",
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

                      <TouchableOpacity
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          position: "absolute",
                          backgroundColor: "#ADADAD",
                          marginTop: 60,
                          alignSelf: a.width == 160 ? "baseline" : "flex-end",
                          alignItems: "center",
                          justifyContent: "center",
                          borderColor: "black",
                        }}
                        onPress={() => {
                          resizeFrame(i);
                        }}
                      >
                        <AntDesign name="arrowleft" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          position: "absolute",
                          backgroundColor: "#ADADAD",
                          marginTop: 60,
                          alignSelf: a.width == 160 ? "flex-end" : "baseline",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          resizeFrame(i);
                        }}
                      >
                        <AntDesign name="arrowright" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ))}

              <TouchableOpacity onPress={addFrame}>
                {currentFrame == 0 ? (
                  <View
                    style={{
                      width: 160,
                      height: 160,
                      marginBottom: 17,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: "black",
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  >
                    <FontAwesome name="plus" size={50} color="black" />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 160,
                      height: 160,
                      marginBottom: 17,
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: "black",
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  >
                    <FontAwesome name="plus" size={50} color="black" />
                  </View>
                )}
              </TouchableOpacity>
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
              {frameList.map((a, i) => (
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
                      setCurrentFrame(i);
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
                      <Image
                        source={{ uri: a.img }}
                        style={{ width: 50, height: 50 }}
                      ></Image>
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
                backgroundColor: "#124FEE",
                marginTop: 25,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setCurrentMode(0);
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
              >
                Complete
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : currentMode === 3 ? ( //말풍선 편집 모드
        <>
          <ScrollView style={{ width: "100%", backgroundColor: bgColor }}>
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
                  {currentFrame == 0 ? (
                    <View
                      style={{
                        width: a.width,
                        height: 160,
                        marginBottom: 17,
                        borderRadius: 10,
                        borderColor: "black",
                        borderStyle: "solid",
                        borderWidth: 1,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          openBubbleEditor(i);
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
                          {a.url === "" ? (
                            <FontAwesome
                              name="camera"
                              size={50}
                              color="black"
                            />
                          ) : (
                            <Image
                              source={{ uri: a.url }}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 10,
                              }}
                            ></Image>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: a.width,
                        height: 160,
                        marginBottom: 17,
                        borderColor: "black",
                        borderStyle: "solid",
                        borderWidth: 1,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          openBubbleEditor(i);
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
                          {a.url === "" ? (
                            <FontAwesome
                              name="camera"
                              size={50}
                              color="black"
                            />
                          ) : (
                            <Image
                              source={{ uri: a.url }}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                            ></Image>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ))}
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
                backgroundColor: "#124FEE",
                marginTop: 25,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setCurrentMode(0);
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
              >
                Complete
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : currentMode === 2 ? ( //필터선택모드
        <>
          <ScrollView style={{ width: "100%", backgroundColor: bgColor }}>
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
                  {currentFrame == 0 ? (
                    <View
                      style={{
                        width: a.width,
                        height: 160,
                        marginBottom: 17,
                        borderRadius: 10,
                        borderColor: "black",
                        borderStyle: "solid",
                        borderWidth: 1,
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
                        {a.url === "" ? (
                          <FontAwesome name="camera" size={50} color="black" />
                        ) : (
                          <Image
                            source={{ uri: a.url }}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 10,
                            }}
                          ></Image>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: a.width,
                        height: 160,
                        marginBottom: 17,
                        borderColor: "black",
                        borderStyle: "solid",
                        borderWidth: 1,
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
                        {a.url === "" ? (
                          <FontAwesome name="camera" size={50} color="black" />
                        ) : (
                          <Image
                            source={{ uri: a.url }}
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          ></Image>
                        )}
                      </View>
                    </View>
                  )}
                </>
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
            <ScrollView horizontal={true}>
              <View
                style={{
                  width: "100%",
                  backgroundColor: "black",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {filterList.map((a, i) => (
                  <View
                    style={{
                      flex: 0.2,
                      aspectRatio: 0.7,
                      backgroundColor: "black",
                      marginTop: 10,
                      marginLeft: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        filtering(i);
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
                        <Image
                          source={{ uri: a.img }}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 10,
                          }}
                        ></Image>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        backgroundColor: "black",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {a.title}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={{
                width: "90%",
                height: 48,
                backgroundColor: "#124FEE",
                marginBottom: 100,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setCurrentMode(0);
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
              >
                Complete
              </Text>
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
