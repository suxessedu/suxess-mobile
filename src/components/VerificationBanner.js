import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const VerificationBanner = ({ onPress, status }) => {
  const isPending = status === "Pending";
  const title = isPending
    ? "Verification Pending"
    : "Complete Your Verification";
  const subtitle = isPending
    ? "Your documents are under review by our team."
    : "Verify your identity to ensure community safety.";

  return (
    <TouchableOpacity
      style={[styles.container, isPending && styles.pendingContainer]}
      onPress={onPress}
      disabled={isPending}
    >
      <Ionicons
        name={isPending ? "hourglass-outline" : "alert-circle-outline"}
        size={24}
        color={isPending ? COLORS.darkGray : COLORS.darkGray}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {!isPending && (
        <Ionicons name="arrow-forward" size={24} color={COLORS.darkGray} />
      )}
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
  pendingContainer: {
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: "#E0E0E0",
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
    color: COLORS.gray,
    marginTop: 2,
  },
});

export default VerificationBanner;
