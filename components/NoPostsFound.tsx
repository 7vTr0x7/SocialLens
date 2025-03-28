import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const NoPostsFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
    }}>
    <Ionicons name="images-outline" size={48} color={COLORS.white} />
    <Text style={{ fontSize: 20, color: COLORS.white }}>No posts yet</Text>
  </View>
);

export default NoPostsFound;
