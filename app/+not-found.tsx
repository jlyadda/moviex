import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesnt exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#e63946',
    borderRadius: 8,
  },
  linkText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
  }
});