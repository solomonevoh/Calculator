import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

function Buttons({ text = 0, colour = "#FFFF", onPress }) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colour }]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          { color: colour === "#FFFF" ? "#292b2c" : "#FFFF" },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    marginVertical: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.075,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: "500",
  },
});

export default Buttons;
