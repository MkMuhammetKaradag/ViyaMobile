// src/api/client.ts
import axios from 'axios';

// ipconfig'de gördüğün IPv4 adresini buraya tırnak içinde yapıştır
const MY_COMPUTER_IP = process.env.EXPO_PUBLIC_API_IP;
const PORT = process.env.EXPO_PUBLIC_API_PORT;
if (!MY_COMPUTER_IP || !PORT) {
  console.warn('⚠️ API yapılandırması .env dosyasında bulunamadı!');
}
export const apiClient = axios.create({
  baseURL: `http://${MY_COMPUTER_IP}:${PORT}`,
  timeout: 10000, // 10 saniye bekle, hemen pes etme
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
