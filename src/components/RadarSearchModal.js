import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const RADAR_SIZE = SCREEN_WIDTH * 0.75;

const RadarRing = ({ delay, isCompleted }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCompleted) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [isCompleted]);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1.2],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.8, 0.4, 0],
  });

  return (
    <Animated.View
      style={[
        styles.radarRing,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
};

const TutorPin = ({ top, left, delay, isLocked, isFound }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.tutorPin,
        {
          top,
          left,
          opacity: opacityAnim,
          transform: [
            { scale: isLocked ? Animated.multiply(scaleAnim, 1.3) : scaleAnim },
          ],
          backgroundColor: isLocked ? COLORS.brand : COLORS.surface,
          borderColor: isLocked ? COLORS.borderStrong : COLORS.brand,
        },
      ]}
    >
      <Ionicons
        name="person"
        size={14}
        color={isLocked ? COLORS.brandInk : COLORS.textPrimary}
      />
    </Animated.View>
  );
};

const RadarSearchModal = ({
  visible,
  studentName = "Student",
  subject = "Tutor",
  onCancel,
  onComplete,
}) => {
  const [statusIndex, setStatusIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const lockAnim = useRef(new Animated.Value(0)).current;

  const statusMessages = [
    "Searching nearby verified tutors…",
    "Checking subject match & availability…",
    "Reviewing ratings and credentials…",
    `Matching top candidates for ${subject}…`,
    "Tutor found! Finalizing details…",
  ];

  useEffect(() => {
    if (!visible) {
      setStatusIndex(0);
      setIsCompleted(false);
      return;
    }

    // Cycle status messages
    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statusMessages.length - 2) return prev + 1;
        return prev;
      });
    }, 1200);

    // Minimum sequence time ~3.6s
    const completeTimer = setTimeout(() => {
      setStatusIndex(statusMessages.length - 1);
      setIsCompleted(true);

      Animated.spring(lockAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        onComplete?.();
      }, 700);
    }, 3600);

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimer);
    };
  }, [visible, subject]);

  if (!visible) return null;

  const initial = studentName ? studentName.charAt(0).toUpperCase() : "S";

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Top Cancel Button */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Center Radar Animation Area */}
        <View style={styles.radarContainer}>
          {/* Pulsing Concentric Rings */}
          <RadarRing delay={0} isCompleted={isCompleted} />
          <RadarRing delay={600} isCompleted={isCompleted} />
          <RadarRing delay={1200} isCompleted={isCompleted} />

          {/* Staggered Discovered Tutor Pins */}
          <TutorPin top={RADAR_SIZE * 0.2} left={RADAR_SIZE * 0.25} delay={900} />
          <TutorPin top={RADAR_SIZE * 0.28} left={RADAR_SIZE * 0.72} delay={1700} />
          <TutorPin top={RADAR_SIZE * 0.68} left={RADAR_SIZE * 0.2} delay={2500} />
          {/* Winning Locked Pin */}
          <TutorPin
            top={RADAR_SIZE * 0.65}
            left={RADAR_SIZE * 0.68}
            delay={1400}
            isLocked={isCompleted}
          />

          {/* Center Student Avatar */}
          <View style={styles.centerAvatar}>
            <Text style={styles.initialText}>{initial}</Text>
          </View>
        </View>

        {/* Status Text Area */}
        <View style={styles.statusArea}>
          <Text style={styles.searchingTitle}>
            {isCompleted ? "Match Confirmed!" : "Finding Best Match"}
          </Text>
          <Text style={styles.statusText}>{statusMessages[statusIndex]}</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  topBar: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  radarContainer: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  radarRing: {
    position: "absolute",
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 2,
    borderColor: COLORS.brand,
    backgroundColor: "rgba(255, 195, 0, 0.08)",
  },
  tutorPin: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  centerAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.brand,
    borderWidth: 3,
    borderColor: COLORS.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    zIndex: 10,
  },
  initialText: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.brandInk,
  },
  statusArea: {
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 40,
    minHeight: 80,
  },
  searchingTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default RadarSearchModal;
