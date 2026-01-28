import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

import * as Clipboard from 'expo-clipboard';

const PaymentInstructionsScreen = ({ navigation }) => {
  const route = useRoute();
  const { requestId, selectedTutorIds } = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Account number copied to clipboard.");
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    try {
      const payload = { selectedTutorIds };
      await api.post(`/parents/request/${requestId}/finalize`, payload);
      Alert.alert(
        "Confirmation Sent",
        "We have received your confirmation. Your request is now awaiting payment review by the admin.",
        [{ text: "Go to Dashboard", onPress: () => navigation.popToTop() }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not submit your confirmation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const BankDetail = ({ bank, number, name }) => (
    <View>
      <Text style={styles.bankName}>{bank}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.detailValue}>{number}</Text>
        <TouchableOpacity onPress={() => copyToClipboard(number)} style={{ padding: 5 }}>
           <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.detailLabel}>{name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Final Step: Payment</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Ionicons name="card-outline" size={80} color={COLORS.darkGray} />
        <Text style={styles.subtitle}>
          To finalize your request, please make a one-time matching fee payment
          to any of the accounts below.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Bank Details</Text>
          
          <BankDetail bank="Zenith Bank" number="1212864590" name="Suxess Tuition Center" />
          <View style={styles.divider} />
          <BankDetail bank="Moniepoint MFB" number="6361181117" name="Adewale Eke" />
          <View style={styles.divider} />
          <BankDetail bank="EcoBank" number="4250098388" name="Success Tuition Centre" />

        </View>

        <Text style={styles.instructionText}>
          After making the payment, please click the button below to notify our
          admin team for confirmation.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleConfirmPayment}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.darkGray} />
          ) : (
            <Text style={styles.buttonText}>I Have Paid</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: { fontSize: 22, fontWeight: "bold", color: COLORS.darkGray },
  scrollContainer: { padding: 20, alignItems: "center" },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: "100%",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 15,
  },
  bankName: { fontSize: 16, fontWeight: "600", color: COLORS.darkGray },
  detailValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginVertical: 4,
  },
  detailLabel: { fontSize: 14, color: COLORS.gray },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 15 },
  instructionText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    fontStyle: "italic",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    height: 55,
    justifyContent: "center",
    width: "100%",
  },
  buttonText: { color: COLORS.darkGray, fontSize: 18, fontWeight: "600" },
});

export default PaymentInstructionsScreen;
