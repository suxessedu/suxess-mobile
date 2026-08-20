import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
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
import { HomeScreenSkeleton } from "../../components/SkeletonLoader";

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
        onPress={() => navigation.navigate("My Requests")}
      />
      <KpiCard
        value={data.kpis[1]?.value || 0}
        label="Matched Tutors"
        iconName="people-outline"
        onPress={() => navigation.navigate("My Requests")}
      />
      <KpiCard
        value={data.kpis[2]?.value || 0}
        label="Completed"
        iconName="checkmark-done-outline"
        onPress={() => navigation.navigate("My Requests")}
      />
    </View>

    {/* Primary CTA with Neubrutalist Accent */}
    <ActionCard
      isNeubrutalist
      title="Request a Tutor"
      subtitle="Answer a few questions. We’ll find the best verified match."
      onPress={() => navigation.navigate("RequestTutor")}
      iconName="school"
      iconColor={COLORS.brandInk}
      iconBgColor={COLORS.brand}
    />

    <ActionCard
      title="News & Updates"
      subtitle="Latest educational announcements & exam tips."
      onPress={() => navigation.navigate("NewsList")}
      iconName="newspaper-outline"
      iconColor="#2563EB"
      iconBgColor="#EFF6FF"
      style={{ marginTop: 2 }}
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
        onPress={() => navigation.navigate("Browse")}
      />
      <KpiCard
        value={data.kpis[1]?.value || 0}
        label="Your Students"
        iconName="school-outline"
        onPress={() => navigation.navigate("My Requests")}
      />
      <KpiCard
        value={data.kpis[2]?.value || 0}
        label="Sessions"
        iconName="calendar-outline"
        onPress={() => navigation.navigate("My Requests")}
      />
    </View>

    {/* Primary CTA with Neubrutalist Accent */}
    <ActionCard
      isNeubrutalist
      title="Browse Tuition Requests"
      subtitle="New students in your area are waiting for verified tutors."
      onPress={() => navigation.navigate("Browse")}
      iconName="search"
      iconColor={COLORS.brandInk}
      iconBgColor={COLORS.brand}
    />

    <ActionCard
      title="News & Updates"
      subtitle="Stay informed with platform updates & guidance."
      onPress={() => navigation.navigate("NewsList")}
      iconName="newspaper-outline"
      iconColor="#2563EB"
      iconBgColor="#EFF6FF"
      style={{ marginTop: 2 }}
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

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
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {user?.fullName?.split(" ")[0] || "there"} 👋
            </Text>
            <Text style={styles.subGreeting}>
              {isParent
                ? "Connecting you with verified private tutors"
                : "Your professional tutoring dashboard"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate("Notifications")}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
            {dashboardData.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {dashboardData.unreadCount > 9 ? "9+" : dashboardData.unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {isLoading && !dashboardData.kpis.length ? (
          <HomeScreenSkeleton />
        ) : isParent ? (
          <ParentView user={user} navigation={navigation} data={dashboardData} />
        ) : (
          <TeacherView user={user} navigation={navigation} data={dashboardData} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollViewContent: { paddingHorizontal: 16, paddingBottom: 90, flexGrow: 1 },
  header: {
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subGreeting: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: COLORS.brand,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  badgeText: {
    color: COLORS.brandInk,
    fontSize: 10,
    fontWeight: "800",
  },
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    marginHorizontal: -4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
});

export default HomeTab;
