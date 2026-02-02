import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HomeScreenHeaderProps {
  title: string;
  scrollOffset: SharedValue<number>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const SCOLL_THRESHOLD_START = 50;
const SCOLL_THRESHOLD_END = 80;

const HomeScreenHeader = ({
  scrollOffset,
  searchQuery,
  setSearchQuery,
}: HomeScreenHeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Animated.View
      style={[styles.headerContainer, { paddingTop: insets.top, width: "80%" }]}
    >
      <View style={[styles.headerContent]}>
        {/* <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity> */}

        <Animated.View style={[styles.SearchBar]}>
          <Ionicons name="search" size={20} color="black" />
          <TextInput
            placeholder="Search movies"
            placeholderTextColor={"black"}
            style={{ flex: 1, marginLeft: 8, height: 40 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color="#888"
              style={{ marginLeft: 4 }}
              onPress={() => setSearchQuery("")}
            />
          )}
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default HomeScreenHeader;

const styles = StyleSheet.create({
  headerContainer: {
    // position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    // boxShadow: "0 4px 2px -2px rgba(0,0,0,0.1)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignSelf: "center",
  },

  SearchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    gap: 8,
    backgroundColor: "#e9ecef",
    width: "80%",
    alignSelf: "center",
    height: 36,
  },
});
