import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';

interface TicketCardProps {
  id: string;
  movieTitle: string;
  image: string;
  date: string;
  time: string;
  cinema: string;
  seats: string[];
  qrCode: string;
  status: 'upcoming' | 'past';
  onPress?: () => void;
}

export default function TicketCard({
  movieTitle,
  image,
  date,
  time,
  cinema,
  seats,
  qrCode,
  status,
  onPress,
}: TicketCardProps) {
  const isPast = status === 'past';

  return (
    <TouchableOpacity 
      style={[styles.card, isPast && styles.pastCard]} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Image 
          source={{ uri: image }} 
          style={[styles.image, isPast && styles.pastImage]} 
        />
        <View style={styles.info}>
          <Text style={[styles.title, isPast && styles.pastText]}>{movieTitle}</Text>
          <View style={styles.infoRow}>
            <Calendar size={14} color={isPast ? '#adb5bd' : '#6c757d'} />
            <Text style={[styles.infoText, isPast && styles.pastText]}>{date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={14} color={isPast ? '#adb5bd' : '#6c757d'} />
            <Text style={[styles.infoText, isPast && styles.pastText]}>{time}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={14} color={isPast ? '#adb5bd' : '#6c757d'} />
            <Text style={[styles.infoText, isPast && styles.pastText]}>{cinema}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.divider}>
        <View style={styles.dividerCircleLeft} />
        <View style={styles.dividerLine} />
        <View style={styles.dividerCircleRight} />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.seatsContainer}>
          <Text style={[styles.seatsLabel, isPast && styles.pastText]}>Seats</Text>
          <Text style={[styles.seatsValue, isPast && styles.pastText]}>
            {seats.join(', ')}
          </Text>
        </View>
        <Image 
          source={{ uri: qrCode }} 
          style={[styles.qrCode, isPast && styles.pastQrCode]} 
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  pastCard: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    padding: 15,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  pastImage: {
    opacity: 0.6,
  },
  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
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
  divider: {
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
  footer: {
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