import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";

const VerificationSuccessScreen = () => {
  const { refreshUserVerification } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={100} color={COLORS.success} />
        <Text style={styles.title}>Details Submitted!</Text>
        <Text style={styles.subtitle}>
          Thank you for providing your details. Your account is now active and
          you can proceed to the dashboard.
        </Text>
      </View>
      {/* THE DEFINITIVE FIX: This now calls the function that resets the navigator */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => refreshUserVerification("Pending")}
      >
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: 30,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.darkGray,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default VerificationSuccessScreen;
