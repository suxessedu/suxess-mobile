import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const TutorAvatar = ({ tutor }) => (
  <View style={styles.avatar}>
    <Text style={styles.avatarText}>{(tutor?.name || "T").charAt(0)}</Text>
  </View>
);

const TutorSuggestionCard = ({ tutor, onSelect, isSelected }) => (
  <TouchableOpacity
    style={[styles.card, isSelected && styles.cardSelected]}
    onPress={onSelect}
  >
    <TutorAvatar tutor={tutor} />
    <View style={styles.info}>
      <Text style={styles.tutorName}>{tutor.name}</Text>
      <Text style={styles.tutorSubjects}>{tutor.subjects}</Text>
      <Text style={styles.tutorQualification}>{tutor.qualification}</Text>
    </View>
    <View style={styles.matchPill}>
      <Text style={styles.matchText}>{tutor.matchScore}% Match</Text>
    </View>
  </TouchableOpacity>
);

const TutorSuggestionsScreen = ({ navigation }) => {
  const route = useRoute();
  const { suggestions, requestId } = route.params;
  const [selectedTutors, setSelectedTutors] = useState([]);

  const toggleTutorSelection = (tutorId) => {
    setSelectedTutors((prev) =>
      prev.includes(tutorId)
        ? prev.filter((id) => id !== tutorId)
        : [...prev, tutorId]
    );
  };

  const proceedToPayment = (isSchoolChoice) => {
    const selectedTutorIds = isSchoolChoice ? [] : selectedTutors;
    navigation.navigate("PaymentInstructions", { requestId, selectedTutorIds });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>We Found Some Matches!</Text>
        <Text style={styles.subtitle}>
          Here are the top tutors based on your request. You can shortlist your
          favorites or let us handle the final choice.
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {suggestions.length > 0 ? (
          suggestions.map((tutor) => (
            <TutorSuggestionCard
              key={tutor.id}
              tutor={tutor}
              isSelected={selectedTutors.includes(tutor.id)}
              onSelect={() => toggleTutorSelection(tutor.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No available tutors match your criteria right now. The admin has
              been notified and will find a match for you manually.
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            selectedTutors.length === 0 && styles.disabledButton,
          ]}
          onPress={() => proceedToPayment(false)}
          disabled={selectedTutors.length === 0}
        >
          <Text style={styles.primaryButtonText}>
            {selectedTutors.length > 0
              ? `Submit ${selectedTutors.length} Preference(s)`
              : "Shortlist Your Favorites"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => proceedToPayment(true)}
        >
          <Text style={styles.secondaryButtonText}>
            Let Suxess Decide for Me
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.darkGray },
  subtitle: { fontSize: 16, color: COLORS.gray, marginTop: 8 },
  scrollContainer: { padding: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: { borderColor: COLORS.primary },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "bold", color: COLORS.primary },
  info: { flex: 1 },
  tutorName: { fontSize: 18, fontWeight: "bold", color: COLORS.darkGray },
  tutorSubjects: { fontSize: 14, color: COLORS.gray, marginVertical: 2 },
  tutorQualification: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: "italic",
  },
  matchPill: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  matchText: { color: COLORS.darkGray, fontWeight: "bold", fontSize: 12 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: COLORS.white,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    height: 55,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: COLORS.darkGray,
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: { padding: 16, alignItems: "center" },
  secondaryButtonText: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButton: { backgroundColor: "#F0F0F0" },
  emptyContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
  },
});

export default TutorSuggestionsScreen;
