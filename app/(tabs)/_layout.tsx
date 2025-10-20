import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Home, Ticket, User } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color}
          // tabBarIcon: ({ color }) => <IconSymbol size={25} name="house.fill" color={color} 

          />,
        }}
      />
          
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color, size }) => <Ticket size={size} color={color}
          // tabBarIcon: ({ color }) => <IconSymbol size={25} name="paperplane.fill" color={color} 
          />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color}
          // tabBarIcon: ({ color }) => <IconSymbol size={25} name="person.fill" color={color} 
          />,
        }}
      />
    </Tabs>
  );
}
