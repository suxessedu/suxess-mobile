import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import RequestCard from "../../components/RequestCard";

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
    if (
      status === "Pending" ||
      status === "Matching" ||
      status === "Confirming Payment"
    )
      return COLORS.warning;
    if (status === "Matched" || status === "Active") return COLORS.success;
    if (status === "Pending Acceptance") return COLORS.info; // Or a specific blue
    if (status === "Cancelled") return COLORS.danger;
    return COLORS.gray;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {user.role === "parent" ? "My Tutor Requests" : "My Assignments"}
        </Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RequestCard
            subject={item.subject}
            level={item.level}
            status={
              user.role === "parent" && item.status === "Pending Acceptance"
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
            <Text style={styles.emptyText}>
              {user.role === "parent"
                ? "You haven't made any requests yet."
                : "You don't have any assignments yet."}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.darkGray },
  listContent: { padding: 20, flexGrow: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  emptyText: { fontSize: 16, color: COLORS.gray },
});

export default RequestsTab;
