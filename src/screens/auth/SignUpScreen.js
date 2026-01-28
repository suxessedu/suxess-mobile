import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [role, setRole] = useState("parent");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/auth/register", {
        fullName,
        email,
        password,
        role,
      });

      Alert.alert(
        "Success",
        "Your account has been created successfully. Please log in.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error) {
      if (error.response) {
        console.error("DATA:", error.response.data);
        console.error("STATUS:", error.response.status);
        const message =
          error.response.data.message || "The server responded with an error.";
        Alert.alert("Registration Failed", message);
      } else if (error.request) {
        console.error("REQUEST:", error.request);
        Alert.alert(
          "Network Error",
          "Could not connect to the server. Please check your network and the server IP address."
        );
      } else {
        console.error("Error", error.message);
        Alert.alert(
          "Error",
          "An unknown error occurred while setting up the request."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>
          Start your journey with Suxess.
        </Text>

        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "parent" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("parent")}
          >
            <Text
              style={[
                styles.roleText,
                role === "parent" && styles.roleTextActive,
              ]}
            >
              I'm a Parent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "teacher" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("teacher")}
          >
            <Text
              style={[
                styles.roleText,
                role === "teacher" && styles.roleTextActive,
              ]}
            >
              I'm a Teacher
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={COLORS.gray}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                secureTextEntry={!isPasswordVisible}
                placeholderTextColor={COLORS.gray}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignUp}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.darkGray} />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 30,
  },
  roleSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roleText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray,
  },
  roleTextActive: {
    color: COLORS.darkGray,
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  signupButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    height: 55,
    justifyContent: "center",
  },
  signupButtonText: {
    color: COLORS.darkGray,
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  loginText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
