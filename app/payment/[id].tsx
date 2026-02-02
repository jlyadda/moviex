// ScreenBackButton removed from this screen to keep header minimal
import ScreenBackButton from '@/components/ScreenBackButton';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Check, CreditCard, Popcorn, Shield, Ticket, Wallet } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const params = useLocalSearchParams() as { [key: string]: any };
  const { total, seats, snacksTotal } = params;
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  
  const handlePayment = () => {
    if (selectedPayment) {
      // Forward all payment/order params to the ticket screen so the ticket can render full details.
      router.push({
        pathname: '/ticket/[id]',
        params: params as any,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />
      <ScrollView>
        <ScreenBackButton/>
        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.content}
        >
          <Text style={styles.title}>Payment Details</Text>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            <View style={styles.summaryGrid}>
              <View style={styles.summaryLeft}>
                <Ticket size={18} color="#e63946" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.summaryLabel}>Ticket{seats && Number(seats) > 1 ? 's' : ''}</Text>
                  <Text style={styles.summarySmall}>{seats || '1'}</Text>
                </View>
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.summarySmallLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>UGX {(Number(total || 0) - Number(snacksTotal || 0)).toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryLeft}>
                <Popcorn size={18} color="#e63946" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.summaryLabel}>Snacks</Text>
                  <Text style={styles.summarySmall}>{Number(snacksTotal || 0) > 0 ? 'Included' : 'None'}</Text>
                </View>
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.summarySmallLabel}>Snacks</Text>
                <Text style={styles.summaryValue}>UGX {Number(snacksTotal || 0).toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>UGX {Number(total || 0).toLocaleString()}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption,
              selectedPayment === 'card' && styles.paymentOptionSelected
            ]}
            onPress={() => setSelectedPayment('card')}
          >
            <View style={[styles.paymentIconContainer, selectedPayment === 'card' && styles.paymentIconContainerSelected]}>
              <CreditCard size={24} color={selectedPayment === 'card' ? '#fff' : '#e63946'} />
            </View>
            <View style={styles.paymentOptionText}>
              <Text style={styles.paymentOptionTitle}>Credit/Debit Card</Text>
              <Text style={styles.paymentOptionSubtitle}>Pay with Visa or Mastercard</Text>
            </View>
            {selectedPayment === 'card' && (
              <Animated.View entering={ZoomIn.duration(300)}>
                <Check size={24} color="#4caf50" />
              </Animated.View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.paymentOption,
              selectedPayment === 'momo' && styles.paymentOptionSelected
            ]}
            onPress={() => setSelectedPayment('momo')}
          >
            <View style={[styles.paymentIconContainer, selectedPayment === 'momo' && styles.paymentIconContainerSelected]}>
              <Wallet size={24} color={selectedPayment === 'momo' ? '#fff' : '#e63946'} />
            </View>
            <View style={styles.paymentOptionText}>
              <Text style={styles.paymentOptionTitle}>Mobile Money</Text>
              <Text style={styles.paymentOptionSubtitle}>Pay with MTN Momo or Airtel Money</Text>
            </View>
            {selectedPayment === 'momo' && (
              <Animated.View entering={ZoomIn.duration(300)}>
                <Check size={24} color="#4caf50" />
              </Animated.View>
            )}
          </TouchableOpacity>

          <View style={styles.securityBadge}>
            <Shield size={18} color="#4caf50" />
            <Text style={styles.securityText}>Secure Payment</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.payButton,
              !selectedPayment && styles.payButtonDisabled
            ]}
            onPress={handlePayment}
            disabled={!selectedPayment}
          >
            <Text style={styles.payButtonText}>
              {selectedPayment ? 'Complete Payment' : 'Select a Payment Method'}
            </Text>
          </TouchableOpacity>
          
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: '#212529',
    fontFamily: 'Poppins-Bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    // subtle shadow like other screens
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  summaryItemText: {
    marginLeft: 16,
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    color: '#212529',
    fontFamily: 'Poppins-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  totalValue: {
    fontSize: 20,
    color: '#e63946',
    fontFamily: 'Poppins-Bold',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  paymentOptionSelected: {
    borderColor: '#e63946',
    backgroundColor: '#fff',
  },
  paymentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIconContainerSelected: {
    backgroundColor: '#e63946',
  },
  paymentOptionText: {
    marginLeft: 16,
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    color: '#212529',
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  paymentOptionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    fontFamily: 'Poppins-Regular',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  securityText: {
    fontSize: 14,
    color: '#212529',
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
  payButton: {
    backgroundColor: '#e63946',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#e63946',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  payButtonDisabled: {
    backgroundColor: '#888',
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  thumbnail: {
    width: 50,
    height: 75,
    borderRadius: 8,
  },
  thumbnailPlaceholder: {
    width: 50,
    height: 75,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  movieTitleSmall: {
    fontSize: 16,
    color: '#212529',
    fontFamily: 'Poppins-Medium',
  },
  movieMeta: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summarySmall: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  summarySmallLabel: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
});