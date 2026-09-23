import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️  Replace with your machine's LAN IP when testing on a physical device
// e.g., http://192.168.1.10:5000/api
// For emulator: http://10.0.2.2:5000/api (Android) or http://localhost:5000/api (iOS sim)
const BASE_URL = 'http://192.168.0.197:5000/api';

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

// Attach JWT to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (data) =>
  api.post('/auth/register', data);

// Competitions
export const getCompetition = (id) =>
  api.get(`/competitions/${id}`);

export const registerForCompetition = (id, paymentId) =>
  api.post(`/competitions/${id}/register`, { paymentId });

export const submitEntry = (id, submissionUrl) =>
  api.post(`/competitions/${id}/submit`, { submissionUrl });

// Referrals
export const getReferralLink = (competitionId) =>
  api.get(`/referrals/link/${competitionId}`);

export const applyReferral = (referralCode, competitionId) =>
  api.post('/referrals/apply', { referralCode, competitionId });

export default api;