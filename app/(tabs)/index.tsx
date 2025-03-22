import { useAuth } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/home.styles";

const index = () => {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => signOut()}>
        <Text style={styles.text}>signout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;
