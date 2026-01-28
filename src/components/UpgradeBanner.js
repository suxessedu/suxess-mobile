import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const UpgradeBanner = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("ContactAdmin")}
    >
      <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Upgrade to Suxess Assured</Text>
        <Text style={styles.subtitle}>
          Get enhanced vetting, personal support, and a replacement guarantee.
        </Text>
      </View>
      <Ionicons name="arrow-forward" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  textContainer: { flex: 1, marginHorizontal: 15 },
  title: { fontSize: 16, fontWeight: "bold", color: COLORS.darkGray },
  subtitle: { fontSize: 13, color: COLORS.gray, marginTop: 4 },
});

export default UpgradeBanner;
