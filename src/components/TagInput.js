import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const TagInput = ({ label, onTagsChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);

  const handleAddTag = () => {
    const trimmedInput = inputValue.trim();
    if (
      trimmedInput &&
      !tags.some((tag) => tag.toLowerCase() === trimmedInput.toLowerCase())
    ) {
      const newTags = [...tags, trimmedInput];
      setTags(newTags);
      onTagsChange(newTags.join(", "));
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    onTagsChange(newTags.join(", "));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="e.g., Math, English"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAddTag}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTag}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity
              onPress={() => handleRemoveTag(tag)}
              style={styles.removeButton}
            >
              <Ionicons name="close" size={16} color={COLORS.darkGray} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 50,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
  },
  addButtonText: {
    color: COLORS.darkGray,
    fontWeight: "bold",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  tagText: {
    color: COLORS.darkGray,
    fontWeight: "500",
  },
  removeButton: {
    marginLeft: 8,
  },
});

export default TagInput;
