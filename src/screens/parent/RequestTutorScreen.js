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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import PickerInput from "../../components/PickerInput";
import ToggleSwitch from "../../components/ToggleSwitch";
import SubjectPicker from "../../components/SubjectPicker";

const scheduleOptions = [
  { label: "Weekly", value: "Weekly" },
  { label: "Bi-Weekly", value: "Bi-Weekly" },
  { label: "3 Times a Week", value: "3 Times a Week" },
  { label: "Every Working Day", value: "Every Working Day" },
];

const durationOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} Hour${i > 0 ? "s" : ""}`,
  value: `${i + 1} Hour${i > 0 ? "s" : ""}`,
}));

const RequestTutorScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post("/parents/request", {
        ...formData,
        parentId: user.id,
      });
      navigation.replace("TutorSuggestions", {
        suggestions: response.data.suggestions,
        requestId: response.data.requestId,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not submit your request. Please ensure all fields are filled."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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
        <Text style={styles.title}>Request a Tutor</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Student Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Student's Name"
          onChangeText={(v) => handleInputChange("studentName", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          onChangeText={(v) => handleInputChange("studentAge", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Grade / Level"
          onChangeText={(v) => handleInputChange("studentGrade", v)}
        />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowSubjectPicker(true)}
        >
          <Text style={{ color: formData.subjects ? "#333" : "#C7C7CD", marginTop: 12 }}>
            {formData.subjects || "Select Subjects"}
          </Text>
        </TouchableOpacity>

        <SubjectPicker
          visible={showSubjectPicker}
          onClose={() => setShowSubjectPicker(false)}
          selectedSubjects={
            formData.subjects
              ? formData.subjects.split(",").map((s) => s.trim())
              : []
          }
          onSelectSubjects={(subjects) =>
            handleInputChange("subjects", subjects.join(", "))
          }
        />

        <Text style={styles.sectionTitle}>Tuition Requirements</Text>
        <PickerInput
          label="Preferred Tuition Schedule"
          selectedValue={formData.schedule}
          onValueChange={(v) => handleInputChange("schedule", v)}
          items={scheduleOptions}
        />
        <PickerInput
          label="Preferred Tuition Duration"
          selectedValue={formData.duration}
          onValueChange={(v) => handleInputChange("duration", v)}
          items={durationOptions}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Specific Learning Goals or Needs"
          multiline
          onChangeText={(v) => handleInputChange("learningGoals", v)}
        />

        <Text style={styles.sectionTitle}>Additional Information</Text>
        <ToggleSwitch
          label="Any Previous Tuition Experience?"
          value={formData.previousExperience}
          onValueChange={(v) => handleInputChange("previousExperience", v)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any Specific Teaching Style or Approach Preferred?"
          multiline
          onChangeText={(v) => handleInputChange("stylePreference", v)}
        />

        <Text style={styles.sectionTitle}>Contact & Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          keyboardType="phone-pad"
          onChangeText={(v) => handleInputChange("parentContact", v)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="House Address"
          multiline
          onChangeText={(v) => handleInputChange("houseAddress", v)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.darkGray} />
          ) : (
            <Text style={styles.buttonText}>Find Tutors Now</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  scrollContainer: { padding: 20 },
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
});

export default RequestTutorScreen;
