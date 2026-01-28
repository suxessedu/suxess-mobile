import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import SubjectPicker from "../../components/SubjectPicker";

const TeacherOnboardingScreen = ({ navigation }) => {
  const { user, refreshUserProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post("/teachers/profile", { ...formData, userId: user.id });
      setSubmissionSuccess(true);
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not update profile. Please ensure all fields are filled."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
        <Text style={styles.successTitle}>Profile Submitted!</Text>
        <Text style={styles.successSubtitle}>
          Thank you for completing your profile. Your information is now pending
          review by the school admin.
        </Text>
        <TouchableOpacity style={styles.button} onPress={refreshUserProfile}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          {navigation.canGoBack() && (
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
          )}
          <Text style={styles.title}>Complete Your Profile</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>
            Please provide your details to get started.
          </Text>

          <Text style={styles.sectionTitle}>Academic Qualifications</Text>
          <TextInput
            style={styles.input}
            placeholder="Highest Qualification (e.g., Bachelor's)"
            onChangeText={(v) => handleInputChange("highestQualification", v)}
          />

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowSubjectPicker(true)}
          >
            <Text style={{ color: formData.relevantSubjects ? "#333" : "#C7C7CD", marginTop: 12 }}>
              {formData.relevantSubjects || "Select Relevant Subjects"}
            </Text>
          </TouchableOpacity>

          <SubjectPicker
            visible={showSubjectPicker}
            onClose={() => setShowSubjectPicker(false)}
            selectedSubjects={
              formData.relevantSubjects
                ? formData.relevantSubjects.split(",").map((s) => s.trim())
                : []
            }
            onSelectSubjects={(subjects) =>
              handleInputChange("relevantSubjects", subjects.join(", "))
            }
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Teaching Experience (Years, Subjects)"
            multiline
            onChangeText={(v) => handleInputChange("teachingExperience", v)}
          />

          <Text style={styles.sectionTitle}>Teaching Style & Approach</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Teaching Philosophy"
            multiline
            onChangeText={(v) => handleInputChange("teachingPhilosophy", v)}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Approach to Lesson Planning"
            multiline
            onChangeText={(v) => handleInputChange("lessonPlanning", v)}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Specialized Teaching Methods"
            multiline
            onChangeText={(v) => handleInputChange("specializedMethods", v)}
          />

          <Text style={styles.sectionTitle}>Security</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Home Address"
            multiline
            onChangeText={(v) => handleInputChange("homeAddress", v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Guarantor's Name"
            onChangeText={(v) => handleInputChange("guarantorName", v)}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Guarantor's Address & Relationship"
            multiline
            onChangeText={(v) => handleInputChange("guarantorAddress", v)}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.darkGray} />
            ) : (
              <Text style={styles.buttonText}>Submit Profile</Text>
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
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
    textAlign: "center",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginTop: 20,
    marginBottom: 15,
  },
  input: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: { height: 100, paddingTop: 15, textAlignVertical: "top" },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    height: 55,
    justifyContent: "center",
  },
  buttonText: { color: COLORS.darkGray, fontSize: 18, fontWeight: "600" },
  successContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: 20,
  },
  successSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
  },
});

export default TeacherOnboardingScreen;
