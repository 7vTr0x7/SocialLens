import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getUserByClerkId, getPostsByUser } from "../../convex/posts";
import { Doc } from "@/convex/_generated/dataModel";
import Loader from "@/components/Loader";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";
import { FlatList } from "react-native";
import SelectedImage from "@/components/SelectedImage";

export default function Profile() {
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const currentUser = useQuery(
    api.posts.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  )!;

  const [editedProfile, setEditedProfile] = useState({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });

  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);

  const posts = useQuery(api.posts.getPostsByUser, {
    userId: currentUser._id,
  });

  // const updateProfile = useMutation(api.users.updateProfile);

  const handleSaveProfile = async () => {};

  if (!currentUser || posts === undefined) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser.username}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={currentUser.image}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
          <Text style={styles.name}>{currentUser.fullname}</Text>
          {currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditModalVisible(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {posts.length === 0 && <NoPostsFound />}

        <FlatList
          data={posts}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => setSelectedPost(item)}>
              <Image
                source={item.imageUrl}
                style={styles.gridImage}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      <SelectedImage
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
      />
    </View>
  );
}

const NoPostsFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
    }}>
    <Ionicons name="image-outline" size={48} color={COLORS.white} />
    <Text style={{ fontSize: 20, color: COLORS.white }}>No posts yet</Text>
  </View>
);
