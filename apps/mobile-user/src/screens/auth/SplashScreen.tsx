import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useAuthStore} from '../../stores/authStore';

export default function SplashScreen() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Overline</Text>
      <Text style={styles.tagline}>Book your style</Text>
      <ActivityIndicator
        size="large"
        color="#4F46E5"
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#E0E7FF',
    marginBottom: 48,
  },
  loader: {
    marginTop: 24,
  },
});
