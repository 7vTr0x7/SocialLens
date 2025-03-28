import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";

type SelectedPostProps = {
  selectedPost: {
    _id: Id<"posts">;
    _creationTime: number;
    caption?: string | undefined;
    userId: Id<"users">;
    imageUrl: string;
    storageId: Id<"_storage">;
    likes: number;
    comments: number;
  } | null;
  setSelectedPost: (post: Doc<"posts"> | null) => void;
};

export default function SelectedPost({
  selectedPost,
  setSelectedPost,
}: SelectedPostProps) {
  return (
    <Modal
      visible={!!selectedPost}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setSelectedPost(null)}>
      <View style={styles.modalBackdrop}>
        {selectedPost && (
          <View style={styles.postDetailContainer}>
            <View style={styles.postDetailHeader}>
              <TouchableOpacity onPress={() => setSelectedPost(null)}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <Image
              source={selectedPost.imageUrl}
              style={styles.postDetailImage}
              contentFit="cover"
            />
          </View>
        )}
      </View>
    </Modal>
  );
}
