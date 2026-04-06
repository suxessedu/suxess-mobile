import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import RequestCard from "../../components/RequestCard";
import { RequestCardSkeleton } from "../../components/SkeletonLoader";
import { Ionicons } from "@expo/vector-icons";

const RequestsTab = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(() => {
    const getData = async () => {
      setIsLoading(true);
      const endpoint =
        user.role === "parent" ? "/parents/requests" : "/teachers/assignments";
      try {
        const response = await api.get(endpoint);
        setItems(response.data);
      } catch (error) {
        console.error(
          `Failed to fetch ${endpoint}:`,
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [user]);

  useFocusEffect(fetchData);

  const getStatusColor = (status) => {
    if (status === "Pending" || status === "Matching" || status === "Confirming Payment")
      return COLORS.warning;
    if (status === "Matched" || status === "Active") return COLORS.success;
    if (status === "Pending Acceptance") return COLORS.info;
    if (status === "Cancelled") return COLORS.danger;
    return COLORS.gray;
  };

  const isParent = user.role === "parent";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isParent ? "My Tutor Requests" : "My Assignments"}
        </Text>
        <Text style={styles.subtitle}>
          {isParent ? "Track all your tutor requests" : "Your active teaching assignments"}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((i) => (
            <RequestCardSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RequestCard
              subject={item.subject}
              level={item.level}
              status={
                isParent && item.status === "Pending Acceptance"
                  ? "Tutor Found (Waiting)"
                  : item.status
              }
              statusColor={getStatusColor(item.status)}
              location={item.location}
              submittedTime={item.submittedTime}
              onPress={() =>
                navigation.navigate("RequestDetails", { requestId: item.id })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons
                  name={isParent ? "document-text-outline" : "briefcase-outline"}
                  size={40}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.emptyTitle}>
                {isParent ? "No requests yet" : "No assignments yet"}
              </Text>
              <Text style={styles.emptyText}>
                {isParent
                  ? "Tap 'Request a Tutor' on the Home tab to get started."
                  : "Browse open requests from the Home tab to find opportunities."}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchData} tintColor={COLORS.primary} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.darkGray, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: COLORS.gray, marginTop: 3 },
  skeletonContainer: { padding: 20 },
  listContent: { padding: 20, flexGrow: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default RequestsTab;
