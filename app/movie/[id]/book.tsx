import ScreenBackButton from "@/components/ScreenBackButton";
import SeatMap from "@/components/SeatMap";
import SnackSelector from "@/components/SnackSelector";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { onValue, ref } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { database } from "../../../firebaseConfig";

const dates = [
  { date: "Mon", day: "15", month: "Nov" },
  { date: "Tue", day: "16", month: "Nov" },
  { date: "Wed", day: "17", month: "Nov" },
  { date: "Thu", day: "18", month: "Nov" },
  { date: "Fri", day: "19", month: "Nov" },
  { date: "Sat", day: "20", month: "Nov" },
  { date: "Sun", day: "21", month: "Nov" },
];

export default function BookingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = String(params.id || "");

  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatsTotal, setSeatsTotal] = useState(0);
  const [snacksTotal, setSnacksTotal] = useState(0);
  const [snackItems, setSnackItems] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setMovie(null);
      return;
    }
    const movieRef = ref(database, `movies/${id}`);
    const unsub = onValue(movieRef, (snap) => {
      const val = snap.val();
      if (!val) {
        setMovie(null);
        setLoading(false);
        return;
      }
      setMovie(val.id ? val : { id, ...val });
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  const handleSeatsChange = useCallback((seats: string[], total: number) => {
    setSelectedSeats(seats);
    setSeatsTotal(total);
  }, []);

  const handleSnacksChange = useCallback(
    (total: number, items: { [key: string]: number }) => {
      setSnacksTotal(total);
      setSnackItems(items);
    },
    [],
  );

  const calculateTotal = () => seatsTotal + snacksTotal;

  const handleProceedToPayment = () => {
    if (!movie) return;
    if (selectedSeats.length === 0) return;

    const ticketId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const ticketParams = {
      id: ticketId,
      movieId: movie.id,
      title: movie.title,
      seats: selectedSeats.join(","),
      seatsCount: String(selectedSeats.length),
      total: String(calculateTotal()),
      snacksTotal: String(snacksTotal || 0),
      date: dates[selectedDate]
        ? `${dates[selectedDate].day} ${dates[selectedDate].month}`
        : "",
      time:
        selectedTime !== null
          ? (movie.showTimes?.[selectedTime]?.time ?? "")
          : "",
      snacks: JSON.stringify(snackItems || {}),
    } as { [key: string]: string };

    router.push({ pathname: "/payment/[id]", params: ticketParams as any });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text>Movie not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenBackButton />
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* <Image
          source={{ uri: movie.image || movie.coverImage }}
          style={styles.poster}
        /> */}
        <Text style={styles.title}>{movie.title}</Text>

        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datesContainer}
        >
          {dates.map((d, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.dateItem,
                selectedDate === i && styles.selectedDate,
              ]}
              onPress={() => setSelectedDate(i)}
            >
              <Text
                style={[
                  styles.dateDay,
                  selectedDate === i && styles.selectedDate,
                ]}
              >
                {d.date}
              </Text>
              <Text
                style={[
                  styles.dateNumber,
                  selectedDate === i && styles.selectedDate,
                ]}
              >
                {d.day}
              </Text>
              <Text
                style={[
                  styles.dateMonth,
                  selectedDate === i && styles.selectedDate,
                ]}
              >
                {d.month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timesContainer}>
          {(movie.showTimes || []).map((s: any, idx: number) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.timeItem,
                selectedTime === idx && styles.selectedTime,
                !s.available && styles.unavailableTime,
              ]}
              onPress={() => s.available && setSelectedTime(idx)}
              disabled={!s.available}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === idx && styles.selectedTimeText,
                  !s.available && styles.unavailableTimeText,
                ]}
              >
                {s.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Select Seats</Text>
        <SeatMap onSeatsChange={handleSeatsChange} />

        <Text style={styles.sectionTitle}>Add Snacks</Text>
        <SnackSelector onSnacksChange={handleSnacksChange} />

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>
            UGX {calculateTotal().toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            selectedSeats.length === 0 && styles.disabledButton,
          ]}
          onPress={handleProceedToPayment}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.bookButtonText}>
            {selectedSeats.length === 0 ? "Select seats" : "Proceed to Payment"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: 20,
    paddingBottom: 0,
    marginTop: 40,
  },

  poster: {
    width: "100%",
    height: 260,
    borderRadius: 12,
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },

  datesContainer: {
    paddingBottom: 12,
    marginTop: 4,
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
  },

  selectedDate: {
    backgroundColor: "#e63946",
  },

  dateDay: {
    fontSize: 14,
    color: "#6c757d",
  },

  dateNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
  },
  dateMonth: {
    fontSize: 12,
    color: "#6c757d",
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
  },
  selectedTime: { backgroundColor: "#e63946" },
  unavailableTime: { opacity: 0.6, backgroundColor: "#f1f3f5" },
  timeText: { fontSize: 14, color: "#212529" },
  selectedTimeText: { color: "#fff" },
  unavailableTimeText: { color: "#adb5bd" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 12,
  },
  priceContainer: {},
  priceLabel: { fontSize: 12, color: "#6c757d" },
  priceValue: { fontSize: 18, fontWeight: "600" },
  bookButton: {
    backgroundColor: "#e63946",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  disabledButton: { backgroundColor: "#ced4da" },
  bookButtonText: { color: "#fff", fontWeight: "700" },
});
