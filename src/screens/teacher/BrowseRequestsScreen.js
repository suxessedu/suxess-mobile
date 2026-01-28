import React, { useState, useCallback } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

const BrowseRequestCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardSubject}>{item.subject}</Text>
    </View>
    <View style={styles.cardBody}>
      <View style={styles.detailItem}>
        <Ionicons name="school-outline" size={16} color={COLORS.gray} />
        <Text style={styles.detailText}>{item.level}</Text>
      </View>
      <View style={styles.detailItem}>
        <Ionicons name="location-outline" size={16} color={COLORS.gray} />
        <Text style={styles.detailText}>{item.location}</Text>
      </View>
      <View style={styles.detailItem}>
        <Ionicons name="calendar-outline" size={16} color={COLORS.gray} />
        <Text style={styles.detailText}>{item.schedule}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const BrowseRequestsScreen = () => {
  const navigation = useNavigation();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await api.get("/teachers/browse-requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch browse requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse Parent Requests</Text>
      </View>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BrowseRequestCard
            item={item}
            onPress={() =>
              navigation.navigate("RequestDetails", { requestId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No new requests available right now.
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
  emptyText: { fontSize: 16, color: COLORS.gray, textAlign: "center" },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  cardSubject: { fontSize: 18, fontWeight: "bold", color: COLORS.darkGray },
  cardBody: { padding: 15 },
  detailItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  detailText: { fontSize: 14, color: COLORS.gray, marginLeft: 8 },
});

export default BrowseRequestsScreen;
