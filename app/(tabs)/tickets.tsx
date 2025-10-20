import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Mock data for tickets
const tickets = [
  {
    id: '1',
    movieTitle: 'Dune: Part Two',
    image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1170&auto=format&fit=crop',
    date: 'May 15, 2024',
    time: '7:30 PM',
    cinema: 'Numax Cinemas - Hall 2',
    seats: ['G7', 'G8'],
    qrCode: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=1170&auto=format&fit=crop',
    status: 'upcoming',
  },
  {
    id: '2',
    movieTitle: 'The Batman',
    image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1170&auto=format&fit=crop',
    date: 'May 10, 2024',
    time: '6:15 PM',
    cinema: 'Numax Cinemas - Hall 1',
    seats: ['D12', 'D13', 'D14'],
    qrCode: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=1170&auto=format&fit=crop',
    status: 'past',
  },
];

export default function TicketsScreen() {
  const upcomingTickets = tickets.filter(ticket => ticket.status === 'upcoming');
  const pastTickets = tickets.filter(ticket => ticket.status === 'past');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tickets</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {upcomingTickets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {upcomingTickets.map((ticket, index) => (
              <Animated.View 
                key={ticket.id}
                entering={FadeInUp.delay(index * 100).springify()}
              >
                <TouchableOpacity style={styles.ticketCard} activeOpacity={0.9}>
                  <View style={styles.ticketHeader}>
                    <Image source={{ uri: ticket.image }} style={styles.movieImage} />
                    <View style={styles.movieInfo}>
                      <Text style={styles.movieTitle}>{ticket.movieTitle}</Text>
                      <View style={styles.infoRow}>
                        <Calendar size={14} color="#6c757d" />
                        <Text style={styles.infoText}>{ticket.date}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Clock size={14} color="#6c757d" />
                        <Text style={styles.infoText}>{ticket.time}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <MapPin size={14} color="#6c757d" />
                        <Text style={styles.infoText}>{ticket.cinema}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.ticketDivider}>
                    <View style={styles.dividerCircleLeft} />
                    <View style={styles.dividerLine} />
                    <View style={styles.dividerCircleRight} />
                  </View>
                  
                  <View style={styles.ticketFooter}>
                    <View style={styles.seatsContainer}>
                      <Text style={styles.seatsLabel}>Seats</Text>
                      <Text style={styles.seatsValue}>{ticket.seats.join(', ')}</Text>
                    </View>
                    <Image source={{ uri: ticket.qrCode }} style={styles.qrCode} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}

        {pastTickets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past</Text>
            {pastTickets.map((ticket, index) => (
              <Animated.View 
                key={ticket.id}
                entering={FadeInUp.delay(index * 100).springify()}
                style={[styles.ticketCard, styles.pastTicket]}
              >
                <View style={styles.ticketHeader}>
                  <Image 
                    source={{ uri: ticket.image }} 
                    style={[styles.movieImage, styles.pastImage]} 
                  />
                  <View style={styles.movieInfo}>
                    <Text style={[styles.movieTitle, styles.pastText]}>{ticket.movieTitle}</Text>
                    <View style={styles.infoRow}>
                      <Calendar size={14} color="#adb5bd" />
                      <Text style={[styles.infoText, styles.pastText]}>{ticket.date}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Clock size={14} color="#adb5bd" />
                      <Text style={[styles.infoText, styles.pastText]}>{ticket.time}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <MapPin size={14} color="#adb5bd" />
                      <Text style={[styles.infoText, styles.pastText]}>{ticket.cinema}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.ticketDivider}>
                  <View style={styles.dividerCircleLeft} />
                  <View style={styles.dividerLine} />
                  <View style={styles.dividerCircleRight} />
                </View>
                
                <View style={styles.ticketFooter}>
                  <View style={styles.seatsContainer}>
                    <Text style={[styles.seatsLabel, styles.pastText]}>Seats</Text>
                    <Text style={[styles.seatsValue, styles.pastText]}>{ticket.seats.join(', ')}</Text>
                  </View>
                  <Image 
                    source={{ uri: ticket.qrCode }} 
                    style={[styles.qrCode, styles.pastQrCode]} 
                  />
                </View>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    fontFamily: 'Poppins-Bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 15,
    paddingHorizontal: 20,
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  pastTicket: {
    opacity: 0.7,
  },
  ticketHeader: {
    flexDirection: 'row',
    padding: 15,
  },
  movieImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  pastImage: {
    opacity: 0.6,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6c757d',
    fontFamily: 'Poppins-Regular',
  },
  pastText: {
    color: '#adb5bd',
  },
  ticketDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  dividerCircleLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    marginLeft: -10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#dee2e6',
  },
  dividerCircleRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    marginRight: -10,
  },
  ticketFooter: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatsContainer: {
    flex: 1,
  },
  seatsLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
  },
  seatsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
  },
  qrCode: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  pastQrCode: {
    opacity: 0.5,
  },
});