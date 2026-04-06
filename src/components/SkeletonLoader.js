import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

/**
 * A single shimmer bar. width/height/borderRadius are customizable.
 * The shimmer animates between a light and slightly darker grey.
 */
const SkeletonBar = ({ width = "100%", height = 16, borderRadius = 8, style }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#E8E8E8",
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Skeleton for a KPI card (3 in a row on Home screen)
 */
export const KpiSkeleton = () => (
  <View style={skeletonStyles.kpiContainer}>
    {[1, 2, 3].map((i) => (
      <View key={i} style={skeletonStyles.kpiCard}>
        <SkeletonBar width={32} height={32} borderRadius={10} style={{ marginBottom: 12 }} />
        <SkeletonBar width="60%" height={24} borderRadius={6} style={{ marginBottom: 8 }} />
        <SkeletonBar width="80%" height={12} borderRadius={4} />
      </View>
    ))}
  </View>
);

/**
 * Skeleton for an ActionCard
 */
export const ActionCardSkeleton = () => (
  <View style={skeletonStyles.actionCard}>
    <SkeletonBar width={50} height={50} borderRadius={14} style={{ marginRight: 15 }} />
    <View style={{ flex: 1 }}>
      <SkeletonBar width="55%" height={15} borderRadius={5} style={{ marginBottom: 8 }} />
      <SkeletonBar width="85%" height={12} borderRadius={4} />
    </View>
    <SkeletonBar width={28} height={28} borderRadius={8} />
  </View>
);

/**
 * Skeleton for a RequestCard
 */
export const RequestCardSkeleton = () => (
  <View style={skeletonStyles.requestCard}>
    {/* header */}
    <View style={skeletonStyles.requestHeader}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <SkeletonBar width={30} height={30} borderRadius={8} style={{ marginRight: 10 }} />
        <SkeletonBar width="45%" height={16} borderRadius={5} />
      </View>
      <SkeletonBar width={70} height={24} borderRadius={12} />
    </View>
    {/* body */}
    <View style={{ padding: 16 }}>
      <SkeletonBar width="50%" height={12} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonBar width="65%" height={12} borderRadius={4} />
    </View>
    {/* footer */}
    <View style={skeletonStyles.requestFooter}>
      <SkeletonBar width={100} height={11} borderRadius={4} />
      <SkeletonBar width={28} height={28} borderRadius={8} />
    </View>
  </View>
);

/**
 * Skeleton for a Notification item
 */
export const NotificationSkeleton = () => (
  <View style={skeletonStyles.notifItem}>
    <SkeletonBar width={44} height={44} borderRadius={22} style={{ marginRight: 14 }} />
    <View style={{ flex: 1 }}>
      <SkeletonBar width="60%" height={15} borderRadius={5} style={{ marginBottom: 8 }} />
      <SkeletonBar width="90%" height={12} borderRadius={4} style={{ marginBottom: 6 }} />
      <SkeletonBar width="30%" height={10} borderRadius={4} />
    </View>
  </View>
);

/**
 * Full Home screen skeleton
 */
export const HomeScreenSkeleton = () => (
  <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
    {/* greeting */}
    <SkeletonBar width="50%" height={28} borderRadius={8} style={{ marginBottom: 24 }} />
    {/* upgrade banner */}
    <View style={skeletonStyles.bannerCard}>
      <SkeletonBar width={40} height={40} borderRadius={10} style={{ marginRight: 14 }} />
      <View style={{ flex: 1 }}>
        <SkeletonBar width="70%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
        <SkeletonBar width="90%" height={12} borderRadius={4} />
      </View>
    </View>
    {/* KPIs */}
    <KpiSkeleton />
    {/* action cards */}
    <ActionCardSkeleton />
    <ActionCardSkeleton />
    {/* section title */}
    <SkeletonBar width="40%" height={18} borderRadius={6} style={{ marginVertical: 16 }} />
    {/* request card */}
    <RequestCardSkeleton />
  </View>
);

const skeletonStyles = StyleSheet.create({
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: -5,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowOpacity: 0.04,
    elevation: 2,
  },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
    shadowOpacity: 0.04,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F6F6F6",
  },
  requestFooter: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  notifItem: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
});
