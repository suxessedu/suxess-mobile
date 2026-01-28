import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const VerificationScreen = ({ navigation }) => {
  const { user, refreshUserVerification } = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nin, setNin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!phoneNumber || !nin) {
      Alert.alert("Error", "Please provide both your phone number and NIN.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/users/submit-verification", { phoneNumber, nin });

      if (user.role === "parent") {
        // THE DEFINITIVE FIX: For parents, we immediately update the state and navigate.
        refreshUserVerification("Pending");
        navigation.replace("VerificationSuccess");
      } else {
        // Teacher
        Alert.alert(
          "Submission Received",
          "Your verification details have been submitted for review. You will be notified once approved.",
          [{ text: "OK", onPress: () => refreshUserVerification("Pending") }]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Could not submit your details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Identity Verification</Text>
      </View>
      <View style={styles.content}>
        <Ionicons
          name="shield-checkmark-outline"
          size={80}
          color={COLORS.primary}
        />
        <Text style={styles.subtitle}>
          For the safety of our community, we require all users to complete a
          one-time identity verification.
        </Text>

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 08012345678"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>National Identification Number (NIN)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your 11-digit NIN"
          keyboardType="number-pad"
          value={nin}
          onChangeText={setNin}
          maxLength={11}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.darkGray} />
          ) : (
            <Text style={styles.buttonText}>Submit for Verification</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: COLORS.darkGray },
  content: { flex: 1, padding: 20, alignItems: "center" },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
    alignSelf: "flex-start",
    width: "100%",
  },
  input: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: "100%",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    height: 55,
    justifyContent: "center",
    width: "100%",
  },
  buttonText: { color: COLORS.darkGray, fontSize: 18, fontWeight: "600" },
});

export default VerificationScreen;
