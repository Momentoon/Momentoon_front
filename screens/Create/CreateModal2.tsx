import { useState, useEffect, useRef, useCallback } from "react";
import { Text, View } from "../../components/Themed";
import AutoHeightImage from "react-native-auto-height-image";
import { firebase_storage } from "../../firebaseConfig";
import { firebase_db } from "../../firebaseConfig";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";

var { vw, vh, vmin, vmax } = require("react-native-viewport-units");

export default function CreateModal2({ route, navigation }) {
  const [content, setContent] = useState("");
  const [postNum, setPostNum] = useState(0);
  const reduxState: any = useSelector((state) => state);

  const uploadBtnTapped = async () => {
    //console.log("test");
    //console.log(content);
    uploadStorage(route.params.imageURI, uuidv4());
  };

  /*이미지 파이어베이스 스토리지에 업로드*/
  const uploadStorage = async (uri: string, name: String) => {
    name = "tempN_" + name + ".jpg";
    const reference = firebase_storage.ref(`/images/COMPLETE/${name}`);

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
        const reference = firebase_db.ref(`/images/${snapshot.val().length}`);
        await reference.update({
          url: imgURL,
          content: content,
          user: reduxState.currentUser,
        });
        navigation.pop(2);
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

  useEffect(() => {
    navigation.setParams({ uploadBtnTapped: uploadBtnTapped });
  }, [content]);

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
