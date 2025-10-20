import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 12;
const SEAT_PRICE = 23000;

type SeatStatus = 'available' | 'selected' | 'occupied';

interface SeatProps {
  row: string;
  number: number;
  status: SeatStatus;
  onSelect: (row: string, number: number) => void;
}

const Seat = ({ row, number, status, onSelect }: SeatProps) => (
  <TouchableOpacity
    style={[
      styles.seat,
      status === 'selected' && styles.selectedSeat,
      status === 'occupied' && styles.occupiedSeat,
    ]}
    onPress={() => status !== 'occupied' && onSelect(row, number)}
    disabled={status === 'occupied'}
  >
    <Text style={[
      styles.seatText,
      status === 'selected' && styles.selectedSeatText,
      status === 'occupied' && styles.occupiedSeatText,
    ]}>
      {row}{number}
    </Text>
  </TouchableOpacity>
);

interface SeatMapProps {
  onSeatsChange: (seats: string[], totalPrice: number) => void;
}

export default function SeatMap({ onSeatsChange }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  
  // Mock occupied seats
  const occupiedSeats = new Set(['A1', 'B4', 'C7', 'D2', 'E5', 'F8', 'G3', 'H6']);

  const handleSeatSelect = (row: string, number: number) => {
    const seatId = `${row}${number}`;
    const newSelectedSeats = new Set(selectedSeats);

    if (selectedSeats.has(seatId)) {
      newSelectedSeats.delete(seatId);
    } else if (selectedSeats.size < 10) { // Maximum 10 seats per booking
      newSelectedSeats.add(seatId);
    }

    setSelectedSeats(newSelectedSeats);
    const seatsArray = Array.from(newSelectedSeats);
    const totalPrice = seatsArray.length * SEAT_PRICE;
    onSeatsChange(seatsArray, totalPrice);
  };

  const getSeatStatus = (row: string, number: number): SeatStatus => {
    const seatId = `${row}${number}`;
    if (occupiedSeats.has(seatId)) return 'occupied';
    if (selectedSeats.has(seatId)) return 'selected';
    return 'available';
  };

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.screenText}>SCREEN</Text>
      </View>
      
      <ScrollView style={styles.seatsContainer}>
        {ROWS.map((row) => (
          <View key={row} style={styles.row}>
            <Text style={styles.rowLabel}>{row}</Text>
            <View style={styles.seats}>
              {Array.from({ length: SEATS_PER_ROW }, (_, i) => i + 1).map((number) => (
                <Seat
                  key={`${row}${number}`}
                  row={row}
                  number={number}
                  status={getSeatStatus(row, number)}
                  onSelect={handleSeatSelect}
                />
              ))}
            </View>
            <Text style={styles.rowLabel}>{row}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.seat]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.selectedSeat]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.occupiedSeat]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
      </View>

      <View style={styles.priceInfo}>
        <Text style={styles.priceText}>Price per seat: UGX {SEAT_PRICE.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  screen: {
    height: 40,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  screenText: {
    color: '#495057',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  seatsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowLabel: {
    width: 20,
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  seats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  seat: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e63946',
  },
  selectedSeat: {
    backgroundColor: '#e63946',
  },
  occupiedSeat: {
    backgroundColor: '#dee2e6',
    borderColor: '#dee2e6',
  },
  seatText: {
    fontSize: 8,
    color: '#e63946',
    fontFamily: 'Poppins-Medium',
  },
  selectedSeatText: {
    color: '#fff',
  },
  occupiedSeatText: {
    color: '#adb5bd',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendSeat: {
    width: 16,
    height: 16,
  },
  legendText: {
    fontSize: 12,
    color: '#495057',
    fontFamily: 'Poppins-Regular',
  },
  priceInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    color: '#495057',
    fontFamily: 'Poppins-Medium',
  },
});