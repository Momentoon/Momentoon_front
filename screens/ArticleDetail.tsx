import React, { useState } from "react";
import { Text, View } from "../components/Themed";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
import { AntDesign } from "@expo/vector-icons";

var { vw, vh, vmin, vmax } = require("react-native-viewport-units");

export default function ArticleDetail({ route, navigation }) {
  return (
    <View
      style={{
        paddingLeft: "6%",
        paddingRight: "6%",
        backgroundColor: "black",
      }}
    >
      <ScrollView>
        <View style={styles.contentHeader}>
          <View
            style={{
              backgroundColor: "black",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.profileImg}></View>
            <Text style={styles.userName}>{route.params.contents.user}</Text>
          </View>
          <AntDesign name="adduser" size={25} color="white" style={{}} />
        </View>
        <AutoHeightImage
          source={{ uri: route.params.contents.url }}
          width={88 * vw}
          style={{
            marginTop: 20,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            backgroundColor: "black",
            marginTop: 20,
            flexDirection: "row",
            marginBottom: 30,
          }}
        >
          <AntDesign
            name="hearto"
            size={24}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.contentText}>0</Text>
        </View>
        <Text style={styles.contentText}>{route.params.contents.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentHeader: {
    marginTop: 20,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImg: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "gray",
  },
  userName: {
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 20,
    color: "#FFFFFF",
    marginLeft: 10,
  },
  contentText: {
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 20,
    color: "white",
  },
});
