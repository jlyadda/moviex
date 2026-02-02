import { Minus, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Snack {
  id: string;
  name: string;
  price: number;
  image: string;
}

const snacks: Snack[] = [
  {
    id: '1',
    name: 'Popcorn (Large)',
    price: 5000,
    image: 'https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    name: 'Popcorn (Caramel)',
    price: 7000,
    image: 'https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '3',
    name: 'Pepsi ',
    price: 3000,
    image: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '4',
    name: 'Nivana Water',
    price: 3000,
    image: 'https://images.pexels.com/photos/1200348/pexels-photo-1200348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '5',
    name: 'Sting',
    price: 3000,
    image: 'https://images.pexels.com/photos/4518656/pexels-photo-4518656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

interface SnackSelectorProps {
  onSnacksChange: (total: number, items: { [key: string]: number }) => void;
}

export default function SnackSelector({ onSnacksChange }: SnackSelectorProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const updateQuantity = (id: string, delta: number) => {
    const currentQty = quantities[id] || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    const newQuantities = {
      ...quantities,
      [id]: newQty,
    };
    
    if (newQty === 0) {
      delete newQuantities[id];
    }
    
    setQuantities(newQuantities);
    
    const total = Object.entries(newQuantities).reduce((sum, [id, qty]) => {
      const snack = snacks.find(s => s.id === id);
      return sum + (snack?.price || 0) * qty;
    }, 0);
    
    onSnacksChange(total, newQuantities);
  };

  return (
    <ScrollView style={styles.container}>
      {snacks.map((snack) => (
        <View key={snack.id} style={styles.snackItem}>
          <Image source={{ uri: snack.image }} style={styles.snackImage} />
          <View style={styles.snackInfo}>
            <Text style={styles.snackName}>{snack.name}</Text>
            <Text style={styles.snackPrice}>UGX {snack.price.toLocaleString()}</Text>
          </View>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(snack.id, -1)}
              disabled={!quantities[snack.id]}
            >
              <Minus size={16} color={quantities[snack.id] ? '#e63946' : '#ced4da'} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>
              {quantities[snack.id] || 0}
            </Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(snack.id, 1)}
            >
              <Plus size={16} color="#e63946" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  snackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  snackImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  snackInfo: {
    flex: 1,
    marginLeft: 16,
  },
  snackName: {
    fontSize: 16,
    color: '#212529',
    marginBottom: 4,
    fontFamily: 'Poppins-Medium',
  },
  snackPrice: {
    fontSize: 14,
    color: '#e63946',
    fontFamily: 'Poppins-Regular',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  quantityText: {
    width: 30,
    textAlign: 'center',
    fontSize: 14,
    color: '#212529',
    fontFamily: 'Poppins-Medium',
  },
});