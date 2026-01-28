import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const ProfileAlertBanner = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons name="alert-circle-outline" size={24} color={COLORS.darkGray} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Your profile is incomplete.</Text>
        <Text style={styles.subtitle}>
          Click here to complete it and see requests.
        </Text>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color={COLORS.darkGray}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 2,
  },
});

export default ProfileAlertBanner;
