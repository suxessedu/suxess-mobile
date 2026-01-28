import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const RequestCard = ({
  subject,
  level,
  status,
  statusColor,
  submittedTime,
  location,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.subject}>{subject}</Text>
        <View
          style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}
        >
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status}
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.detailRow}>
          <Ionicons name="school-outline" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>{level}</Text>
        </View>
        {location && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.gray} />
            <Text style={styles.detailText}>{location}</Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.submitted}>{submittedTime}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={COLORS.gray}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  header: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  subject: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  body: {
    padding: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
  },
  footer: {
    padding: 15,
    paddingTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitted: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: "italic",
  },
});

export default RequestCard;
