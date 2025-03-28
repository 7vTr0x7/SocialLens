import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import Loader from "./Loader";

type EditProfileModalProps = {
  isEditModalVisible: boolean;
  setIsEditModalVisible: Dispatch<SetStateAction<boolean>>;
  editedProfile: {
    fullname: string;
    bio: string;
  };
  setEditedProfile: Dispatch<
    SetStateAction<{
      fullname: string;
      bio: string;
    }>
  >;

  handleSaveProfile: () => void;

  isSaving: boolean;
};

export default function EditProfileModal({
  isEditModalVisible,
  setIsEditModalVisible,
  editedProfile,
  setEditedProfile,
  handleSaveProfile,
  isSaving,
}: EditProfileModalProps) {
  return (
    <Modal
      visible={isEditModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsEditModalVisible(false)}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.fullname}
                onChangeText={(text) =>
                  setEditedProfile((prev) => ({ ...prev, fullname: text }))
                }
                placeholderTextColor={COLORS.grey}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={editedProfile.bio}
                onChangeText={(text) =>
                  setEditedProfile((prev) => ({ ...prev, bio: text }))
                }
                multiline
                numberOfLines={4}
                placeholderTextColor={COLORS.grey}
              />
            </View>

            {isSaving ? (
              <Loader />
            ) : (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
