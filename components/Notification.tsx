import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import styles from "@/styles/notifications.styles";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type NotificationPropType = {
  notification: {
    postId?: Id<"posts">;
    commentId?: Id<"comments">;
    type: "like" | "comment" | "follow";
    receiverId: Id<"users">;
    senderId: Id<"users">;
    sender: {
      _id: Id<"users">;
      username: string;
      image: string;
    };
    post?: {
      caption?: string;
      userId: Id<"users">;
      imageUrl: string;
      storageId: Id<"_storage">;
      likes: number;
      comments: number;
    } | null;
    comment?: string;
    _creationTime: number;
  };
};

export const Notification = ({ notification }: NotificationPropType) => {
  return (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Link href={`/user/${notification?.sender?._id}`} asChild>
          <TouchableOpacity style={styles.avatarContainer}>
            <Image
              source={notification.sender.image}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.iconBadge}>
              {notification.type === "like" ? (
                <Ionicons name="heart" size={14} color={COLORS.primary} />
              ) : notification.type === "follow" ? (
                <Ionicons name="person-add" size={14} color={"#0b5cf6"} />
              ) : (
                <Ionicons name="chatbubble" size={14} color={"#3b83f6"} />
              )}
            </View>
          </TouchableOpacity>
        </Link>

        <View style={styles.notificationInfo}>
          <Link href={`/user/${notification?.sender?._id}`} asChild>
            <TouchableOpacity>
              <Text style={styles.username}>
                {notification.sender.username}
              </Text>
            </TouchableOpacity>
          </Link>

          <Text style={styles.action}>
            {notification.type === "follow"
              ? "started following you"
              : notification.type === "like"
                ? "liked your post"
                : `commented: ${notification.comment}`}
          </Text>
          <Text style={styles.timeAgo}>
            {formatDistanceToNow(notification._creationTime, {
              addSuffix: true,
            })}
          </Text>
        </View>
      </View>

      {notification.postId && notification.post && (
        <Image
          source={notification.post.imageUrl}
          style={styles.postImage}
          contentFit="cover"
          transition={200}
        />
      )}
    </View>
  );
};
