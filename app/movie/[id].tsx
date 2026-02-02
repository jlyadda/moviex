import ScreenBackButton from "@/components/ScreenBackButton";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { onValue, ref } from "firebase/database";
import { Calendar, Clock, Star, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { database } from "../../firebaseConfig";

// Mock dates (previous data remains the same)
const { width } = Dimensions.get("window");

const dates = [
  { date: "Mon", day: "15", month: "Nov", isSelected: true },
  { date: "Tue", day: "16", month: "Nov", isSelected: false },
  { date: "Wed", day: "17", month: "Nov", isSelected: false },
  { date: "Thu", day: "18", month: "Nov", isSelected: false },
  { date: "Fri", day: "19", month: "Nov", isSelected: false },
  { date: "Sat", day: "20", month: "Nov", isSelected: false },
  { date: "Sun", day: "21", month: "Nov", isSelected: false },
];

export default function MovieDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const id = String(params.id || "");
  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking state moved to a dedicated booking screen (`/movie/[id]/book`).
  // The movie details screen no longer handles date/time/seat selection.

  // Fetch movie by id from Firebase on mount
  useEffect(() => {
    if (!id) {
      setLoading(false);
      setMovie(null);
      return;
    }

    const movieRef = ref(database, `movies/${id}`);
    const unsub = onValue(movieRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        setMovie(null);
        setLoading(false);
        return;
      }

      // if the stored value does not include id, merge it
      const normalized = val.id ? val : { id, ...val };
      setMovie(normalized);
      setLoading(false);
    });

    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.errorContainer}>
        <ScreenBackButton />
        <Text style={styles.errorText}>Loading...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <ScreenBackButton />
        <Text style={styles.errorText}>Movie not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={styles.container}
        edges={["left", "right", "bottom"]}
      >
        <StatusBar hidden />
        <Stack.Screen options={{ headerShown: false }} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Animated.Image
              resizeMode={"cover"}
              source={{ uri: movie.coverImage || movie.image }}
              style={[styles.coverImage]}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.85)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            />

            <TouchableOpacity
              style={styles.backBtnOverlay}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backBtnText}>‹</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <Animated.View entering={FadeIn.duration(500)}>
              <Text numberOfLines={2} style={styles.title}>
                {movie.title}
              </Text>

              <View style={styles.genreChipsRow}>
                {(Array.isArray(movie.genre)
                  ? movie.genre
                  : String(movie.genre || "").split(",")
                ).map((g: any, i: number) => (
                  <View key={i} style={styles.genreChip}>
                    <Text style={styles.genreChipText}>{String(g).trim()}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.infoRow}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.rating}>{movie.rating}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Clock size={16} color="#6c757d" />
                  <Text style={styles.infoText}>{movie.duration}</Text>
                </View>
                {/* Join genres with a centered dot for nicer display */}
                {/* <Text style={styles.genre}>
                  {Array.isArray(movie.genre)
                    ? movie.genre.join(" \u2022 ")
                    : movie.genre}
                </Text> */}
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Users size={16} color="#e63946" />
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={styles.detailLabel}>Director</Text>
                    <Text style={styles.detailValue}>
                      {movie.director || "TBA"}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Calendar size={16} color="#e63946" />
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={styles.detailLabel}>
                      {movie.status === "Coming Soon"
                        ? "Premiere Date"
                        : "Release Date"}
                    </Text>
                    <Text style={styles.detailValue}>
                      {movie.premiereDate || movie.releaseDate || "TBA"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.castContainer}>
                <Text style={styles.sectionTitle}>Cast</Text>
                <View style={styles.castList}>
                  {(movie.cast || []).map((actor: string, index: number) => (
                    <View key={index} style={styles.castChipRow}>
                      <Text style={styles.castChipText}>{actor}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.synopsisContainer}>
                <Text style={styles.sectionTitle}>Synopsis</Text>
                <Text style={styles.synopsisText}>{movie.synopsis}</Text>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
        <View style={{ marginBottom: 20, width: "90%", alignSelf: "center" }}>
          <TouchableOpacity
            style={[
              styles.bookButton,
              {
                alignSelf: "stretch",
                marginTop: 8,
                marginBottom: 16,
                alignContent: "center",
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/movie/[id]/book",
                params: { id: movie.id },
              })
            }
          >
            <Text style={styles.bookButtonText}>Get Tickets</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    height: "100%",
  },
  imageContainer: {
    height: 260,
    width: "100%",
    position: "relative",
    // top: 0,
    // left: 0,
    // right: 0,
    // zIndex: 0,
  },
  coverImage: {
    width: width,
    height: 260,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
  },
  backBtnOverlay: {
    position: "absolute",
    top: 18,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  backBtnText: {
    color: "#fff",
    fontSize: 26,
    lineHeight: 26,
  },
  statusBadge: {
    position: "absolute",
    top: 22,
    left: 20,
    backgroundColor: "rgba(230,57,70,0.95)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    zIndex: 10,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop: -20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    color: "#212529",
    fontFamily: "Poppins-Medium",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#6c757d",
    fontFamily: "Poppins-Regular",
  },
  genre: {
    fontSize: 14,
    color: "#6c757d",
    fontFamily: "Poppins-Regular",
  },
  genreChipsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  genreChip: {
    backgroundColor: "rgba(0,0,0,0.06)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
  },
  genreChipText: {
    color: "#495057",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 5,
    fontFamily: "Poppins-Regular",
  },
  detailValue: {
    fontSize: 14,
    color: "#212529",
    fontFamily: "Poppins-Medium",
  },
  castContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#212529",
    fontFamily: "Poppins-SemiBold",
  },
  castList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  castChipRow: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  castChipText: {
    fontSize: 14,
    color: "#212529",
    fontFamily: "Poppins-Medium",
  },
  synopsisContainer: {
    marginBottom: 20,
  },
  synopsisText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#495057",
    fontFamily: "Poppins-Regular",
  },
  bookingContainer: {
    marginBottom: 20,
  },
  datesContainer: {
    paddingBottom: 15,
  },
  dateItem: {
    width: 60,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedDate: {
    backgroundColor: "#e63946",
  },
  dateDay: {
    fontSize: 14,
    color: "#6c757d",
    fontFamily: "Poppins-Regular",
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    fontFamily: "Poppins-SemiBold",
  },
  dateMonth: {
    fontSize: 12,
    color: "#6c757d",
    fontFamily: "Poppins-Regular",
  },
  selectedDateText: {
    color: "#fff",
  },
  timesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  timeItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginRight: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedTime: {
    backgroundColor: "#e63946",
  },
  unavailableTime: {
    backgroundColor: "#f1f3f5",
    opacity: 0.6,
  },
  timeText: {
    fontSize: 14,
    color: "#212529",
    fontFamily: "Poppins-Medium",
  },
  selectedTimeText: {
    color: "#fff",
  },
  unavailableTimeText: {
    color: "#adb5bd",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#6c757d",
    fontFamily: "Poppins-Regular",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
    fontFamily: "Poppins-SemiBold",
  },
  seatsSelected: {
    fontSize: 12,
    color: "#6c757d",
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: "#e63946",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: "#ced4da",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: "Poppins-SemiBold",
  },
  backButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Medium",
  },
  bottomSheetContent: {
    flex: 1,
  },
  bottomSheetScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    fontFamily: "Poppins-SemiBold",
  },
  nextButton: {
    backgroundColor: "#e63946",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  backToSeatsButton: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backToSeatsText: {
    color: "#495057",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  // New styles for enhanced UI
  unavailableBadge: {
    fontSize: 10,
    color: "#adb5bd",
    fontFamily: "Poppins-Medium",
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 16,
    paddingHorizontal: 0,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e9ecef",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#e63946",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#6c757d",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  priceBreakdown: {
    marginVertical: 4,
  },
  priceBreakdownItem: {
    fontSize: 11,
    color: "#6c757d",
    fontFamily: "Poppins-Regular",
    marginBottom: 2,
  },
});
