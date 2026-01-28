import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { COLORS } from "../../constants/colors";
import api from "../../services/api";
import KpiCard from "../../components/KpiCard";
import ActionCard from "../../components/ActionCard";
import RequestCard from "../../components/RequestCard";
import ProfileAlertBanner from "../../components/ProfileAlertBanner";
import UpgradeBanner from "../../components/UpgradeBanner";
import VerificationBanner from "../../components/VerificationBanner";

const ParentView = ({ user, navigation, data }) => (
  <>
    {user.verificationStatus !== "Verified" && (
      <VerificationBanner
        status={user.verificationStatus}
        onPress={() => navigation.navigate("Verification")}
      />
    )}
    {!user.isPremium && <UpgradeBanner />}

    <View style={styles.kpiContainer}>
      <KpiCard
        value={data.kpis[0]?.value || 0}
        label="Active Requests"
        iconName="hourglass-outline"
      />
      <KpiCard
        value={data.kpis[1]?.value || 0}
        label="Matched Tutors"
        iconName="people-outline"
      />
      <KpiCard
        value={data.kpis[2]?.value || 0}
        label="Completed"
        iconName="checkmark-done-outline"
      />
    </View>

    <ActionCard
      title="Request a Tutor"
      subtitle="Answer a few questions. We’ll handle the rest."
      onPress={() => navigation.navigate("RequestTutor")}
    />

    {data.latestItem && (
      <>
        <Text style={styles.sectionTitle}>Current Request</Text>
        <RequestCard
          subject={data.latestItem.subject}
          level={data.latestItem.level}
          status={
            data.latestItem.status === "Pending"
              ? "Matching"
              : data.latestItem.status
          }
          statusColor={
            data.latestItem.status === "Pending"
              ? COLORS.warning
              : COLORS.success
          }
          submittedTime={data.latestItem.submittedTime}
          onPress={() =>
            navigation.navigate("RequestDetails", {
              requestId: data.latestItem.id,
            })
          }
        />
      </>
    )}
  </>
);

const TeacherView = ({ user, navigation, data }) => (
  <>
    {!user.profileComplete && (
      <ProfileAlertBanner
        onPress={() => navigation.navigate("TeacherOnboarding")}
      />
    )}
    <View style={styles.kpiContainer}>
      <KpiCard
        value={data.kpis[0]?.value || 0}
        label="New Requests"
        iconName="mail-unread-outline"
      />
      <KpiCard
        value={data.kpis[1]?.value || 0}
        label="Your Students"
        iconName="school-outline"
      />
      <KpiCard
        value={data.kpis[2]?.value || 0}
        label="Sessions"
        iconName="calendar-outline"
      />
    </View>

    <ActionCard
      title="Browse Requests"
      subtitle="New opportunities are waiting."
      onPress={() => navigation.navigate("Browse")}
    />

    {data.latestItem && (
      <>
        <Text style={styles.sectionTitle}>Your Current Assignment</Text>
        <RequestCard
          subject={data.latestItem.subject}
          level={data.latestItem.level}
          status={data.latestItem.status}
          statusColor={COLORS.success}
          schedule={data.latestItem.schedule}
          onPress={() =>
            navigation.navigate("RequestDetails", {
              requestId: data.latestItem.id,
            })
          }
        />
      </>
    )}
  </>
);

const HomeTab = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [dashboardData, setDashboardData] = useState({
    kpis: [],
    latestItem: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/users/dashboard-summary");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useFocusEffect(fetchData);

  const isParent = user?.role === "parent";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Good morning, {user?.fullName?.split(" ")[0] || "User"}
          </Text>
          <TouchableOpacity
            style={{ position: "relative" }}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons name="notifications-outline" size={28} color={COLORS.darkGray} />
            {dashboardData.unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  right: -2,
                  top: -2,
                  backgroundColor: COLORS.error, // Assuming you have an error/red color
                  borderRadius: 8,
                  width: 16,
                  height: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1.5,
                  borderColor: COLORS.background,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
                >
                  {dashboardData.unreadCount > 9 ? "9+" : dashboardData.unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {isLoading && !dashboardData.kpis.length ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 50 }}
          />
        ) : isParent ? (
          <ParentView
            user={user}
            navigation={navigation}
            data={dashboardData}
          />
        ) : (
          <TeacherView
            user={user}
            navigation={navigation}
            data={dashboardData}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollViewContent: { paddingHorizontal: 20, paddingBottom: 80, flexGrow: 1 },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { fontSize: 26, fontWeight: "bold", color: COLORS.darkGray },
  reassuranceText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
    marginTop: 4,
  },
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    marginHorizontal: -5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: 30,
    marginBottom: 15,
  },
});

export default HomeTab;
