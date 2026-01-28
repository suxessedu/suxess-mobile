import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import api from "../services/api";

const SubjectPicker = ({
  visible,
  onClose,
  onSelectSubjects,
  selectedSubjects = [],
}) => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  // selectedItems local state to manage selection before confirming
  const [localSelected, setLocalSelected] = useState([]);

  useEffect(() => {
    if (visible) {
      setLocalSelected(selectedSubjects);
      fetchSubjects();
    }
  }, [visible]);

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/common/subjects");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subject) => {
    setLocalSelected((prev) => {
      if (prev.includes(subject)) {
        return prev.filter((s) => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };

  const handleConfirm = () => {
    onSelectSubjects(localSelected);
    onClose();
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Subjects</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.darkGray} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : (
            <ScrollView style={styles.listContainer}>
              {Object.entries(categories).map(([category, subjects]) => (
                <View key={category} style={styles.categoryContainer}>
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <Ionicons
                      name={expandedCategory === category ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={COLORS.gray}
                    />
                  </TouchableOpacity>
                  
                  {expandedCategory === category && (
                    <View style={styles.subjectsList}>
                      {subjects.map((subject) => (
                        <TouchableOpacity
                          key={subject}
                          style={styles.subjectItem}
                          onPress={() => toggleSubject(subject)}
                        >
                          <Text style={styles.subjectText}>{subject}</Text>
                          <View
                            style={[
                              styles.checkbox,
                              localSelected.includes(subject) && styles.checkboxSelected,
                            ]}
                          >
                            {localSelected.includes(subject) && (
                              <Ionicons name="checkmark" size={16} color="white" />
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>
                Confirm Selection ({localSelected.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  listContainer: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
    flex: 1,
  },
  subjectsList: {
    backgroundColor: "white",
  },
  subjectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  subjectText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
  },
  footer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SubjectPicker;
