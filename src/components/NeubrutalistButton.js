import React, { useRef } from "react";
import {
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../constants/colors";

const NeubrutalistButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  variant = "primary", // 'primary' (yellow), 'secondary' (white), 'danger' (red)
  icon,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const shadowOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.6],
  });

  let bg = COLORS.brand;
  let textColor = COLORS.brandInk;
  let borderColor = COLORS.borderStrong;

  if (variant === "secondary") {
    bg = COLORS.surface;
    textColor = COLORS.textPrimary;
  } else if (variant === "danger") {
    bg = "#FEE2E2";
    textColor = COLORS.error;
    borderColor = COLORS.error;
  }

  return (
    <View style={[styles.outerWrapper, style]}>
      {/* Hard Offset Neubrutalist Shadow */}
      <Animated.View
        style={[
          styles.shadowLayer,
          {
            backgroundColor: borderColor,
            opacity: shadowOpacity,
          },
        ]}
      />

      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || loading}
      >
        <Animated.View
          style={[
            styles.buttonSurface,
            {
              backgroundColor: disabled ? COLORS.surfaceAlt : bg,
              borderColor: disabled ? COLORS.border : borderColor,
              transform: [{ translateX }, { translateY }],
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={textColor} />
          ) : (
            <View style={styles.contentRow}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Text
                style={[
                  styles.titleText,
                  { color: disabled ? COLORS.textPlaceholder : textColor },
                  textStyle,
                ]}
              >
                {title}
              </Text>
            </View>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: "relative",
    marginVertical: 6,
  },
  shadowLayer: {
    position: "absolute",
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    borderRadius: 14,
  },
  buttonSurface: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});

export default NeubrutalistButton;
