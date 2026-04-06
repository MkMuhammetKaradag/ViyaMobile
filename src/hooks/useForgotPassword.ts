import { apiClient } from '@/src/api/client';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export function useForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleRequestCode = async () => {
    if (!email) return Alert.alert('Hata', 'Lütfen e-posta adresinizi girin');

    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/forgot-password', {
        identifier: email,
      });
      if (response.data.session_id) {
        setSessionId(response.data.session_id);
      }
      setStep(2);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Kod gönderilemedi';
      Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (code.length < 6 || !newPassword) {
      return Alert.alert(
        'Hata',
        'Lütfen 6 haneli kodu ve yeni şifrenizi girin',
      );
    }

    setLoading(true);
    try {
      await apiClient.post('/api/v1/auth/reset-password', {
        session_id: sessionId,
        code,
        new_password: newPassword,
      });
      Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi.', [
        { text: 'Giriş Yap', onPress: () => router.replace('/(auth)') },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Hata',
        error.response?.data?.message || 'Sıfırlama başarısız',
      );
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => (step === 2 ? setStep(1) : router.back());

  return {
    step,
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    loading,
    handleRequestCode,
    handleResetPassword,
    goBack,
  };
}
