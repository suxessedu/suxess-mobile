import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={22} color={COLORS.primary} />
    </View>
    <Text style={styles.menuItemText}>{label}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color={COLORS.gray} />
  </TouchableOpacity>
);

const AccountTab = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const privacyPolicyContent =
    "This is a placeholder for your Privacy Policy...";
  const termsOfServiceContent =
    "This is a placeholder for your Terms of Service...";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.fullName || "U").charAt(0)}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userRole}>
            {user?.role === "parent" ? "Parent Account" : "Teacher Account"}
          </Text>
        </View>

        <View style={styles.menu}>
          <Text style={styles.menuHeader}>Account</Text>
          {user?.role === "teacher" && (
            <MenuItem
              icon="person-circle-outline"
              label="Edit Profile"
              onPress={() => navigation.navigate("TeacherOnboarding")}
            />
          )}
          {user?.verificationStatus !== "Verified" && (
            <MenuItem
              icon="shield-checkmark-outline"
              label="Verify My Account"
              onPress={() => navigation.navigate("Verification")}
            />
          )}

          <Text style={styles.menuHeader}>Legal</Text>
          <MenuItem
            icon="document-text-outline"
            label="Privacy Policy"
            onPress={() =>
              navigation.navigate("Legal", {
                title: "Privacy Policy",
                content: privacyPolicyContent,
              })
            }
          />
          <MenuItem
            icon="reader-outline"
            label="Terms of Service"
            onPress={() =>
              navigation.navigate("Legal", {
                title: "Terms of Service",
                content: termsOfServiceContent,
              })
            }
          />

          <Text style={styles.menuHeader}>Support</Text>
          <MenuItem
            icon="help-buoy-outline"
            label="Help & Support"
            onPress={() => {}}
          />

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutButton]}
            onPress={logout}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="log-out-outline"
                size={22}
                color={COLORS.danger}
              />
            </View>
            <Text style={[styles.menuItemText, { color: COLORS.danger }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarText: { fontSize: 36, fontWeight: "bold", color: COLORS.primary },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: 15,
  },
  userRole: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
    textTransform: "capitalize",
  },
  menu: { marginTop: 20, marginHorizontal: 20 },
  menuHeader: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "600",
    textTransform: "uppercase",
    paddingVertical: 10,
    marginTop: 10,
  },
  menuItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: { width: 30, alignItems: "center" },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  logoutButton: { backgroundColor: "rgba(220, 53, 69, 0.05)", marginTop: 20 },
});

export default AccountTab;
