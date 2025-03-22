import { useAuth } from "@clerk/clerk-expo";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import styles from "../../styles/feed.styles";
import { STORIES } from "@/constants/mock-data";
import Story from "@/components/Story";

const index = () => {
  const { signOut } = useAuth();

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

      <ScrollView horizontal showsHorizontalScrollIndicator>
        {STORIES.map((story) => (
          <Story key={story.id} story={story} />
        ))}
      </ScrollView>
    </View>
  );
};

export default index;
