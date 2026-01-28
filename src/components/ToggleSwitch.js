import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";

const ToggleSwitch = ({ label, onValueChange, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.button, value === "Yes" && styles.activeButton]}
          onPress={() => onValueChange("Yes")}
        >
          <Text
            style={[styles.buttonText, value === "Yes" && styles.activeText]}
          >
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, value === "No" && styles.activeButton]}
          onPress={() => onValueChange("No")}
        >
          <Text
            style={[styles.buttonText, value === "No" && styles.activeText]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: "row",
    height: 50,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray,
  },
  activeText: {
    color: COLORS.darkGray,
  },
});

export default ToggleSwitch;
