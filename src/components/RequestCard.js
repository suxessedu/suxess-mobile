import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const RequestCard = ({
  subject,
  level,
  status,
  statusColor,
  submittedTime,
  schedule,
  location,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.header}>
          <View style={styles.subjectRow}>
            <View style={styles.subjectIconBg}>
              <Ionicons name="book-outline" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.subject}>{subject}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}18` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.detailRow}>
            <Ionicons name="school-outline" size={15} color={COLORS.gray} />
            <Text style={styles.detailText}>{level}</Text>
          </View>
          {schedule && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={15} color={COLORS.gray} />
              <Text style={styles.detailText}>{schedule}</Text>
            </View>
          )}
          {location && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={15} color={COLORS.gray} />
              <Text style={styles.detailText}>{location}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.submitted}>{submittedTime}</Text>
          <View style={styles.arrowBadge}>
            <Ionicons name="arrow-forward" size={14} color={COLORS.darkGray} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F6F6F6",
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  subjectIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  subject: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.darkGray,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.2 },
  body: { paddingHorizontal: 16, paddingVertical: 12 },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: { fontSize: 13, color: COLORS.gray, marginLeft: 8 },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitted: { fontSize: 12, color: COLORS.gray, fontStyle: "italic" },
  arrowBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RequestCard;
