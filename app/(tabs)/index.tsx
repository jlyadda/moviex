import { comingSoonMovies, nowShowingMovies } from "@/assets/data/movies";
import MovieCategoryHeader from "@/components/MovieCategoryHeader";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { onValue, ref } from "firebase/database";
import { AlertCircle, Clock, Heart, Search, Star } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { database } from "../../firebaseConfig";

export default function HomeScreen() {
  const [greeting, setGreeting] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [likedMovies, setLikedMovies] = useState<Set<string>>(new Set());
  const [data, setData] = useState(null);
  const [nowShowing, setNowShowing] = useState<any[]>(nowShowingMovies);
  const [comingSoon, setComingSoon] = useState<any[]>(comingSoonMovies);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Derived genres from current nowShowing list
  const allGenres = useMemo(() => {
    const list = Array.isArray(nowShowing) ? nowShowing : [];
    const genres = Array.from(
      new Set(
        list.flatMap((m: any) => {
          if (!m || !m.genre) return [];
          return Array.isArray(m.genre)
            ? m.genre.map((g: any) => String(g).trim())
            : String(m.genre)
                .split(/[,\/•]/)
                .map((s: string) => s.trim());
        }),
      ).values(),
    );
    return genres.sort((a: string, b: string) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
  }, [nowShowing]);

  // Filter Now Showing movies based on search and genre
  const filteredMovies = (Array.isArray(nowShowing) ? nowShowing : []).filter(
    (movie: any) => {
      const title = String(movie?.title || "").toLowerCase();
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];
      const matchesGenre = !selectedGenre || genres.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    },
  );

  const toggleLike = (movieId: string) => {
    const newLiked = new Set(likedMovies);
    if (newLiked.has(movieId)) {
      newLiked.delete(movieId);
    } else {
      newLiked.add(movieId);
    }
    setLikedMovies(newLiked);
  };

  useEffect(() => {
    const dataRef = ref(database, "movies");

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      setData(value);

      if (!value) return;

      // Convert Firebase object to array and filter by status
      let allMovies: any[] = [];
      if (Array.isArray(value)) {
        allMovies = value;
      } else if (typeof value === "object") {
        allMovies = Object.entries(value).map(([id, movie]: [string, any]) => ({
          id,
          ...movie,
        }));
      }

      // Filter by status
      const showing = allMovies.filter((m: any) => m.status === "Now Showing");
      const coming = allMovies.filter((m: any) => m.status === "Coming Soon");

      setNowShowing(showing);
      setComingSoon(coming);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {greeting}
              <Text style={styles.username}> Jonathan</Text>
            </Text>
            <Text style={styles.letsBook}>Let&apos;s book your next movie</Text>
          </View>
          <TouchableOpacity style={styles.ProfilePicture}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop",
              }}
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: 12,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Genre Filter */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.genreFilterContainer}
          contentContainerStyle={styles.genreFilterContent}
        >
          <TouchableOpacity
            style={[styles.genreTag, !selectedGenre && styles.genreTagActive]}
            onPress={() => setSelectedGenre(null)}
          >
            <Text
              style={[
                styles.genreTagText,
                !selectedGenre && styles.genreTagTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {allGenres.map((genre: string) => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.genreTag,
                selectedGenre === genre && styles.genreTagActive,
              ]}
              onPress={() => setSelectedGenre(genre)}
            >
              <Text
                style={[
                  styles.genreTagText,
                  selectedGenre === genre && styles.genreTagTextActive,
                ]}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView> */}

        <View style={{ height: 8 }} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MovieCategoryHeader title={"Now Showing"} />
            <TouchableOpacity>
              <Text style={styles.SeeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
          >
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie: any, index: number) => (
                <Animated.View
                  key={movie.id}
                  entering={FadeInRight.delay(index * 100)}
                  style={styles.movieCard}
                >
                  <Link
                    href={{ pathname: "/movie/[id]", params: { id: movie.id } }}
                    asChild
                  >
                    <TouchableOpacity
                      activeOpacity={0.85}
                      accessibilityLabel={`Open details for ${movie.title}`}
                    >
                      <View style={styles.movieImageContainer}>
                        <Image
                          source={{ uri: movie.image }}
                          style={styles.movieImage}
                        />
                        {/* {movie.status && (
                          <View style={styles.statusBadge}>
                            <Text style={styles.statusBadgeText}>
                              {movie.status}
                            </Text>
                          </View>
                        )} */}
                      </View>
                      <View style={styles.movieInfo}>
                        <Text numberOfLines={1} style={styles.movieTitle}>
                          {movie.title}
                        </Text>

                        <View style={styles.genreChipsRow}>
                          {(Array.isArray(movie.genre)
                            ? movie.genre
                            : String(movie.genre || "").split(",")
                          )
                            .slice(0, 2)
                            .map((g: any, i: number) => (
                              <View key={i} style={styles.genreChip}>
                                <Text style={styles.genreChipText}>
                                  {String(g).trim()}
                                </Text>
                              </View>
                            ))}
                        </View>

                        {movie.duration && (
                          <View style={styles.durationRow}>
                            <Clock size={12} color="#888" />
                            <Text style={styles.durationText}>
                              {movie.duration}
                            </Text>
                          </View>
                        )}
                        {movie.rating && (
                          <View style={styles.ratingBadge}>
                            <Star size={14} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.ratingBadgeText}>
                              {movie.rating}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  </Link>
                </Animated.View>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <AlertCircle size={48} color="#ccd0d4" />
                <Text style={styles.noResultsText}>No movies found</Text>
                <Text style={styles.noResultsMessage}>
                  Try a different search or clear filters to see more movies.
                </Text>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setSearchQuery("");
                    setSelectedGenre(null);
                  }}
                >
                  <Text style={styles.clearButtonText}>Clear filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MovieCategoryHeader title={"Coming Soon"} />
            <TouchableOpacity>
              <Text style={styles.SeeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {comingSoon.map((movie: any, index: number) => (
            <Animated.View
              key={movie.id}
              entering={FadeInRight.delay(index * 100)}
              style={styles.upcomingCard}
            >
              <Link
                href={{ pathname: "/movie/[id]", params: { id: movie.id } }}
                asChild
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: movie.image }}
                    style={styles.upcomingImage}
                  />
                  <View style={styles.upcomingInfo}>
                    <Text style={styles.upcomingTitle}>{movie.title}</Text>
                    <Text style={styles.upcomingGenre}>
                      {Array.isArray(movie.genre)
                        ? movie.genre.join(" • ")
                        : movie.genre}
                    </Text>
                    <Text style={styles.releaseDate}>
                      Releases: {movie.releaseDate}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>
              <TouchableOpacity
                style={[
                  styles.likeButton,
                  likedMovies.has(movie.id) && styles.likeButtonActive,
                ]}
                onPress={() => toggleLike(movie.id)}
              >
                <Heart
                  size={18}
                  color={likedMovies.has(movie.id) ? "#fff" : "#0a7ea4"}
                  fill={likedMovies.has(movie.id) ? "#0a7ea4" : "none"}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    // fontSize: 12,
    color: "#888",
    fontFamily: "Poppins-Regular",
    marginRight: 4,
  },
  username: {
    // fontSize: 12,
    color: "#181818",
    fontFamily: "Poppins-Bold",
    marginLeft: 4,
  },
  letsBook: {
    // fontSize: 12,
    color: "#181818",
    fontFamily: "Poppins-SemiBold",
    marginTop: 6,
    fontWeight: "700",
  },
  ProfilePicture: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
    alignContent: "center",
  },
  sectionTitle: {
    fontSize: 20,
    color: "#181818",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  SeeAll: {
    fontSize: 14,
    color: "#0a7ea4",
    fontFamily: "Poppins-Medium",
  },
  movieList: {
    paddingHorizontal: 20,
  },
  movieCard: {
    width: 220,
    // height: 379,
    height: "auto",
    marginRight: 16,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#ffffffff",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  movieImage: {
    width: "100%",
    // height: 299,
    height: 350,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    resizeMode: "cover",
  },
  movieInfo: {
    // padding: 8,
    alignItems: "center",
    marginBottom: 2,
  },
  movieTitle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 2,
  },
  movieMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  ratingText: {
    marginLeft: 4,
    color: "#888",
    fontFamily: "Poppins-Medium",
  },
  duration: {
    flexDirection: "row",
    alignItems: "center",
  },
  genre: {
    color: "#888",
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  bookButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  bookButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Medium",
  },
  // Search & Filter Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins-Regular",
  },
  genreFilterContainer: {
    maxHeight: 44,
  },
  genreFilterContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  genreTag: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  genreTagActive: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  genreTagText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins-Medium",
  },
  genreTagTextActive: {
    color: "#fff",
  },
  // Movie Card Enhancements
  movieImageContainer: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  ratingBadgeText: {
    marginLeft: 4,
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(10,126,164,0.95)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Poppins-Medium",
  },
  genreChipsRow: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 6,
  },
  genreChip: {
    backgroundColor: "#f1f3f5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  genreChipText: {
    fontSize: 11,
    color: "#6c757d",
    fontFamily: "Poppins-Medium",
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  durationText: {
    marginLeft: 4,
    color: "#888",
    fontSize: 11,
    fontFamily: "Poppins-Regular",
  },
  noResultsContainer: {
    width: 220,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    marginTop: 8,
    color: "#999",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  noResultsMessage: {
    marginTop: 6,
    color: "#6c757d",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    maxWidth: 260,
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
  upcomingCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingRight: 0,
  },
  upcomingImage: {
    width: 90,
    height: 110,
    borderRadius: 12,
    marginLeft: 12,
  },
  upcomingInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  upcomingTitle: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },
  releaseDate: {
    color: "#0a7ea4",
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    marginTop: 4,
  },
  upcomingGenre: {
    color: "#888",
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  notifyButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  notifyText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    marginLeft: 4,
  },
  likeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#0a7ea4",
  },
  likeButtonActive: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  containerGap36: {},
});
