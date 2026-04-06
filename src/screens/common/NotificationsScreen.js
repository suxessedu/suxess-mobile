import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import api from "../../services/api";
import { NotificationSkeleton } from "../../components/SkeletonLoader";

// Notification type config
const TYPE_CONFIG = {
  match: {
    icon: "people-circle-outline",
    color: "#4CAF50",
    bg: "#E8F5E9",
    label: "Match",
  },
  success: {
    icon: "checkmark-circle-outline",
    color: "#2196F3",
    bg: "#E3F2FD",
    label: "Success",
  },
  info: {
    icon: "information-circle-outline",
    color: COLORS.primary,
    bg: COLORS.primaryLight,
    label: "Info",
  },
  default: {
    icon: "notifications-outline",
    color: COLORS.gray,
    bg: COLORS.lightGray,
    label: "Update",
  },
};

const NotificationItem = ({ item, onPress }) => {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.default;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.isRead && styles.unreadItem,
        ]}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
      >
        {/* Unread left bar */}
        {!item.isRead && <View style={styles.unreadBar} />}

        {/* Icon */}
        <View style={[styles.iconBg, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={22} color={config.color} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
              <Text style={[styles.typeText, { color: config.color }]}>{config.label}</Text>
            </View>
            <Text style={styles.time}>{item.createdAt}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications/");
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const handlePress = async (item) => {
    if (!item.isRead) {
      try {
        await api.post(`/notifications/${item.id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (error) {
        console.error("Failed to mark as read", error);
      }
    }
  };

  const markAllRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.darkGray} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount} new</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      {loading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <NotificationSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={handlePress} />
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="notifications-off-outline" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptyText}>
                You have no notifications right now. Check back later.
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    backgroundColor: COLORS.white,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.darkGray,
    letterSpacing: -0.3,
  },
  headerBadge: {
    marginLeft: 8,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.darkGray,
  },
  markAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
  },
  markReadText: {
    color: COLORS.darkGray,
    fontWeight: "700",
    fontSize: 12,
  },
  skeletonContainer: { padding: 16 },
  listContent: { padding: 16, flexGrow: 1 },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  unreadItem: {
    backgroundColor: "#FFFCF0",
  },
  unreadBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginLeft: 6,
    flexShrink: 0,
  },
  contentContainer: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.darkGray,
    flex: 1,
    marginRight: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    flexShrink: 0,
  },
  message: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  typeText: { fontSize: 11, fontWeight: "700" },
  time: { fontSize: 11, color: "#AAA" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 80,
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

export default NotificationsScreen;
