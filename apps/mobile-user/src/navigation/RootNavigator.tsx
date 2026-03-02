import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useAuthStore} from '../stores/authStore';
import {RootStackParamList, MainTabParamList} from '../types';

// Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ShopDetailScreen from '../screens/home/ShopDetailScreen';
import BookingScreen from '../screens/booking/BookingScreen';
import BookingDetailScreen from '../screens/booking/BookingDetailScreen';
import BookingConfirmationScreen from '../screens/booking/BookingConfirmationScreen';
import MyBookingsScreen from '../screens/booking/MyBookingsScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import {Text} from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({color, size}) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({color, size}) => (
            <TabIcon name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({color, size}) => (
            <TabIcon name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <TabIcon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Simple tab icon component using emoji (replace with vector icons in production)
function TabIcon({
  name,
}: {
  name: string;
  color: string;
  size: number;
}) {
  const icons: Record<string, string> = {
    home: '🏠',
    calendar: '📅',
    wallet: '💰',
    user: '👤',
  };
  return <Text style={{fontSize: 24}}>{icons[name] || '•'}</Text>;
}

export default function RootNavigator() {
  const {isAuthenticated, isLoading} = useAuthStore();

  if (isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="ShopDetail"
              component={ShopDetailScreen}
              options={{headerShown: true, title: ''}}
            />
            <Stack.Screen
              name="Booking"
              component={BookingScreen}
              options={{headerShown: true, title: 'Book Appointment'}}
            />
            <Stack.Screen
              name="BookingDetail"
              component={BookingDetailScreen}
              options={{headerShown: true, title: 'Booking Details'}}
            />
            <Stack.Screen
              name="BookingConfirmation"
              component={BookingConfirmationScreen}
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
