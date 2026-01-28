import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const KpiCard = ({ value, label, iconName }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={iconName} size={18} color={COLORS.darkGray} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkGray,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
    alignSelf: "flex-start",
  },
});

export default KpiCard;
