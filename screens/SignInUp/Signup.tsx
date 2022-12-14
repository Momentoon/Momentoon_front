import React, { useState } from "react";
import { Text, View } from "../../components/Themed";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { signup } from "../../firebaseConfig";

function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [PW, setPW] = useState("");
  const [confirmPW, setConfirmPW] = useState("");

  const signupEvent = async () => {
    if (PW !== confirmPW) {
      alert("Check Password!");
    } else {
      try {
        await signup(email, PW);
        navigation.pop();
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <View style={{ backgroundColor: "black", alignItems: "center" }}>
      <Text style={styles.logo}>MOMENTOON</Text>
      <TextInput
        style={styles.textInput}
        placeholder="E-mail"
        onChange={(e) => {
          setEmail(e.nativeEvent.text);
        }}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        onChange={(e) => {
          setPW(e.nativeEvent.text);
        }}
        autoCapitalize="none"
        secureTextEntry={true}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Confirm Password"
        onChange={(e) => {
          setConfirmPW(e.nativeEvent.text);
        }}
        autoCapitalize="none"
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={{ width: "100%", alignItems: "center" }}
        onPress={signupEvent}
      >
        <View style={styles.signinBtn}>
          <Text style={styles.signinText}>Sign Up</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginTop: 150,
    marginBottom: 91,
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 28,
    color: "white",
  },
  textInput: {
    width: "80%",
    height: 37,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    paddingLeft: 14,
    paddingRight: 14,
    marginTop: 28,
  },
  signinBtn: {
    width: "80%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#124FEE",
    marginTop: 37,
    borderRadius: 8,
  },
  signinText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});

export default Signup;
