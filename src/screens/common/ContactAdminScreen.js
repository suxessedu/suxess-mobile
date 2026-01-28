import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

const ContactAdminScreen = ({ navigation }) => {
  const [message, setMessage] = useState(
    "I am interested in upgrading to the Suxess Assured premium plan. Please contact me with more details."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Message cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/users/contact-admin", { message });
      Alert.alert(
        "Message Sent",
        "Your request has been sent. An admin will contact you shortly via email or phone.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "Could not send your message at this time.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={COLORS.darkGray}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Contact Admin</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Ionicons
            name="mail-unread-outline"
            size={80}
            color={COLORS.primary}
          />
          <Text style={styles.subtitle}>
            Send a message directly to the Suxess admin team regarding your
            premium upgrade request.
          </Text>

          <Text style={styles.label}>Your Message</Text>
          <TextInput
            style={styles.textArea}
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSend}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.darkGray} />
            ) : (
              <Text style={styles.buttonText}>Send Message</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: { padding: 10 },
  title: { fontSize: 20, fontWeight: "bold", color: COLORS.darkGray },
  content: { flexGrow: 1, padding: 20, alignItems: "center" },
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
  textArea: {
    backgroundColor: COLORS.white,
    padding: 15,
    height: 150,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: "100%",
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
    height: 55,
    justifyContent: "center",
    width: "100%",
  },
  buttonText: { color: COLORS.darkGray, fontSize: 18, fontWeight: "600" },
});

export default ContactAdminScreen;
