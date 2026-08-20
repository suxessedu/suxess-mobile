import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Ionicons } from "@expo/vector-icons";
import PickerInput from "../../components/PickerInput";
import ToggleSwitch from "../../components/ToggleSwitch";
import SubjectPicker from "../../components/SubjectPicker";
import NeubrutalistButton from "../../components/NeubrutalistButton";
import RadarSearchModal from "../../components/RadarSearchModal";

const scheduleOptions = [
  { label: "Weekly (Once a week)", value: "Weekly" },
  { label: "Bi-Weekly (Twice a week)", value: "Bi-Weekly" },
  { label: "3 Times a Week", value: "3 Times a Week" },
  { label: "Every Working Day (Mon - Fri)", value: "Every Working Day" },
];

const durationOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} Hour${i > 0 ? "s" : ""}`,
  value: `${i + 1} Hour${i > 0 ? "s" : ""}`,
}));

const FormInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = "default",
  multiline = false,
  returnKeyType = "next",
  onSubmitEditing,
  inputRef,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
          multiline && styles.textAreaContainer,
        ]}
      >
        <TextInput
          ref={inputRef}
          style={[styles.input, multiline && styles.textAreaInput]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textPlaceholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const RequestTutorScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [showRadar, setShowRadar] = useState(false);
  const [pendingSuggestions, setPendingSuggestions] = useState(null);

  // Input refs for smooth "Next" field focus
  const ageInputRef = useRef();
  const gradeInputRef = useRef();
  const styleInputRef = useRef();
  const contactInputRef = useRef();
  const addressInputRef = useRef();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentName?.trim()) newErrors.studentName = "Student's name is required";
    if (!formData.studentAge?.trim()) newErrors.studentAge = "Age is required";
    if (!formData.studentGrade?.trim()) newErrors.studentGrade = "Grade/level is required";
    if (!formData.subjects?.trim()) newErrors.subjects = "Please select at least one subject";
    if (!formData.parentContact?.trim()) newErrors.parentContact = "Contact phone number is required";
    if (!formData.houseAddress?.trim()) newErrors.houseAddress = "Home address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!validateForm()) {
      showToast({
        title: "Incomplete Fields",
        message: "Please fill in all required fields marked in red.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setShowRadar(true); // Launch radar-style search animation immediately

    try {
      const response = await api.post("/parents/request", {
        ...formData,
        parentId: user.id,
      });

      setPendingSuggestions({
        suggestions: response.data.suggestions,
        requestId: response.data.requestId,
      });
    } catch (error) {
      setShowRadar(false);
      setIsSubmitting(false);
      showToast({
        title: "Request Error",
        message: "Could not submit your request. Please try again.",
        type: "error",
      });
    }
  };

  const handleRadarComplete = () => {
    setShowRadar(false);
    setIsSubmitting(false);
    if (pendingSuggestions) {
      navigation.replace("TutorSuggestions", {
        suggestions: pendingSuggestions.suggestions,
        requestId: pendingSuggestions.requestId,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Request a Tutor</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Student Information</Text>

          <FormInput
            label="Student's Full Name *"
            placeholder="e.g. Samuel Ade"
            value={formData.studentName}
            onChangeText={(v) => handleInputChange("studentName", v)}
            error={errors.studentName}
            returnKeyType="next"
            onSubmitEditing={() => ageInputRef.current?.focus()}
          />

          <View style={styles.twoColumnRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <FormInput
                inputRef={ageInputRef}
                label="Age *"
                placeholder="e.g. 14"
                keyboardType="numeric"
                value={formData.studentAge}
                onChangeText={(v) => handleInputChange("studentAge", v)}
                error={errors.studentAge}
                returnKeyType="next"
                onSubmitEditing={() => gradeInputRef.current?.focus()}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <FormInput
                inputRef={gradeInputRef}
                label="Grade / Level *"
                placeholder="e.g. JSS 3"
                value={formData.studentGrade}
                onChangeText={(v) => handleInputChange("studentGrade", v)}
                error={errors.studentGrade}
              />
            </View>
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Subjects Needed *</Text>
            <TouchableOpacity
              style={[
                styles.inputContainer,
                styles.pickerTrigger,
                !!errors.subjects && styles.inputError,
              ]}
              onPress={() => setShowSubjectPicker(true)}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: formData.subjects ? COLORS.textPrimary : COLORS.textPlaceholder,
                }}
              >
                {formData.subjects || "Tap to select subjects"}
              </Text>
              <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
            {!!errors.subjects && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={13} color={COLORS.error} />
                <Text style={styles.errorText}>{errors.subjects}</Text>
              </View>
            )}
          </View>

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
            label="Preferred Duration per Session"
            selectedValue={formData.duration}
            onValueChange={(v) => handleInputChange("duration", v)}
            items={durationOptions}
          />

          <FormInput
            label="Learning Goals (Optional)"
            placeholder="e.g. Prepare for JSCE exams, improve Math skills"
            value={formData.learningGoals}
            onChangeText={(v) => handleInputChange("learningGoals", v)}
            multiline
          />

          <Text style={styles.sectionTitle}>Preferences</Text>
          <ToggleSwitch
            label="Any Previous Tuition Experience?"
            value={formData.previousExperience}
            onValueChange={(v) => handleInputChange("previousExperience", v)}
          />

          <FormInput
            inputRef={styleInputRef}
            label="Teaching Style Preference"
            placeholder="e.g. Patient, firm, uses visual aids..."
            value={formData.stylePreference}
            onChangeText={(v) => handleInputChange("stylePreference", v)}
            multiline
          />

          <Text style={styles.sectionTitle}>Contact & Location</Text>

          <FormInput
            inputRef={contactInputRef}
            label="Parent Contact Phone Number *"
            placeholder="e.g. 08012345678"
            keyboardType="phone-pad"
            value={formData.parentContact}
            onChangeText={(v) => handleInputChange("parentContact", v)}
            error={errors.parentContact}
            returnKeyType="next"
            onSubmitEditing={() => addressInputRef.current?.focus()}
          />

          <FormInput
            inputRef={addressInputRef}
            label="Home / Lesson Address *"
            placeholder="Enter full street address and landmark"
            value={formData.houseAddress}
            onChangeText={(v) => handleInputChange("houseAddress", v)}
            error={errors.houseAddress}
            multiline
          />

          {/* Sticky/Floating Neubrutalist CTA */}
          <View style={styles.ctaContainer}>
            <NeubrutalistButton
              title="Find Tutors Now"
              onPress={handleSubmit}
              loading={isSubmitting}
              icon={<Ionicons name="search" size={18} color={COLORS.brandInk} />}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Radar Search Loading Animation */}
      <RadarSearchModal
        visible={showRadar}
        studentName={formData.studentName}
        subject={formData.subjects || "Subject"}
        onCancel={() => {
          setShowRadar(false);
          setIsSubmitting(false);
        }}
        onComplete={handleRadarComplete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 18,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  twoColumnRow: {
    flexDirection: "row",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minHeight: 50,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputFocused: {
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.surface,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: "#FFF8F8",
  },
  input: {
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 10,
  },
  textAreaContainer: {
    minHeight: 88,
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  textAreaInput: {
    minHeight: 70,
    textAlignVertical: "top",
    width: "100%",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 2,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginLeft: 4,
    fontWeight: "500",
  },
  ctaContainer: {
    marginTop: 24,
    marginBottom: 10,
  },
});

export default RequestTutorScreen;
