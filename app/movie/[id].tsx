import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Clock, Star } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import SeatMap from '../../components/SeatMap';
import SnackSelector from '../../components/SnackSelector';

const { width } = Dimensions.get('window');

// Mock movie data (previous data remains the same)
const moviesData = {
  '1': {
    id: '1',
    title: 'Dune: Part Two',
    image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1170&auto=format&fit=crop',
    rating: 4.8,
    duration: '166 min',
    genre: 'Sci-Fi',
    releaseDate: 'March 1, 2024',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Josh Brolin'],
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.',
    showTimes: [
      { time: '10:30 AM', available: true },
      { time: '1:15 PM', available: true },
      { time: '4:00 PM', available: true },
      { time: '7:30 PM', available: true },
      { time: '10:15 PM', available: false },
    ],
  },
  // ... (rest of the movie data remains the same)
};

// Mock dates (previous data remains the same)
const dates = [
  { date: 'Mon', day: '15', month: 'May', isSelected: true },
  { date: 'Tue', day: '16', month: 'May', isSelected: false },
  { date: 'Wed', day: '17', month: 'May', isSelected: false },
  { date: 'Thu', day: '18', month: 'May', isSelected: false },
  { date: 'Fri', day: '19', month: 'May', isSelected: false },
  { date: 'Sat', day: '20', month: 'May', isSelected: false },
  { date: 'Sun', day: '21', month: 'May', isSelected: false },
];

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const movie = moviesData[id as string];
  
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatsTotal, setSeatsTotal] = useState(0);
  const [snacksTotal, setSnacksTotal] = useState(0);
  const [snackItems, setSnackItems] = useState<{ [key: string]: number }>({});
  const [currentStep, setCurrentStep] = useState<'seats' | 'snacks'>('seats');

  // Bottom sheet configuration
  const snapPoints = useMemo(() => ['50%', '95%'], []);

  const handleSeatsChange = useCallback((seats: string[], total: number) => {
    setSelectedSeats(seats);
    setSeatsTotal(total);
  }, []);

  const handleSnacksChange = useCallback((total: number, items: { [key: string]: number }) => {
    setSnacksTotal(total);
    setSnackItems(items);
  }, []);

  const calculateTotal = () => {
    return seatsTotal + snacksTotal;
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length > 0) {
      router.push({
        pathname: '/payment/[id]',
        params: {
          id,
          total: calculateTotal(),
          seats: selectedSeats.length,
          snacks: snacksTotal,
        },
      });
    }
  };

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Movie not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: movie.image }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Animated.View entering={FadeIn.duration(500)}>
            <Text style={styles.title}>{movie.title}</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.rating}>{movie.rating}</Text>
              </View>
              <View style={styles.infoItem}>
                <Clock size={16} color="#6c757d" />
                <Text style={styles.infoText}>{movie.duration}</Text>
              </View>
              <Text style={styles.genre}>{movie.genre}</Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Release Date</Text>
                <Text style={styles.detailValue}>{movie.releaseDate}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Director</Text>
                <Text style={styles.detailValue}>{movie.director}</Text>
              </View>
            </View>

            <View style={styles.castContainer}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <View style={styles.castList}>
                {movie.cast.map((actor, index) => (
                  <View key={index} style={styles.castItem}>
                    <Text style={styles.castName}>{actor}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.synopsisContainer}>
              <Text style={styles.sectionTitle}>Synopsis</Text>
              <Text style={styles.synopsisText}>{movie.synopsis}</Text>
            </View>

            <View style={styles.bookingContainer}>
              <Text style={styles.sectionTitle}>Select Date</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.datesContainer}
              >
                {dates.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateItem,
                      selectedDate === index && styles.selectedDate,
                    ]}
                    onPress={() => setSelectedDate(index)}
                  >
                    <Text 
                      style={[
                        styles.dateDay, 
                        selectedDate === index && styles.selectedDateText
                      ]}
                    >
                      {item.date}
                    </Text>
                    <Text 
                      style={[
                        styles.dateNumber, 
                        selectedDate === index && styles.selectedDateText
                      ]}
                    >
                      {item.day}
                    </Text>
                    <Text 
                      style={[
                        styles.dateMonth, 
                        selectedDate === index && styles.selectedDateText
                      ]}
                    >
                      {item.month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.sectionTitle}>Select Time</Text>
              <View style={styles.timesContainer}>
                {movie.showTimes.map((showTime, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeItem,
                      selectedTime === index && styles.selectedTime,
                      !showTime.available && styles.unavailableTime,
                    ]}
                    onPress={() => showTime.available && setSelectedTime(index)}
                    disabled={!showTime.available}
                  >
                    <Text 
                      style={[
                        styles.timeText,
                        selectedTime === index && styles.selectedTimeText,
                        !showTime.available && styles.unavailableTimeText,
                      ]}
                    >
                      {showTime.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>UGX {calculateTotal().toLocaleString()}</Text>
          {selectedSeats.length > 0 && (
            <Text style={styles.seatsSelected}>
              {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
            </Text>
          )}
        </View>
        {currentStep === 'seats' ? (
          <TouchableOpacity 
            style={[
              styles.bookButton,
              (selectedTime === null) && styles.disabledButton
            ]}
            disabled={selectedTime === null}
            onPress={() => setCurrentStep('snacks')}
          >
            <Text style={styles.bookButtonText}>
              {selectedSeats.length > 0 ? 'Continue to Snacks' : 'Select Seats'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={handleProceedToPayment}
          >
            <Text style={styles.bookButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        )}
      </View>

      <BottomSheet
        snapPoints={snapPoints}
        enablePanDownToClose
        index={selectedTime !== null ? 0 : -1}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>
              {currentStep === 'seats' ? 'Select Your Seats' : 'Add Snacks'}
            </Text>
            {currentStep === 'seats' && selectedSeats.length > 0 && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => setCurrentStep('snacks')}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            )}
            {currentStep === 'snacks' && (
              <TouchableOpacity
                style={styles.backToSeatsButton}
                onPress={() => setCurrentStep('seats')}
              >
                <Text style={styles.backToSeatsText}>Back to Seats</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {currentStep === 'seats' ? (
            <SeatMap onSeatsChange={handleSeatsChange} />
          ) : (
            <SnackSelector onSnacksChange={handleSnacksChange} />
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    color: '#212529',
    fontFamily: 'Poppins-Medium',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#6c757d',
    fontFamily: 'Poppins-Regular',
  },
  genre: {
    fontSize: 14,
    color: '#6c757d',
    fontFamily: 'Poppins-Regular',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
  },
  detailValue: {
    fontSize: 14,
    color: '#212529',
    fontFamily: 'Poppins-Medium',
  },
  castContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
  },
  castList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  castItem: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  castName: {
    fontSize: 14,
    color: '#212529',
    fontFamily: 'Poppins-Medium',
  },
  synopsisContainer: {
    marginBottom: 20,
  },
  synopsisText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#495057',
    fontFamily: 'Poppins-Regular',
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
    backgroundColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedDate: {
    backgroundColor: '#e63946',
  },
  dateDay: {
    fontSize: 14,
    color: '#6c757d',
    fontFamily: 'Poppins-Regular',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
  },
  dateMonth: {
    fontSize: 12,
    color: '#6c757d',
    fontFamily: 'Poppins-Regular',
  },
  selectedDateText: {
    color: '#fff',
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedTime: {
    backgroundColor: '#e63946',
  },
  unavailableTime: {
    backgroundColor: '#f1f3f5',
    opacity: 0.6,
  },
  timeText: {
    fontSize: 14,
    color: '#212529',
    fontFamily: 'Poppins-Medium',
  },
  selectedTimeText: {
    color: '#fff',
  },
  unavailableTimeText: {
    color: '#adb5bd',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontFamily: 'Poppins-Regular',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
  },
  seatsSelected: {
    fontSize: 12,
    color: '#6c757d',
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: '#e63946',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#ced4da',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  backButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  bottomSheetContent: {
    flex: 1,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
  },
  nextButton: {
    backgroundColor: '#e63946',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  backToSeatsButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backToSeatsText: {
    color: '#495057',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
});