import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from "react-native";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const ActionCard = ({
  title,
  subtitle,
  onPress,
  iconName,
  iconColor,
  iconBgColor,
  style,
  isNeubrutalist = false,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, isNeubrutalist ? 2 : 0],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, isNeubrutalist ? 2 : 0],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, isNeubrutalist ? 1 : 0.98],
  });

  return (
    <View style={[styles.outerWrapper, style]}>
      {isNeubrutalist && <View style={styles.hardShadowLayer} />}

      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View
          style={[
            styles.container,
            isNeubrutalist && styles.neubrutalistContainer,
            {
              transform: isNeubrutalist
                ? [{ translateX }, { translateY }]
                : [{ scale }],
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: iconBgColor || COLORS.surfaceAlt },
              isNeubrutalist && styles.neubrutalistIcon,
            ]}
          >
            <Ionicons
              name={iconName || "arrow-forward"}
              size={22}
              color={iconColor || COLORS.brandInk}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View
            style={[
              styles.chevronContainer,
              isNeubrutalist && { backgroundColor: COLORS.brand },
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={isNeubrutalist ? COLORS.brandInk : COLORS.textSecondary}
            />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  hardShadowLayer: {
    position: "absolute",
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    borderRadius: 16,
    backgroundColor: COLORS.borderStrong,
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  neubrutalistContainer: {
    borderWidth: 2,
    borderColor: COLORS.borderStrong,
    backgroundColor: "#FFFEFA",
    shadowOpacity: 0,
    elevation: 0,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  neubrutalistIcon: {
    backgroundColor: COLORS.brand,
    borderWidth: 1.5,
    borderColor: COLORS.borderStrong,
  },
  textContainer: { flex: 1, marginRight: 8 },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ActionCard;
