import { useAuth } from "@clerk/clerk-expo";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import styles from "../../styles/feed.styles";
import { STORIES } from "@/constants/mock-data";
import Story from "@/components/Story";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Loader from "@/components/Loader";
import Post from "@/components/Post";
import StoriesSection from "@/components/StoriesSection";
import { useState } from "react";

const index = () => {
  const { signOut } = useAuth();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const posts = useQuery(api.posts.getFeedPosts);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  if (posts === undefined) return <Loader />;

  if (posts?.length === 0) return <NoPostsFound />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>sociallens</Text>
        <TouchableOpacity
          onPress={async () => {
            try {
              await signOut();
            } catch (err) {
              console.log("SignOut Error:", err);
            }
          }}>
          <Ionicons name="log-in-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={<StoriesSection />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
};

export default index;

const NoPostsFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
    }}>
    <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
  </View>
);
