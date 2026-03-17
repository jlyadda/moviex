import ScreenBackButton from "@/components/ScreenBackButton";
import SeatMap from "@/components/SeatMap";
import SnackSelector from "@/components/SnackSelector";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { onValue, ref } from "firebase/database";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { database } from "../../../firebaseConfig";

/* ---------- helpers ---------- */

function getDates(numDays = 7) {
  const days = [];
  const today = new Date();

  for (let i = 0; i < numDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    days.push({
      date: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate().toString(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      full: d,
    });
  }

  return days;
}

const dates = getDates(7);

/* ---------- component ---------- */

export default function BookingScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const id = String(params.id || "");

  /* ✅ hooks must be inside component */
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isSnackSheetOpen, setSnackSheetOpen] = useState(false);

  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatsTotal, setSeatsTotal] = useState(0);

  const [snacksTotal, setSnacksTotal] = useState(0);
  const [snackItems, setSnackItems] = useState<{ [key: string]: number }>({});

  /* ---------- fetch movie ---------- */

  useEffect(() => {
    if (!id) {
      setMovie(null);
      setLoading(false);
      return;
    }

    const movieRef = ref(database, `movies/${id}`);

    const unsubscribe = onValue(movieRef, (snap) => {
      const val = snap.val();

      if (!val) {
        setMovie(null);
        setLoading(false);
        return;
      }

      setMovie(val.id ? val : { id, ...val });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  /* ---------- handlers ---------- */

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
    if (selectedTime === null) return;

    /* ✅ better ticket id */
    const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`;

    const ticketParams = {
      id: ticketId,
      movieId: movie.id,
      title: movie.title,
      seats: selectedSeats.join(","),
      seatsCount: String(selectedSeats.length),
      total: String(calculateTotal()),
      snacksTotal: String(snacksTotal || 0),
      date: `${dates[selectedDate].day} ${dates[selectedDate].month}`,
      time: movie.showTimes?.[selectedTime]?.time ?? "",
      snacks: JSON.stringify(snackItems || {}),
    };

    router.push({
      pathname: "/payment/[id]",
      params: ticketParams as any,
    });
  };

  /* ---------- states ---------- */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0a7ea4" />
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

  /* ---------- UI ---------- */

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.container}>
          <View style={styles.header}>
            <ScreenBackButton />
            <Text style={styles.title}>{movie.title}</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Date */}
            <Text style={styles.sectionTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dates.map((d, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dateItem,
                    selectedDate === i && styles.selectedDate,
                  ]}
                  onPress={() => setSelectedDate(i)}
                >
                  <Text style={styles.dateDay}>{d.date}</Text>
                  <Text style={styles.dateNumber}>{d.day}</Text>
                  <Text style={styles.dateMonth}>{d.month}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Time */}
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.timesContainer}>
              {(movie.showTimes || []).map((s: any, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.timeItem,
                    selectedTime === idx && styles.selectedTime,
                    s.available === false && styles.unavailableTime,
                  ]}
                  onPress={() => s.available !== false && setSelectedTime(idx)}
                  disabled={s.available === false}
                >
                  <Text style={styles.timeText}>{s.time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Seats */}
            <Text style={styles.sectionTitle}>Select Seats</Text>
            <SeatMap onSeatsChange={handleSeatsChange} />

            {/* Snacks */}
            <Text style={styles.sectionTitle}>Add Snacks</Text>
            <TouchableOpacity
              style={styles.snackButton}
              onPress={() => {
                setSnackSheetOpen(true);
                setTimeout(() => {
                  if (bottomSheetRef.current) {
                    // @ts-ignore
                    bottomSheetRef.current.expand &&
                      bottomSheetRef.current.expand();
                  }
                }, 100);
              }}
            >
              <Text style={styles.snackButtonText}>
                {snacksTotal > 0
                  ? `Edit Snacks (UGX ${snacksTotal.toLocaleString()})`
                  : "Add Snacks"}
              </Text>
            </TouchableOpacity>

            {isSnackSheetOpen && (
              <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={["70%"]}
                enablePanDownToClose
                onClose={() => setSnackSheetOpen(false)}
              >
                <SnackSelector onSnacksChange={handleSnacksChange} />
              </BottomSheet>
            )}

            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.priceLabel}>Total</Text>
              <Text style={styles.priceValue}>
                UGX {calculateTotal().toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.bookButton,
                (selectedSeats.length === 0 || selectedTime === null) &&
                  styles.disabledButton,
              ]}
              onPress={handleProceedToPayment}
              disabled={selectedSeats.length === 0 || selectedTime === null}
            >
              <Text style={styles.bookButtonText}>
                {selectedSeats.length === 0
                  ? "Select seats"
                  : selectedTime === null
                    ? "Select time"
                    : "Proceed to Payment"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20, paddingBottom: 0, marginTop: 40 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  title: { fontSize: 26, fontWeight: "700", marginTop: -10 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 12 },

  dateItem: {
    width: 55,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedDate: { backgroundColor: "#0a7ea4", color: "#fff" },

  dateDay: { fontSize: 14, color: "#6c757d" },
  dateNumber: { fontSize: 18, fontWeight: "600" },
  dateMonth: { fontSize: 12, color: "#6c757d" },

  timesContainer: { flexDirection: "row", flexWrap: "wrap" },
  timeItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginRight: 10,
    marginBottom: 10,
  },

  selectedTime: { backgroundColor: "#0a7ea4", color: "#fff" },
  unavailableTime: { opacity: 0.5 },

  timeText: { fontSize: 14 },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceLabel: { fontSize: 12, color: "#6c757d" },
  priceValue: { fontSize: 18, fontWeight: "600" },

  bookButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  disabledButton: { backgroundColor: "#ced4da" },
  bookButtonText: { color: "#fff", fontWeight: "700" },

  snackButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  snackButtonText: { color: "#fff", fontWeight: "600" },
});

// import ScreenBackButton from "@/components/ScreenBackButton";
// import SeatMap from "@/components/SeatMap";
// import SnackSelector from "@/components/SnackSelector";
// import BottomSheet from "@gorhom/bottom-sheet";
// import { Stack, useLocalSearchParams, useRouter } from "expo-router";
// import { onValue, ref } from "firebase/database";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { database } from "../../../firebaseConfig";

// // eslint-disable-next-line react-hooks/rules-of-hooks
// const bottomSheetRef = useRef<BottomSheet>(null);
// // eslint-disable-next-line react-hooks/rules-of-hooks
// const [isSnackSheetOpen, setSnackSheetOpen] = useState(false);

// function getDates(numDays = 7) {
//   const days = [];
//   const today = new Date();
//   for (let i = 0; i < numDays; i++) {
//     const d = new Date(today);
//     d.setDate(today.getDate() + i);
//     days.push({
//       date: d.toLocaleDateString("en-US", { weekday: "short" }),
//       day: d.getDate().toString(),
//       month: d.toLocaleDateString("en-US", { month: "short" }),
//       full: d,
//     });
//   }
//   return days;
// }

// const dates = getDates(7);

// function getShowTimes(date: Date) {
//   // Example: 3 showtimes per day
//   return [
//     `${date.toLocaleDateString()} 10:00 AM`,
//     `${date.toLocaleDateString()} 2:00 PM`,
//     `${date.toLocaleDateString()} 7:00 PM`,
//   ];
// }

// export default function BookingScreen() {
//   const params = useLocalSearchParams();
//   const router = useRouter();
//   const id = String(params.id || "");

//   const [movie, setMovie] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [selectedDate, setSelectedDate] = useState(0);
//   const [selectedTime, setSelectedTime] = useState<number | null>(null);
//   const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
//   const [seatsTotal, setSeatsTotal] = useState(0);
//   const [snacksTotal, setSnacksTotal] = useState(0);
//   const [snackItems, setSnackItems] = useState<{ [key: string]: number }>({});

//   useEffect(() => {
//     if (!id) {
//       setLoading(false);
//       setMovie(null);
//       return;
//     }
//     const movieRef = ref(database, `movies/${id}`);
//     const unsub = onValue(movieRef, (snap) => {
//       const val = snap.val();
//       if (!val) {
//         setMovie(null);
//         setLoading(false);
//         return;
//       }
//       setMovie(val.id ? val : { id, ...val });
//       setLoading(false);
//     });
//     return () => unsub();
//   }, [id]);

//   const handleSeatsChange = useCallback((seats: string[], total: number) => {
//     setSelectedSeats(seats);
//     setSeatsTotal(total);
//   }, []);

//   const handleSnacksChange = useCallback(
//     (total: number, items: { [key: string]: number }) => {
//       setSnacksTotal(total);
//       setSnackItems(items);
//     },
//     [],
//   );

//   const calculateTotal = () => seatsTotal + snacksTotal;

//   const handleProceedToPayment = () => {
//     if (!movie) return;
//     if (selectedSeats.length === 0) return;

//     const ticketId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

//     const ticketParams = {
//       id: ticketId,
//       movieId: movie.id,
//       title: movie.title,
//       seats: selectedSeats.join(","),
//       seatsCount: String(selectedSeats.length),
//       total: String(calculateTotal()),
//       snacksTotal: String(snacksTotal || 0),
//       date: dates[selectedDate]
//         ? `${dates[selectedDate].day} ${dates[selectedDate].month}`
//         : "",
//       time:
//         selectedTime !== null
//           ? (movie.showTimes?.[selectedTime]?.time ?? "")
//           : "",
//       snacks: JSON.stringify(snackItems || {}),
//     } as { [key: string]: string };

//     router.push({ pathname: "/payment/[id]", params: ticketParams as any });
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator
//           size="large"
//           color="#0a7ea4"
//           style={{ marginVertical: 16 }}
//         />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (!movie) {
//     return (
//       <View style={styles.center}>
//         <Text>Movie not found</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={["top"]}>
//       {/* <ScreenBackButton /> */}
//       <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
//       <Stack.Screen options={{ headerShown: false }} />
//       <View style={styles.container}>
//         <View
//           style={{
//             paddingTop: 2,
//             paddingBottom: 0,
//             alignItems: "center",
//             justifyContent: "center",
//             flexDirection: "row",
//             gap: 12,
//           }}
//         >
//           <ScreenBackButton />
//           <Text style={styles.title}>{movie.title}</Text>
//         </View>

//         <ScrollView
//           contentContainerStyle={styles.content}
//           showsVerticalScrollIndicator={false}
//         >
//           <Text style={styles.sectionTitle}>Select Date</Text>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.datesContainer}
//           >
//             {dates.map((d, i) => (
//               <TouchableOpacity
//                 key={i}
//                 style={[
//                   styles.dateItem,
//                   selectedDate === i && styles.selectedDate,
//                 ]}
//                 onPress={() => setSelectedDate(i)}
//               >
//                 <Text
//                   style={[
//                     styles.dateDay,
//                     selectedDate === i && styles.selectedDate,
//                   ]}
//                 >
//                   {d.date}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.dateNumber,
//                     selectedDate === i && styles.selectedDate,
//                   ]}
//                 >
//                   {d.day}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.dateMonth,
//                     selectedDate === i && styles.selectedDate,
//                   ]}
//                 >
//                   {d.month}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>

//           <Text style={styles.sectionTitle}>Select Time</Text>
//           <View style={styles.timesContainer}>
//             {(movie.showTimes || []).map((s: any, idx: number) => (
//               <TouchableOpacity
//                 key={idx}
//                 style={[
//                   styles.timeItem,
//                   selectedTime === idx && styles.selectedTime,
//                   !s.available && styles.unavailableTime,
//                 ]}
//                 onPress={() => s.available && setSelectedTime(idx)}
//                 disabled={!s.available}
//               >
//                 <Text
//                   style={[
//                     styles.timeText,
//                     selectedTime === idx && styles.selectedTimeText,
//                     !s.available && styles.unavailableTimeText,
//                   ]}
//                 >
//                   {s.time}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text style={styles.sectionTitle}>Select Seats</Text>
//           <SeatMap onSeatsChange={handleSeatsChange} />

//           <Text style={styles.sectionTitle}>Add Snacks</Text>
//           <TouchableOpacity
//             style={styles.snackButton}
//             onPress={() => setSnackSheetOpen(true)}
//           >
//             <Text style={styles.snackButtonText}>
//               {snacksTotal > 0
//                 ? `Edit Snacks (UGX ${snacksTotal.toLocaleString()})`
//                 : "Add Snacks"}
//             </Text>
//           </TouchableOpacity>
//           {snacksTotal > 0 && (
//             <View style={styles.snackSummary}>
//               <Text style={styles.snackSummaryText}>
//                 {Object.entries(snackItems)
//                   .filter(([_, qty]) => qty > 0)
//                   .map(([id, qty]) => `${qty} × ${id}`)
//                   .join(", ")}
//               </Text>
//               <Text style={styles.snackSummaryTotal}>
//                 UGX {snacksTotal.toLocaleString()}
//               </Text>
//             </View>
//           )}
//           {/* Snack Selector Bottom Sheet */}
//           {isSnackSheetOpen && (
//             <BottomSheet
//               ref={bottomSheetRef}
//               index={0}
//               snapPoints={["70%"]}
//               enablePanDownToClose
//               onClose={() => setSnackSheetOpen(false)}
//             >
//               <SnackSelector
//                 onSnacksChange={(total, items) => {
//                   handleSnacksChange(total, items);
//                   // Optionally close sheet on selection
//                   // setSnackSheetOpen(false);
//                 }}
//               />
//             </BottomSheet>
//           )}

//           <View style={{ height: 120 }} />
//         </ScrollView>

//         <View style={styles.footer}>
//           <View style={styles.priceContainer}>
//             <Text style={styles.priceLabel}>Total</Text>
//             <Text style={styles.priceValue}>
//               UGX {calculateTotal().toLocaleString()}
//             </Text>
//           </View>
//           <TouchableOpacity
//             style={[
//               styles.bookButton,
//               selectedSeats.length === 0 && styles.disabledButton,
//             ]}
//             onPress={handleProceedToPayment}
//             disabled={selectedSeats.length === 0}
//           >
//             <Text style={styles.bookButtonText}>
//               {selectedSeats.length === 0
//                 ? "Select seats"
//                 : "Proceed to Payment"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   content: {
//     padding: 20,
//     paddingBottom: 0,
//     marginTop: 40,
//   },

//   poster: {
//     width: "100%",
//     height: 260,
//     borderRadius: 12,
//     marginBottom: 12,
//   },

//   title: {
//     fontSize: 26,
//     fontWeight: "700",
//     marginBottom: 2,
//   },

//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginTop: 12,
//     marginBottom: 8,
//   },

//   datesContainer: {
//     paddingBottom: 12,
//     marginTop: 4,
//   },

//   dateItem: {
//     width: 55,
//     height: 70,
//     borderRadius: 12,
//     backgroundColor: "#fff",
//     marginRight: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 2,
//   },

//   selectedDate: {
//     backgroundColor: "#0a7ea4",
//     color: "#fff",
//   },

//   dateDay: {
//     fontSize: 14,
//     color: "#6c757d",
//   },

//   dateNumber: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#212529",
//   },
//   dateMonth: {
//     fontSize: 12,
//     color: "#6c757d",
//   },
//   timesContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   timeItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     backgroundColor: "#fff",
//     marginRight: 10,
//     marginBottom: 10,
//   },
//   selectedTime: { backgroundColor: "#0a7ea4" },
//   unavailableTime: { opacity: 0.6, backgroundColor: "#f1f3f5" },
//   timeText: { fontSize: 14, color: "#212529" },
//   selectedTimeText: { color: "#fff" },
//   unavailableTimeText: { color: "#adb5bd" },
//   footer: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//     elevation: 12,
//   },
//   priceContainer: {},
//   priceLabel: { fontSize: 12, color: "#6c757d" },
//   priceValue: { fontSize: 18, fontWeight: "600" },
//   bookButton: {
//     backgroundColor: "#0a7ea4",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
//   disabledButton: { backgroundColor: "#ced4da" },
//   bookButtonText: { color: "#fff", fontWeight: "700" },
//   snackButton: {
//     backgroundColor: "#0a7ea4",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   snackButtonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   snackSummary: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 8,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   snackSummaryText: {
//     color: "#212529",
//     fontSize: 14,
//     flex: 1,
//   },
//   snackSummaryTotal: {
//     color: "#0a7ea4",
//     fontWeight: "700",
//     fontSize: 15,
//     marginLeft: 12,
//   },
// });
