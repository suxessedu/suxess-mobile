import "react-native-gesture-handler"; // MUST BE AT THE TOP
import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";
import { COLORS } from "./src/constants/colors";
import { Ionicons } from "@expo/vector-icons";

// Import all screens
import WelcomeScreen from "./src/screens/auth/WelcomeScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignUpScreen from "./src/screens/auth/SignUpScreen";
import VerificationScreen from "./src/screens/onboarding/VerificationScreen";
import VerificationSuccessScreen from "./src/screens/onboarding/VerificationSuccessScreen";
import PendingVerificationScreen from "./src/screens/onboarding/PendingVerificationScreen";
import TeacherOnboardingScreen from "./src/screens/onboarding/TeacherOnboardingScreen";
import RequestTutorScreen from "./src/screens/parent/RequestTutorScreen";
import RequestSuccessScreen from "./src/screens/parent/RequestSuccessScreen";
import TutorSuggestionsScreen from "./src/screens/parent/TutorSuggestionsScreen";
import PaymentInstructionsScreen from "./src/screens/parent/PaymentInstructionsScreen";
import RequestDetailScreen from "./src/screens/common/RequestDetailScreen";
import ChatScreen from "./src/screens/common/ChatScreen";
import LegalScreen from "./src/screens/common/LegalScreen";
import ContactAdminScreen from "./src/screens/common/ContactAdminScreen";
import BrowseRequestsScreen from "./src/screens/teacher/BrowseRequestsScreen";
import HomeTab from "./src/navigation/tabs/HomeTab";
import RequestsTab from "./src/navigation/tabs/RequestsTab";
import AccountTab from "./src/navigation/tabs/AccountTab";
import NotificationsScreen from "./src/screens/common/NotificationsScreen";
import NewsListScreen from "./src/screens/common/NewsListScreen";
import NewsDetailScreen from "./src/screens/common/NewsDetailScreen";

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Smooth slide transition config (reused across screens)
const slideTransition = {
  animation: "slide_from_right",
  presentation: "card",
};

const fadeTransition = {
  animation: "fade",
};

function MainAppTabs() {
  const { user } = useContext(AuthContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontWeight: "600", fontSize: 12, marginBottom: 5 },
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          height: 60,
          paddingTop: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "My Requests")
            iconName = focused ? "document-text" : "document-text-outline";
          else if (route.name === "Browse")
            iconName = focused ? "search" : "search-outline";
          else if (route.name === "Account")
            iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: COLORS.darkGray,
        tabBarInactiveTintColor: COLORS.gray,
      })}
    >
      <Tab.Screen name="Home" component={HomeTab} />
      {user?.role === "teacher" && user?.verificationStatus === "Verified" && (
        <Tab.Screen name="Browse" component={BrowseRequestsScreen} />
      )}
      <Tab.Screen name="My Requests" component={RequestsTab} />
      <Tab.Screen name="Account" component={AccountTab} />
    </Tab.Navigator>
  );
}

import { usePushNotifications } from "./src/hooks/usePushNotifications";
import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

function AppRouter() {
  // Handle Notification Response (Deep Linking)
  const handleNotificationResponse = (response) => {
    const data = response.notification.request.content.data;
    if (data?.requestId && navigationRef.isReady()) {
      navigationRef.navigate('RequestDetails', { requestId: data.requestId });
    }
  };

  const { expoPushToken } = usePushNotifications(handleNotificationResponse);
  const { user, isLoading, navKey, registerPushToken } = useContext(AuthContext);

  // Register token when user logs in
  React.useEffect(() => {
    if (user && expoPushToken) {
      console.log("Registering token for user:", user.email);
      registerPushToken(expoPushToken);
    }
  }, [user, expoPushToken]);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  const renderScreens = () => {
    // ... existing render logic ...
    if (!user) {
      return (
        <RootStack.Group>
          <RootStack.Screen name="Welcome" component={WelcomeScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="SignUp" component={SignUpScreen} />
        </RootStack.Group>
      );
    }

    // THE DEFINITIVE FIX: The verification flow for ALL users is now handled in one block.
    if (user.verificationStatus === "Not Submitted") {
      return (
        <RootStack.Group>
          <RootStack.Screen
            name="Verification"
            component={VerificationScreen}
          />
          <RootStack.Screen
            name="VerificationSuccess"
            component={VerificationSuccessScreen}
          />
        </RootStack.Group>
      );
    }

    if (user.role === "teacher") {
      if (user.verificationStatus === "Pending") {
        return (
          <RootStack.Screen
            name="PendingVerification"
            component={PendingVerificationScreen}
          />
        );
      }
      if (!user.profileComplete) {
        return (
          <RootStack.Screen
            name="TeacherOnboarding"
            component={TeacherOnboardingScreen}
          />
        );
      }
    }

    return (
      <RootStack.Group>
        <RootStack.Screen name="MainApp" component={MainAppTabs} />
        <RootStack.Screen name="RequestTutor" component={RequestTutorScreen} />
        <RootStack.Screen
          name="RequestSuccess"
          component={RequestSuccessScreen}
        />
        <RootStack.Screen
          name="TutorSuggestions"
          component={TutorSuggestionsScreen}
        />
        <RootStack.Screen
          name="PaymentInstructions"
          component={PaymentInstructionsScreen}
        />
        <RootStack.Screen
          name="RequestDetails"
          component={RequestDetailScreen}
        />
        <RootStack.Screen
          name="TeacherOnboarding"
          component={TeacherOnboardingScreen}
        />
        <RootStack.Screen
          name="VerificationSuccess"
          component={VerificationSuccessScreen}
        />
        <RootStack.Screen name="ContactAdmin" component={ContactAdminScreen} />
        <RootStack.Screen name="Legal" component={LegalScreen} />
        <RootStack.Screen name="Chat" component={ChatScreen} />
        <RootStack.Screen name="Notifications" component={NotificationsScreen} />
        <RootStack.Screen name="NewsList" component={NewsListScreen} />
        <RootStack.Screen name="NewsDetail" component={NewsDetailScreen} />
        {/* Re-add Verification here for access from Account tab */}
        <RootStack.Screen name="Verification" component={VerificationScreen} />
      </RootStack.Group>
    );
  };

  return (
    <NavigationContainer key={navKey} ref={navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
          gestureEnabled: true,
        }}
      >
        {renderScreens()}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
