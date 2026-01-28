import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || "N/A"}</Text>
  </View>
);

const LogLessonModal = ({ visible, onClose, onSubmit }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!date || !duration) {
      Alert.alert("Error", "Please provide the date and duration.");
      return;
    }
    onSubmit({
      lessonDate: date,
      durationHours: duration,
      teacherNotes: notes,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Log a Completed Lesson</Text>
          <TextInput
            style={styles.modalInput}
            value={date}
            onChangeText={setDate}
            placeholder="Date (YYYY-MM-DD)"
          />
          <TextInput
            style={styles.modalInput}
            value={duration}
            onChangeText={setDuration}
            placeholder="Duration in hours (e.g., 1.5)"
            keyboardType="numeric"
          />
          <TextInput
            style={[
              styles.modalInput,
              { height: 80, textAlignVertical: "top" },
            ]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes (optional)"
            multiline
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Cancel" onPress={onClose} color={COLORS.gray} />
            <Button
              title="Submit Log"
              onPress={handleSubmit}
              color={COLORS.primary}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const RequestDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { requestId } = route.params;
  const { user } = useContext(AuthContext);

  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logModalVisible, setLogModalVisible] = useState(false);

  const fetchData = useCallback(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/requests/${requestId}`);
        setDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch request details:", error);
        Alert.alert("Error", "Could not load request details.");
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [requestId]);

  useFocusEffect(fetchData);

  const handleCancelRequest = () => {
    Alert.alert(
      "Cancel Request",
      "Are you sure you want to cancel this tutor request?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await api.post(`/requests/${requestId}/cancel`);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Could not cancel the request.");
            }
          },
        },
      ]
    );
  };

  const handleLogLesson = async (logData) => {
    try {
      await api.post("/teachers/log-lesson", { ...logData, requestId });
      setLogModalVisible(false);
      Alert.alert("Success", "Lesson logged successfully.");
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to log lesson. Please ensure all fields are correct."
      );
    }
  };

  const handleAcceptOffer = () => {
    Alert.alert("Accept Offer", "Are you sure you want to accept this teaching assignment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: async () => {
          try {
            await api.post(`/teachers/assignments/${requestId}/accept`);
            Alert.alert("Success", "You have accepted the assignment!");
            fetchData(); // Refresh to update status
          } catch (error) {
            Alert.alert("Error", "Failed to accept assignment.");
          }
        },
      },
    ]);
  };

  const handleDeclineOffer = () => {
    Alert.alert("Decline Offer", "Are you sure you want to decline this assignment? It will be returned to the pool.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: async () => {
          try {
            await api.post(`/teachers/assignments/${requestId}/decline`);
            navigation.goBack();
          } catch (error) {
            Alert.alert("Error", "Failed to decline assignment.");
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.centered}>
        <Text>Could not load details.</Text>
      </View>
    );
  }

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
        <Text style={styles.title}>Request Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <DetailRow label="Status" value={details.status} />
          <DetailRow label="Name" value={details.studentName} />
          <DetailRow label="Age" value={details.studentAge} />
          <DetailRow label="Grade/Level" value={details.studentGrade} />
          <DetailRow label="Subjects" value={details.subjects} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tuition Requirements</Text>
          <DetailRow label="Schedule" value={details.schedule} />
          <DetailRow label="Duration" value={details.duration} />
          <DetailRow label="Location" value={details.location} />
          <DetailRow label="Learning Goals" value={details.learningGoals} />
        </View>

        {details.parentName && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Parent Information</Text>
            <DetailRow label="Name" value={details.parentName} />
            <DetailRow label="Contact Number" value={details.parentContact} />
          </View>
        )}

        {details.assignedTeacher && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Matched Tutor Details</Text>
            <DetailRow label="Name" value={details.assignedTeacher.name} />
            <DetailRow label="Email" value={details.assignedTeacher.email} />
            <DetailRow
              label="Phone Number"
              value={details.assignedTeacher.phone}
            />
            <DetailRow
              label="Qualification"
              value={details.assignedTeacher.qualification}
            />
          </View>
        )}

        {details.status === "Matched" && (
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() =>
              navigation.navigate("Chat", {
                requestId,
                otherUserName:
                  user.role === "parent"
                    ? details.assignedTeacher.name
                    : details.parentName,
              })
            }
          >
            <Ionicons
              name="chatbubbles-outline"
              size={20}
              color={COLORS.white}
            />
            <Text style={styles.chatButtonText}>
              Message {user.role === "parent" ? "Tutor" : "Parent"}
            </Text>
          </TouchableOpacity>
        )}

        {user.role === "parent" && details.status === "Pending" && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelRequest}
          >
            <Text style={styles.cancelButtonText}>Cancel Request</Text>
          </TouchableOpacity>
        )}



        {user.role === "teacher" && details.status === "Matched" && (
          <TouchableOpacity
            style={styles.logButton}
            onPress={() => setLogModalVisible(true)}
          >
            <Text style={styles.logButtonText}>Log a Completed Lesson</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      {user.role === "teacher" && details.status === "Pending Acceptance" && (
        <View style={styles.fixedFooter}>
          <Text style={styles.offerText}>You have a new job offer!</Text>
          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={[styles.footerButton, { backgroundColor: 'white', borderColor: COLORS.danger, borderWidth: 1 }]}
              onPress={handleDeclineOffer}
            >
               <Text style={[styles.logButtonText, { color: COLORS.danger }]}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, { backgroundColor: COLORS.success }]}
              onPress={handleAcceptOffer}
            >
               <Text style={[styles.logButtonText, { color: 'white' }]}>Accept Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <LogLessonModal
        visible={logModalVisible}
        onClose={() => setLogModalVisible(false)}
        onSubmit={handleLogLesson}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  detailLabel: { fontSize: 14, color: COLORS.gray, flex: 1 },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.darkGray,
    flex: 1.5,
    textAlign: "right",
  },
  cancelButton: {
    backgroundColor: "#fff0f1",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  cancelButtonText: { color: COLORS.danger, fontSize: 16, fontWeight: "bold" },
  logButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  logButtonText: { color: COLORS.darkGray, fontSize: 16, fontWeight: "bold" },
  chatButton: {
    backgroundColor: COLORS.success,
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  chatButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  fixedFooter: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  offerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 15,
    textAlign: 'center',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  footerButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RequestDetailScreen;
