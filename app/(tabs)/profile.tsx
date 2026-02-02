import { useRouter } from 'expo-router';
import { Bell, ChevronRight, CreditCard, CircleHelp as HelpCircle, LogOut, Settings } from 'lucide-react-native';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import PaymentMethodsModal from '../../components/PaymentMethodsModal';

const profileOptions = [
  {
    id: 'settings',
    title: 'Account Settings',
    icon: <Settings size={22} color="#212529" />,
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    icon: <CreditCard size={22} color="#212529" />,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: <Bell size={22} color="#212529" />,
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: <HelpCircle size={22} color="#212529" />,
  },
  {
    id: 'logout',
    title: 'Log Out',
    icon: <LogOut size={22} color="#e63946" />,
    textColor: '#e63946',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<{
    id: string;
    type: 'card' | 'momo';
    cardNumber?: string;
    cardName?: string;
    cardExpiry?: string;
    phoneNumber?: string;
    provider?: string;
  }[]>([]);
  
  // User data (can be fetched from API or storage)
  const userData = {
    name: 'Jonathan',
    email: 'jonalyadda@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop',
    moviesWatched: 1,
    ticketsBooked: 1,
    cinemas: 0,
  };

  const handleOptionPress = (optionId: string) => {
    switch (optionId) {
      case 'settings':
        Alert.alert('Account Settings', 'Edit your account preferences');
        break;
      case 'payment':
        setPaymentModalVisible(true);
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Manage notification preferences');
        break;
      case 'help':
        Alert.alert('Help & Support', 'Contact our support team or view FAQs');
        break;
      case 'logout':
        Alert.alert(
          'Log Out',
          'Are you sure you want to log out?',
          [
            { text: 'Cancel', onPress: () => {}, style: 'cancel' },
            {
              text: 'Log Out',
              onPress: () => {
                // Navigate to login or reset app
                router.replace('/');
              },
              style: 'destructive',
            },
          ]
        );
        break;
      default:
        break;
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleAddPaymentMethod = (method: {
    id: string;
    type: 'card' | 'momo';
    cardNumber?: string;
    cardName?: string;
    cardExpiry?: string;
    phoneNumber?: string;
    provider?: string;
  }) => {
    setPaymentMethods([...paymentMethods, method]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.profileHeader}>
          <Image 
            source={{ uri: userData.avatar }} 
            style={styles.profileImage} 
          />
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.moviesWatched}</Text>
            <Text style={styles.statLabel}>Movies Watched</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.ticketsBooked}</Text>
            <Text style={styles.statLabel}>Tickets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.cinemas}</Text>
            <Text style={styles.statLabel}>Cinemas</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              style={styles.optionItem}
              onPress={() => handleOptionPress(option.id)}
            >
              <View style={styles.optionIcon}>{option.icon}</View>
              <Text 
                style={[
                  styles.optionText, 
                  option.textColor && { color: option.textColor }
                ]}
              >
                {option.title}
              </Text>
              <ChevronRight size={20} color="#adb5bd" style={styles.chevron} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <PaymentMethodsModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onAddPaymentMethod={handleAddPaymentMethod}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 5,
    fontFamily: 'Poppins-SemiBold',
  },
  profileEmail: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 15,
    fontFamily: 'Poppins-Regular',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#495057',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e63946',
    marginBottom: 5,
    fontFamily: 'Poppins-SemiBold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontFamily: 'Poppins-Regular',
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#dee2e6',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#212529',
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#adb5bd',
    fontFamily: 'Poppins-Regular',
  },
});