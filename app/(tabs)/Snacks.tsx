import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Snacks = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.Container, { paddingBottom: insets.bottom }]}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 60 }}
      >
        <Text>Snacks</Text>
      </Animated.ScrollView>

      <Text>Snacks</Text>
    </View>
  );
};

export default Snacks;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
});
