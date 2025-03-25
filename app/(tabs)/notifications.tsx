import Loader from "@/components/Loader";
import { Notification } from "@/components/Notification";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { FlatList, Text, View } from "react-native";
import styles from "../../styles/notifications.styles";

export default function Notifications() {
  const notifications = useQuery(api.notifications.getNotifications);

  if (notifications === undefined) return <Loader />;
  if (notifications.length === 0) return <NoNotificationsFound />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={({ item }) => <Notification notification={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}></FlatList>
    </View>
  );
}

const NoNotificationsFound = () => {
  return (
    <View style={[styles.container, styles.centered]}>
      <Text style={{ color: COLORS.grey, fontSize: 20 }}>
        No notifications yet
      </Text>
    </View>
  );
};
