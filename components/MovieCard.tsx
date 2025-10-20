import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Star } from 'lucide-react-native';

interface MovieCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  genre: string;
}

export default function MovieCard({ id, title, image, rating, genre }: MovieCardProps) {
  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.rating}>{rating}</Text>
          </View>
          <Text style={styles.genre}>{genre}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    color: '#212529',
    fontFamily: 'Poppins-Medium',
  },
  genre: {
    fontSize: 14,
    color: '#6c757d',
    fontFamily: 'Poppins-Regular',
  },
});