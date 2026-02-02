import { CreditCard, Phone, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';

interface PaymentMethod {
  id: string;
  type: 'card' | 'momo';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  phoneNumber?: string;
  provider?: string;
}

interface PaymentMethodsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPaymentMethod: (method: PaymentMethod) => void;
}

export default function PaymentMethodsModal({
  visible,
  onClose,
  onAddPaymentMethod,
}: PaymentMethodsModalProps) {
  const [selectedTab, setSelectedTab] = useState<'card' | 'momo' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'MTN' | 'Airtel' | null>(null);

  const resetForm = () => {
    setSelectedTab(null);
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCVC('');
    setPhoneNumber('');
    setProvider(null);
  };

  const handleAddCard = () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCVC) {
      Alert.alert('Missing Fields', 'Please fill in all card details');
      return;
    }

    if (cardNumber.length < 13 || cardNumber.length > 19) {
      Alert.alert('Invalid Card', 'Card number must be 13-19 digits');
      return;
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(cardExpiry)) {
      Alert.alert('Invalid Expiry', 'Please use MM/YY format');
      return;
    }

    const newMethod: PaymentMethod = {
      id: `card_${Date.now()}`,
      type: 'card',
      cardNumber: `**** **** **** ${cardNumber.slice(-4)}`,
      cardName,
      cardExpiry,
    };

    onAddPaymentMethod(newMethod);
    Alert.alert('Success', 'Payment method added successfully');
    resetForm();
    onClose();
  };

  const handleAddMomo = () => {
    if (!phoneNumber || !provider) {
      Alert.alert('Missing Fields', 'Please fill in all mobile money details');
      return;
    }

    if (!/^[0-9]{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    const newMethod: PaymentMethod = {
      id: `momo_${Date.now()}`,
      type: 'momo',
      phoneNumber: `+256${phoneNumber.slice(-9)}`,
      provider,
    };

    onAddPaymentMethod(newMethod);
    Alert.alert('Success', 'Mobile money payment method added successfully');
    resetForm();
    onClose();
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 19);
    const formatted = cleaned
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
    setCardNumber(cleaned);
    return formatted;
  };

  const formatExpiry = (text: string) => {
    let cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    setCardExpiry(cleaned);
    return cleaned;
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    const formatted = cleaned
      .replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
      .trim();
    setPhoneNumber(cleaned);
    return formatted;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          entering={SlideInUp.duration(300)}
          style={styles.modalContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Payment Method</Text>
            <TouchableOpacity onPress={() => {
              resetForm();
              onClose();
            }}>
              <X size={24} color="#212529" />
            </TouchableOpacity>
          </View>

          {/* Tab Selection */}
          {selectedTab === null && (
            <View style={styles.tabSelection}>
              <TouchableOpacity
                style={styles.methodOption}
                onPress={() => setSelectedTab('card')}
              >
                <CreditCard size={40} color="#e63946" />
                <Text style={styles.methodTitle}>Credit/Debit Card</Text>
                <Text style={styles.methodDesc}>Visa, Mastercard, etc.</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.methodOption}
                onPress={() => setSelectedTab('momo')}
              >
                <Phone size={40} color="#e63946" />
                <Text style={styles.methodTitle}>Mobile Money</Text>
                <Text style={styles.methodDesc}>MTN, Airtel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Card Form */}
          {selectedTab === 'card' && (
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#adb5bd"
                keyboardType="numeric"
                value={formatCardNumber(cardNumber)}
                onChangeText={formatCardNumber}
                maxLength={19}
              />

              <Text style={styles.formLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#adb5bd"
                value={cardName}
                onChangeText={setCardName}
              />

              <View style={styles.rowContainer}>
                <View style={styles.halfInput}>
                  <Text style={styles.formLabel}>Expiry (MM/YY)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="12/25"
                    placeholderTextColor="#adb5bd"
                    keyboardType="numeric"
                    value={formatExpiry(cardExpiry)}
                    onChangeText={formatExpiry}
                    maxLength={5}
                  />
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.formLabel}>CVC</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="#adb5bd"
                    keyboardType="numeric"
                    secureTextEntry
                    value={cardCVC}
                    onChangeText={setCardCVC}
                    maxLength={4}
                  />
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setSelectedTab(null)}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleAddCard}
                >
                  <Text style={styles.primaryButtonText}>Add Card</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          {/* Mobile Money Form */}
          {selectedTab === 'momo' && (
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Select Provider</Text>
              <View style={styles.providerContainer}>
                {['MTN', 'Airtel'].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.providerButton,
                      provider === (p as 'MTN' | 'Airtel' | 'UCC') &&
                        styles.providerButtonActive,
                    ]}
                    onPress={() => setProvider(p as 'MTN' | 'Airtel' )}
                  >
                    <Text
                      style={[
                        styles.providerText,
                        provider === (p as 'MTN' | 'Airtel') &&
                          styles.providerTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Phone Number</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.phonePrefix}>+256</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="701 234 567"
                  placeholderTextColor="#adb5bd"
                  keyboardType="phone-pad"
                  value={formatPhoneNumber(phoneNumber)}
                  onChangeText={formatPhoneNumber}
                  maxLength={12}
                />
              </View>

              <Text style={styles.helperText}>
                Enter your Uganda mobile money number (10 digits)
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setSelectedTab(null)}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleAddMomo}
                >
                  <Text style={styles.primaryButtonText}>Add Mobile Money</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
  },
  tabSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  methodOption: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginTop: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  methodDesc: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  formContainer: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212529',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  providerContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  providerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#dee2e6',
    alignItems: 'center',
  },
  providerButtonActive: {
    backgroundColor: '#e63946',
    borderColor: '#e63946',
  },
  providerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
  },
  providerTextActive: {
    color: '#fff',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  phonePrefix: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    fontFamily: 'Poppins-SemiBold',
    borderRightWidth: 1,
    borderRightColor: '#dee2e6',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212529',
    fontFamily: 'Poppins-Regular',
  },
  helperText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#e63946',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  secondaryButtonText: {
    color: '#212529',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});
