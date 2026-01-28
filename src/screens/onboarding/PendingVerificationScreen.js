import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const PendingVerificationScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="hourglass-outline" size={100} color={COLORS.primary} />
        <Text style={styles.title}>Account Under Review</Text>
        <Text style={styles.subtitle}>
          Your verification details have been submitted and are currently being
          reviewed by our admin team. You will be notified once your account is
          approved.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
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
    backgroundColor: COLORS.lightGray,
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

export default PendingVerificationScreen;
