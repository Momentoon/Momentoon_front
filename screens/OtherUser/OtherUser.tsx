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

  const [followingOrNot, setFollowingOrNot] = useState(false);

  const [myUserIdx, setMyUserIdx] = useState(0);
  const [myFollowingNum, setMyFollowingNum] = useState(0);
  const [otherUserIdx, setOtherUserIdx] = useState(0);

  const [followerIdx, setFollowerIdx] = useState(0);
  const [followingIdx, setFollowingIdx] = useState(0);

  useEffect(() => {
    //이미지 리스트 가져오기
    firebase_db
      .ref("/images")
      .orderByChild("user")
      .equalTo(route.params.userName)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val() != null) {
          //console.log(snapshot.val());
          setImageList(Object.values(snapshot.val()));
        }
      });

    //내가 해당 유저 팔로우 중인지 아닌지 확인
    firebase_db
      .ref("/users")
      .orderByChild("email")
      .equalTo(reduxState.currentUser)
      .once("value")
      .then((snapshot) => {
        var data = Object.values(snapshot.val())[0];
        var followingList = data.following;
        //setMyFollowingNum(followingList.length());
        if (followingList.includes(route.params.userName)) {
          //console.log(followingList.indexOf(route.params.userName));
          setFollowingIdx(followingList.indexOf(route.params.userName));
          setFollowingOrNot(true);
        }
        setMyUserIdx(data.idx);
        setMyFollowingNum(followingList.length);
      });

    firebase_db
      .ref("/users")
      .orderByChild("email")
      .equalTo(route.params.userName)
      .once("value")
      .then((snapshot) => {
        var data = Object.values(snapshot.val())[0];
        var followerList = data.followers;

        setOtherUserIdx(data.idx);
        console.log(otherUserIdx);

        if (followerList.includes(reduxState.currentUser)) {
          //console.log(followerList.indexOf(reduxState.currentUser));
          setFollowerIdx(followerList.indexOf(reduxState.currentUser));
        }

        let temp = [...indicator];
        temp[1].number = data.followers.length - 1;
        temp[2].number = data.following.length - 1;

        setIndicator(temp);
      });
  }, [, followingOrNot]);

  useEffect(() => {
    let temp = [...indicator];
    temp[0].number = imageList.length;
    setIndicator(temp);
  }, [imageList]);

  const followUser = async () => {
    const reference = firebase_db.ref();
    const myRef = reference.child(
      `/users/${myUserIdx}/following/${myFollowingNum}`
    );
    myRef.set(route.params.userName);

    const otherRef = reference.child(
      `/users/${otherUserIdx}/followers/${indicator[1].number + 1}`
    );
    otherRef.set(reduxState.currentUser);

    setFollowingOrNot(true);
  };

  const unFollowUser = () => {
    const reference = firebase_db.ref();
    const myRef = reference.child(
      `/users/${myUserIdx}/following/${followingIdx}`
    );
    myRef.remove();

    const otherRef = reference.child(
      `/users/${otherUserIdx}/followers/${followerIdx}`
    );
    otherRef.remove();

    setFollowingOrNot(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "black",
          width: "100%",
          paddingBottom: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "black",
            height: 140,
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
        {followingOrNot ? (
          <TouchableOpacity style={{ width: "90%" }} onPress={unFollowUser}>
            <View style={styles.unFollowBtn}>
              <Text style={styles.unFollowText}>Unfollow</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ width: "90%" }} onPress={followUser}>
            <View style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </View>
          </TouchableOpacity>
        )}
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
  followBtn: {
    height: 45,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "#124FEE",
    justifyContent: "center",
    alignItems: "center",
  },
  followText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  unFollowBtn: {
    height: 45,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "#C4C4C4",
    justifyContent: "center",
    alignItems: "center",
  },
  unFollowText: {
    color: "black",
    fontSize: 20,
    fontWeight: "700",
  },
});
