import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, Wallet } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function PaymentScreen() {
  const { id, total, seats, snacks } = useLocalSearchParams();
  const router = useRouter();
  
  const handlePayment = () => {
    router.push(`/ticket/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.content}
        >
          <Text style={styles.title}>Payment Details</Text>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tickets ({seats})</Text>
              <Text style={styles.summaryValue}>UGX {Number(total) - Number(snacks)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Snacks & Drinks</Text>
              <Text style={styles.summaryValue}>UGX {snacks}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>UGX {total}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity style={styles.paymentOption}>
            <CreditCard size={24} color="#e63946" />
            <View style={styles.paymentOptionText}>
              <Text style={styles.paymentOptionTitle}>Credit/Debit Card</Text>
              <Text style={styles.paymentOptionSubtitle}>Pay with Visa or Mastercard</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentOption}>
            <Wallet size={24} color="#e63946" />
            <View style={styles.paymentOptionText}>
              <Text style={styles.paymentOptionTitle}>Mobile Money</Text>
              <Text style={styles.paymentOptionSubtitle}>Pay with MTN or Airtel Money</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.payButton}
            onPress={handlePayment}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
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
  summaryCard: {
    backgroundColor: '#262626',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  summaryValue: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  totalValue: {
    fontSize: 18,
    color: '#e63946',
    fontFamily: 'Poppins-Bold',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentOptionText: {
    marginLeft: 16,
  },
  paymentOptionTitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  paymentOptionSubtitle: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  payButton: {
    backgroundColor: '#e63946',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  payButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});