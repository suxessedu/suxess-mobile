import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = ({ navigation }) => {
  const route = useRoute();
  const { requestId, otherUserName } = route.params;
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/messages/${requestId}`);
        setMessages(response.data.reverse());
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [requestId]);

  useFocusEffect(fetchMessages);

  const handleSend = async () => {
    if (newMessage.trim() === "") return;
    const tempMessage = newMessage;
    setNewMessage("");
    try {
      await api.post(`/messages/${requestId}`, { body: tempMessage });
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message", error);
      setNewMessage(tempMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color={COLORS.darkGray}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{otherUserName}</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {loading ? (
          <ActivityIndicator style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            inverted
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.senderId === user.id
                    ? styles.myMessage
                    : styles.theirMessage,
                ]}
              >
                <Text
                  style={
                    item.senderId === user.id
                      ? styles.myMessageText
                      : styles.theirMessageText
                  }
                >
                  {item.body}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.messageList}
          />
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.gray}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color={COLORS.darkGray} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: COLORS.white,
  },
  backButton: { padding: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.darkGray },
  keyboardAvoidingView: { flex: 1 },
  messageList: { paddingHorizontal: 10, paddingTop: 10 },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    maxWidth: "80%",
    marginBottom: 10,
  },
  myMessage: { backgroundColor: COLORS.primary, alignSelf: "flex-end" },
  theirMessage: { backgroundColor: COLORS.lightGray, alignSelf: "flex-start" },
  myMessageText: { fontSize: 16, color: COLORS.darkGray },
  theirMessageText: { fontSize: 16, color: COLORS.darkGray },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.lightGray,
    borderRadius: 22,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
