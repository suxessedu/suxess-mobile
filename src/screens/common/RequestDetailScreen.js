import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";
import NeubrutalistButton from "../../components/NeubrutalistButton";
import BottomSheetModal from "../../components/BottomSheetModal";

const DetailRow = ({ label, value, isHighlight }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text
      style={[
        styles.detailValue,
        isHighlight && { color: COLORS.brandInk, fontWeight: "700" },
      ]}
    >
      {value || "N/A"}
    </Text>
  </View>
);

const LogLessonModal = ({ visible, onClose, onSubmit }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!date || !duration) {
      return;
    }
    onSubmit({
      lessonDate: date,
      durationHours: duration,
      teacherNotes: notes,
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Log Completed Lesson</Text>
          <Text style={styles.modalSubtitle}>Record tuition session details</Text>

          <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.modalInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.textPlaceholder}
          />

          <Text style={styles.inputLabel}>Duration in hours</Text>
          <TextInput
            style={styles.modalInput}
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g. 1.5 or 2"
            placeholderTextColor={COLORS.textPlaceholder}
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>Session Notes (Optional)</Text>
          <TextInput
            style={[styles.modalInput, { height: 75, textAlignVertical: "top" }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Topics covered, student progress..."
            placeholderTextColor={COLORS.textPlaceholder}
            multiline
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <NeubrutalistButton
              title="Submit Log"
              onPress={handleSubmit}
              style={{ flex: 1, marginLeft: 8 }}
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
  const { showToast } = useToast();

  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logModalVisible, setLogModalVisible] = useState(false);

  // Bottom Sheet States
  const [activeSheet, setActiveSheet] = useState(null); // 'cancel' | 'accept_parent' | 'reject_parent' | 'accept_teacher' | 'decline_teacher'
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const fetchData = useCallback(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/requests/${requestId}`);
        setDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch request details:", error);
        showToast({
          title: "Error",
          message: "Could not load request details.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [requestId]);

  useFocusEffect(fetchData);

  const handleCancelRequest = async () => {
    setIsProcessingAction(true);
    try {
      await api.post(`/requests/${requestId}/cancel`);
      setActiveSheet(null);
      showToast({
        title: "Request Cancelled",
        message: "Your request has been cancelled.",
        type: "info",
      });
      navigation.goBack();
    } catch (error) {
      showToast({
        title: "Error",
        message: "Could not cancel the request.",
        type: "error",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleConfirmParentMatch = async () => {
    setIsProcessingAction(true);
    try {
      await api.post(`/requests/${requestId}/confirm-match`);
      setActiveSheet(null);
      fetchData();
      showToast({
        title: "Tutor Confirmed! 🎉",
        message: "You can now message your tutor directly.",
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Error",
        message: "Failed to confirm tutor match.",
        type: "error",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleRejectParentMatch = async () => {
    setIsProcessingAction(true);
    try {
      await api.post(`/requests/${requestId}/reject-match`);
      setActiveSheet(null);
      fetchData();
      showToast({
        title: "Match Declined",
        message: "We are looking for another tutor for you.",
        type: "info",
      });
    } catch (error) {
      showToast({
        title: "Error",
        message: "Failed to decline match.",
        type: "error",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleAcceptTeacherOffer = async () => {
    setIsProcessingAction(true);
    try {
      await api.post(`/teachers/assignments/${requestId}/accept`);
      setActiveSheet(null);
      fetchData();
      showToast({
        title: "Assignment Accepted! 🎓",
        message: "You can now contact the student/parent.",
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Error",
        message: "Failed to accept assignment.",
        type: "error",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDeclineTeacherOffer = async () => {
    setIsProcessingAction(true);
    try {
      await api.post(`/teachers/assignments/${requestId}/decline`);
      setActiveSheet(null);
      showToast({
        title: "Assignment Declined",
        message: "The request has been returned to the matching pool.",
        type: "info",
      });
      navigation.goBack();
    } catch (error) {
      showToast({
        title: "Error",
        message: "Failed to decline assignment.",
        type: "error",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleLogLesson = async (logData) => {
    try {
      await api.post("/teachers/log-lesson", { ...logData, requestId });
      setLogModalVisible(false);
      showToast({
        title: "Lesson Logged",
        message: "Your completed lesson was logged successfully.",
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Logging Error",
        message: "Failed to log lesson. Please check all fields.",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.brand} />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: COLORS.textSecondary }}>Could not load details.</Text>
      </View>
    );
  }

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
        <Text style={styles.title}>Request Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusLabel}>Current Status</Text>
            <View
              style={[
                styles.statusBadge,
                details.status === "Matched"
                  ? styles.statusMatched
                  : details.status === "Completed"
                  ? styles.statusCompleted
                  : styles.statusPending,
              ]}
            >
              <Text style={styles.statusBadgeText}>{details.status}</Text>
            </View>
          </View>
          <Text style={styles.subjectHighlight}>{details.subjects}</Text>
          <Text style={styles.studentSubtext}>
            For {details.studentName} ({details.studentGrade})
          </Text>
        </View>

        {/* Tuition Details Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tuition Requirements</Text>
          <DetailRow label="Schedule" value={details.schedule} />
          <DetailRow label="Duration" value={details.duration} />
          <DetailRow label="Address" value={details.location} />
          <DetailRow label="Learning Goals" value={details.learningGoals} />
        </View>

        {/* Matched Tutor Card (if available) */}
        {details.assignedTeacher && (
          <View style={[styles.card, styles.highlightCard]}>
            <View style={styles.tutorHeader}>
              <View style={styles.tutorAvatar}>
                <Ionicons name="school" size={22} color={COLORS.brandInk} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.tutorTitle}>Matched Tutor</Text>
                <Text style={styles.tutorName}>{details.assignedTeacher.name}</Text>
              </View>
            </View>
            <DetailRow label="Email" value={details.assignedTeacher.email} />
            <DetailRow label="Phone" value={details.assignedTeacher.phone} />
            <DetailRow
              label="Qualification"
              value={details.assignedTeacher.qualification}
            />
          </View>
        )}

        {/* Parent Details (for teachers) */}
        {details.parentName && user.role === "teacher" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Parent Contact</Text>
            <DetailRow label="Parent Name" value={details.parentName} />
            <DetailRow label="Contact Number" value={details.parentContact} />
          </View>
        )}

        {/* Actions */}
        {details.status === "Matched" && (
          <NeubrutalistButton
            title={`Message ${user.role === "parent" ? "Tutor" : "Parent"}`}
            onPress={() =>
              navigation.navigate("Chat", {
                requestId,
                otherUserName:
                  user.role === "parent"
                    ? details.assignedTeacher?.name
                    : details.parentName,
              })
            }
            icon={<Ionicons name="chatbubbles" size={18} color={COLORS.brandInk} />}
            style={{ marginTop: 10 }}
          />
        )}

        {user.role === "teacher" && details.status === "Matched" && (
          <NeubrutalistButton
            title="Log Completed Lesson"
            variant="secondary"
            onPress={() => setLogModalVisible(true)}
            icon={<Ionicons name="checkmark-done-circle" size={18} color={COLORS.textPrimary} />}
            style={{ marginTop: 6 }}
          />
        )}

        {user.role === "parent" && details.status === "Pending" && (
          <TouchableOpacity
            style={styles.cancelLink}
            onPress={() => setActiveSheet("cancel")}
          >
            <Text style={styles.cancelLinkText}>Cancel This Request</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Floating Action Bars for Decision States */}
      {user.role === "parent" && details.status === "Pending Acceptance" && (
        <View style={styles.bottomBar}>
          <Text style={styles.bottomBarTitle}>A Tutor is Ready!</Text>
          <View style={styles.bottomBarButtons}>
            <TouchableOpacity
              style={styles.barSecondaryBtn}
              onPress={() => setActiveSheet("reject_parent")}
            >
              <Text style={styles.barSecondaryText}>Decline</Text>
            </TouchableOpacity>
            <NeubrutalistButton
              title="Accept Tutor"
              onPress={() => setActiveSheet("accept_parent")}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </View>
      )}

      {user.role === "teacher" && details.status === "Pending Acceptance" && (
        <View style={styles.bottomBar}>
          <Text style={styles.bottomBarTitle}>New Tuition Job Offer!</Text>
          <View style={styles.bottomBarButtons}>
            <TouchableOpacity
              style={styles.barSecondaryBtn}
              onPress={() => setActiveSheet("decline_teacher")}
            >
              <Text style={styles.barSecondaryText}>Decline</Text>
            </TouchableOpacity>
            <NeubrutalistButton
              title="Accept Job"
              onPress={() => setActiveSheet("accept_teacher")}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </View>
      )}

      {/* Modern Bottom Sheets for Confirmation Decisions */}
      <BottomSheetModal
        visible={activeSheet === "accept_parent"}
        onClose={() => setActiveSheet(null)}
        title="Accept Tutor Match?"
        subtitle={`Would you like to confirm ${details?.assignedTeacher?.name || "this tutor"} for your ${details?.subjects} lessons?`}
        primaryAction={{
          label: "Yes, Confirm Tutor",
          onPress: handleConfirmParentMatch,
          loading: isProcessingAction,
        }}
        secondaryAction={{
          label: "Review Details Again",
          onPress: () => setActiveSheet(null),
        }}
        icon={
          <View style={styles.sheetIconBg}>
            <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
          </View>
        }
      />

      <BottomSheetModal
        visible={activeSheet === "reject_parent"}
        onClose={() => setActiveSheet(null)}
        title="Decline This Tutor?"
        subtitle="We will immediately return your request to the matching pool to find an alternative tutor."
        primaryAction={{
          label: "Decline & Find Another",
          variant: "danger",
          onPress: handleRejectParentMatch,
          loading: isProcessingAction,
        }}
        secondaryAction={{
          label: "Keep Current Match",
          onPress: () => setActiveSheet(null),
        }}
      />

      <BottomSheetModal
        visible={activeSheet === "accept_teacher"}
        onClose={() => setActiveSheet(null)}
        title="Accept Teaching Assignment?"
        subtitle={`Confirm that you are available to teach ${details?.subjects} on the requested schedule.`}
        primaryAction={{
          label: "Accept Assignment",
          onPress: handleAcceptTeacherOffer,
          loading: isProcessingAction,
        }}
        secondaryAction={{
          label: "Not Now",
          onPress: () => setActiveSheet(null),
        }}
      />

      <BottomSheetModal
        visible={activeSheet === "decline_teacher"}
        onClose={() => setActiveSheet(null)}
        title="Decline Teaching Offer?"
        subtitle="This student will be reassigned to another verified tutor."
        primaryAction={{
          label: "Decline Offer",
          variant: "danger",
          onPress: handleDeclineTeacherOffer,
          loading: isProcessingAction,
        }}
        secondaryAction={{
          label: "Go Back",
          onPress: () => setActiveSheet(null),
        }}
      />

      <BottomSheetModal
        visible={activeSheet === "cancel"}
        onClose={() => setActiveSheet(null)}
        title="Cancel Request?"
        subtitle="Are you sure you want to cancel this tutor request? This action cannot be undone."
        primaryAction={{
          label: "Yes, Cancel Request",
          variant: "danger",
          onPress: handleCancelRequest,
          loading: isProcessingAction,
        }}
        secondaryAction={{
          label: "Keep Request Active",
          onPress: () => setActiveSheet(null),
        }}
      />

      <LogLessonModal
        visible={logModalVisible}
        onClose={() => setLogModalVisible(false)}
        onSubmit={handleLogLesson}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  scrollContainer: { padding: 16, paddingBottom: 100 },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusMatched: { backgroundColor: "#E8F5E9" },
  statusPending: { backgroundColor: "#FFF8E1" },
  statusCompleted: { backgroundColor: "#EDE7F6" },
  statusBadgeText: { fontSize: 12, fontWeight: "700", color: COLORS.textPrimary },
  subjectHighlight: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  studentSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  highlightCard: {
    borderWidth: 2,
    borderColor: COLORS.brand,
    backgroundColor: "#FFFEFA",
  },
  tutorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tutorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.brand,
    borderWidth: 1.5,
    borderColor: COLORS.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  tutorTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
  },
  tutorName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F5F3EC",
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },
  cancelLink: {
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 6,
  },
  cancelLinkText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: "600",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomBarTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  bottomBarButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  barSecondaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  barSecondaryText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  sheetIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(20, 23, 26, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
    marginLeft: 2,
  },
  modalInput: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
});

export default RequestDetailScreen;
