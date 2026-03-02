import React from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useAuthStore} from '../stores/authStore';
import {RootStackParamList, MainTabParamList} from '../types';

// Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import BookingsScreen from '../screens/bookings/BookingsScreen';
import BookingDetailScreen from '../screens/bookings/BookingDetailScreen';
import VerifyCodeScreen from '../screens/bookings/VerifyCodeScreen';
import ServicesScreen from '../screens/services/ServicesScreen';
import ServiceFormScreen from '../screens/services/ServiceFormScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ShopSettingsScreen from '../screens/settings/ShopSettingsScreen';
import WorkingHoursScreen from '../screens/settings/WorkingHoursScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab icon component with emoji
function TabIcon({name}: {name: string; color: string; size: number}) {
  const icons: Record<string, string> = {
    dashboard: '📊',
    bookings: '📅',
    services: '✂️',
    settings: '⚙️',
  };
  return <Text style={{fontSize: 24}}>{icons[name] || '•'}</Text>;
}

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
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color, size}) => (
            <TabIcon name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({color, size}) => (
            <TabIcon name="bookings" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarLabel: 'Services',
          tabBarIcon: ({color, size}) => (
            <TabIcon name="services" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color, size}) => (
            <TabIcon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const {isAuthenticated, isLoading, pendingEmail} = useAuthStore();

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
            {pendingEmail ? (
              <Stack.Screen name="OtpVerification" component={OtpScreen} />
            ) : (
              <Stack.Screen name="Login" component={LoginScreen} />
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="BookingDetail"
              component={BookingDetailScreen}
              options={{headerShown: true, title: 'Booking Details'}}
            />
            <Stack.Screen
              name="VerifyCode"
              component={VerifyCodeScreen}
              options={{
                headerShown: true,
                title: 'Verify Code',
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="ServiceForm"
              component={ServiceFormScreen}
              options={{headerShown: true, title: 'Service'}}
            />
            <Stack.Screen
              name="ShopSettings"
              component={ShopSettingsScreen}
              options={{headerShown: true, title: 'Shop Settings'}}
            />
            <Stack.Screen
              name="WorkingHours"
              component={WorkingHoursScreen}
              options={{headerShown: true, title: 'Working Hours'}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
