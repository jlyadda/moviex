import ScreenBackButton from '@/components/ScreenBackButton';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TicketScreen() {
  const params = useLocalSearchParams() as { [key: string]: any };

  // Build ticket object from route params with sensible fallbacks
  const ticket = {
    movieTitle: params.title || 'Untitled Movie',
    image:
      params.image ||
      '',
    date: params.date || '',
    time: params.time || '',
    cinema: params.cinema || 'Hall 1',
    // seats passed as CSV string (from the movie screen) — parse into array
    seats: params.seats ? String(params.seats).split(',').map((s: string) => s.trim()).filter(Boolean) : ['A1'],
    ticketId:  `NMX-${Math.random().toString(12).substr(2, 9).toUpperCase()}`,
    total: params.total ? Number(params.total) : 0,
    snacks: (() => {
      try {
        return params.snacks ? JSON.parse(String(params.snacks)) : null;
      } catch (err) {
        console.warn('Invalid snacks param', err);
        return null;
      }
    })(),
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />
      <ScrollView>
        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.content}
        >

          <ScreenBackButton />
          <Text style={styles.title}>Your Ticket</Text>
          
          <View style={styles.ticketCard}>
            <View>
              <Image
              source={{ uri: ticket.image }} 
              style={styles.movieImage}/>

            <LinearGradient
            colors={['transparent', '#1a1a1a']}
            // colors={['#000','transparent' ]}
            style={styles.gradient} />

            <View style={{position:'absolute', top:-40,left:-40, // backgroundColor: '#1a1a1a',
    backgroundColor: '#fff',width:80, height:80, borderRadius:80,}}/>
            <View style={{position:'absolute', top:-40 ,right:-40, // backgroundColor: '#1a1a1a',
    backgroundColor: '#fff',width:80, height:80, borderRadius:80}}/>
            <View style={{position:'absolute', bottom:-40 ,right:-40, // backgroundColor: '#1a1a1a',
    backgroundColor: '#fff',width:80, height:80, borderRadius:80}}/>
            <View style={{position:'absolute', bottom:-40,left:-40, // backgroundColor: '#1a1a1a',
    backgroundColor: '#fff',width:80, height:80, borderRadius:80,}}/>

            </View>
            

            <View style={styles.divider} />
            
            <View style={styles.ticketContent}> 
              <View style={{position:'absolute', top:-40,left:-40, // backgroundColor: '#1a1a1a',
    backgroundColor: '#fff' ,width:80, height:80, borderRadius:80,}}/>
            <View style={{position:'absolute', top:-40 ,right:-40, 
              // backgroundColor: '#1a1a1a',
    backgroundColor: '#fff',width:80, height:80, borderRadius:80}}/>
            <View style={{position:'absolute', bottom:-200 ,right:-40,
             // backgroundColor: '#1a1a1a',
    backgroundColor: '#fff',width:80, height:80, borderRadius:80}}/>

            <View style={{position:'absolute', bottom:-200,left:-40, 
            // backgroundColor: '#1a1a1a',
    backgroundColor: '#fff'
              ,width:80, height:80, borderRadius:80,}}/>             


              <Text numberOfLines={1} style={styles.movieTitle}>{ticket.movieTitle}</Text>

              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View style={styles.infoRow}>
                <Calendar size={20} color="#888" />
                <Text style={styles.infoText}>{ticket.date}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Clock size={20} color="#888" />
                <Text style={styles.infoText}>{ticket.time}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MapPin size={20} color="#888" />
                <Text style={styles.infoText}>{ticket.cinema}</Text>
              </View>
              </View>
            </View>

            
            <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:30}}>
            
              <View style={styles.seatsContainer}>
                <Text style={styles.seatsLabel}>Seats</Text>
                <Text style={styles.seatsValue}>{ticket.seats.join(', ')}</Text>

                {ticket.snacks && Object.keys(ticket.snacks).length > 0 && (
                  <Text style={styles.snacksTitle}> + Snacks</Text>
                )}

                {ticket.total ? (
                  <Text style={styles.totalText}>UGX {Number(ticket.total).toLocaleString()}</Text>
                ) : null}

              </View>

              <View style={styles.qrContainer}>
                <QRCode value={String(ticket.ticketId)} size={90} backgroundColor="#262626ff" color="#fff" />
                <Text style={styles.ticketId}>{ticket.ticketId}</Text>
              </View>
            </View>
          </View>

          <Text  style={styles.instructions}>
            Show this ticket at the cinema entrance. We recommend arriving 15 minutes before screening.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#1a1a1a',
    backgroundColor: '#fff',
  },
  dot:{

  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Poppins-Bold',
    marginBottom: 24,
    alignSelf:'center'
  },
  ticketCard: {
    backgroundColor: '#262626',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    width:"85%",
    alignSelf:'center',
    height:'auto'
  },
  movieImage: {
    width: '100%',
    height: 350,
  },
  ticketContent: {
    paddingHorizontal: 20,
  },
  movieTitle: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    alignSelf:'center',
    paddingTop:10
  
  },
  infoRow: {
    // flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
  },
  seatsContainer: {
    marginTop: 16,
  },
  seatsLabel: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  seatsValue: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#fff',
    borderTopWidth:2,
    borderStyle:'dashed',
    width:'100%'
  },
    dec:{
    position:'absolute',
    width:20,
    height:40,
    // backgroundColor: '#1a1a1a',
    backgroundColor: '#fff',
    borderRadius:20,
    right:-10,
    top:80,
  },
  qrContainer: {
    padding: 20,
    alignItems: 'center',
  },
  ticketId: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginTop: 12,
  },
  instructions: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  totalText: {
    marginTop: 8,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  snacksCard: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 12,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 16,
  },
  snacksTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  snackItem: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#e63946',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});