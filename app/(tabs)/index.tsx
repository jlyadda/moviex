import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Clock, Search, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';


const nowShowing = [
  {
    id: '1',
    title: 'Dune: Part Two',
    image: 'https://images.pexels.com/photos/3131971/pexels-photo-3131971.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    duration: '166 min',
    genre: 'Sci-Fi',
  },
  {
    id: '2',
    title: 'Oppenheimer',
    image: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    duration: '180 min',
    genre: 'Drama',
  },
];

const comingSoon = [
  {
    id: '3',
    title: 'Gladiator II',
    image: 'https://images.pexels.com/photos/4048182/pexels-photo-4048182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    releaseDate: 'Nov 22, 2024',
    genre: 'Action',
  },
  {
    id: '4',
    title: 'Furiosa',
    image: 'https://images.pexels.com/photos/2549572/pexels-photo-2549572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    releaseDate: 'May 24, 2024',
    genre: 'Action',
  },
];


export default function HomeScreen() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.username}>Jonathan</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Now Showing</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
          >
            {nowShowing.map((movie, index) => (
              <Animated.View 
                key={movie.id}
                entering={FadeInRight.delay(index * 200)}
                style={styles.movieCard}
              >
                <Link href={`/movie/${movie.id}`} asChild>
                  <TouchableOpacity activeOpacity={0.8}>
                    <Image source={{ uri: movie.image }} style={styles.movieImage} />
                    <View style={styles.movieInfo}>
                      <Text style={styles.movieTitle}>{movie.title}</Text>
                      <View style={styles.movieMeta}>
                        <View style={styles.rating}>
                          <Star size={16} color="#FFD700" fill="#FFD700" />
                          <Text style={styles.ratingText}>{movie.rating}</Text>
                        </View>
                        <View style={styles.duration}>
                          <Clock size={16} color="#888" />
                          <Text style={styles.durationText}>{movie.duration}</Text>
                        </View>
                      </View>
                      <Text style={styles.genre}>{movie.genre}</Text>
                      <TouchableOpacity style={styles.bookButton}>
                        <Text style={styles.bookButtonText}>Book Now</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Link>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          {comingSoon.map((movie, index) => (
            <Animated.View 
              key={movie.id}
              entering={FadeInRight.delay(index * 200)}
              style={styles.upcomingCard}
            >
              <Image source={{ uri: movie.image }} style={styles.upcomingImage} />
              <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingTitle}>{movie.title}</Text>
                <Text style={styles.releaseDate}>{movie.releaseDate}</Text>
                <Text style={styles.upcomingGenre}>{movie.genre}</Text>
              </View>
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
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  username: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  movieList: {
    paddingHorizontal: 20,
  },
  movieCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: '#262626',
    overflow: 'hidden',
  },
  movieImage: {
    width: '100%',
    height: 380,
  },
  movieInfo: {
    padding: 16,
  },
  movieTitle: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    marginLeft: 4,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    marginLeft: 4,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  genre: {
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: '#e63946',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  upcomingCard: {
    flexDirection: 'row',
    backgroundColor: '#262626',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  upcomingImage: {
    width: 100,
    height: 140,
  },
  upcomingInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  upcomingTitle: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  releaseDate: {
    color: '#e63946',
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  upcomingGenre: {
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
});
