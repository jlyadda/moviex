import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, CreditCard, Bell, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

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
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop' }} 
            style={styles.profileImage} 
          />
          <Text style={styles.profileName}>Jonathan</Text>
          <Text style={styles.profileEmail}>jonalyadda@gmail.com</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Movies Watched</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Tickets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}></Text>
            <Text style={styles.statLabel}>Cinemas</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.optionItem}>
              <View style={styles.optionIcon}>{option.icon}</View>
              <Text 
                style={[
                  styles.optionText, 
                  option.textColor && { color: option.textColor }
                ]}
              >
                {option.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
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