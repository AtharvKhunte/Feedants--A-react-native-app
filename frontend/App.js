import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AppNavigator from './src/navigation/AppNavigator';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    axios.post('http://192.168.0.197:5000/api/auth/login', {
      email: 'atharv@test.com',
      password: 'password123',
    })
    .then(r => AsyncStorage.setItem('token', r.data.token))
    .finally(() => setReady(true));
  }, []);

  if (!ready) return <View style={{flex:1}}><ActivityIndicator style={{flex:1}} /></View>;
  return <AppNavigator />;
}