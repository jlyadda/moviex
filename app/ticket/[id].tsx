import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg';

export default function TicketScreen() {
  const { id } = useLocalSearchParams();
  
  // Mock ticket data - in a real app, this would come from your backend
  const ticket = {
    movieTitle: 'Dune: Part Two',
    image: 'https://images.pexels.com/photos/3131971/pexels-photo-3131971.jpeg',
    date: 'March 15, 2024',
    time: '7:30 PM',
    cinema: 'Hall 1',
    seats: ['F12', 'F13'],
    ticketId: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.content}
        >
          <Text style={styles.title}>Your Ticket</Text>
          
          <View style={styles.ticketCard}>
            <Image 
              source={{ uri: ticket.image }} 
              style={styles.movieImage}
            />
            
            <View style={styles.ticketContent}>
              <Text style={styles.movieTitle}>{ticket.movieTitle}</Text>
              
              <View style={styles.infoRow}>
                <Calendar size={16} color="#888" />
                <Text style={styles.infoText}>{ticket.date}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Clock size={16} color="#888" />
                <Text style={styles.infoText}>{ticket.time}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MapPin size={16} color="#888" />
                <Text style={styles.infoText}>{ticket.cinema}</Text>
              </View>
              
              <View style={styles.seatsContainer}>
                <Text style={styles.seatsLabel}>Seats</Text>
                <Text style={styles.seatsValue}>{ticket.seats.join(', ')}</Text>
              </View>
            </View>

            <View style={styles.divider} />
            
            <View style={styles.qrContainer}>
              <QRCode
                value={ticket.ticketId}
                size={120}
                backgroundColor="#262626"
                color="#fff"
              />
              <Text style={styles.ticketId}>{ticket.ticketId}</Text>
            </View>
          </View>

          <Text style={styles.instructions}>
            Show this ticket at the cinema entrance. We recommend arriving 15 minutes before the show.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    marginBottom: 24,
  },
  ticketCard: {
    backgroundColor: '#262626',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  movieImage: {
    width: '100%',
    height: 200,
  },
  ticketContent: {
    padding: 20,
  },
  movieTitle: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
  },
  seatsContainer: {
    marginTop: 16,
  },
  seatsLabel: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  seatsValue: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
  },
  qrContainer: {
    padding: 20,
    alignItems: 'center',
  },
  ticketId: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginTop: 12,
  },
  instructions: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});