import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../src/api/client';
import { UserProfile } from '../../../src/types/user';

export default function ProfileEditScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State'leri (Senin modelinle birebir uyumlu)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [newPref, setNewPref] = useState(''); // Yeni tercih eklemek için geçici state

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get<{ user: UserProfile }>(
        '/api/v1/users/me',
      );
      const u = res.data.user;

      // Backend'den gelen null değerleri boş string'e çeviriyoruz
      setFirstName(u.first_name ?? '');
      setLastName(u.last_name ?? '');
      setBio(u.bio ?? '');
      setLocation(u.location ?? '');
      setWebsite(u.website ?? '');
      setPreferences(u.preferences ?? []);
    } catch (err) {
      Alert.alert('Hata', 'Profil yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await apiClient.put('/api/v1/users/update-profile', {
        first_name: firstName || null, // Boşsa null gönder (Go tarafındaki pointer için)
        last_name: lastName || null,
        bio: bio || null,
        location: location || null,
        website: website || null,
        preferences: preferences,
      });
      Alert.alert('Başarılı', 'Profilin güncellendi! 🚀');
      // router.back();
      router.navigate('/(tabs)/profile');
    } catch (err) {
      Alert.alert('Hata', 'Güncelleme başarısız oldu.');
    } finally {
      setSaving(false);
    }
  };

  const addPreference = () => {
    if (newPref.trim() && !preferences.includes(newPref.trim())) {
      setPreferences([...preferences, newPref.trim()]);
      setNewPref('');
    }
  };

  const removePreference = (val: string) => {
    setPreferences(preferences.filter((p) => p !== val));
  };

  if (loading) {
    return (
      <ActivityIndicator className="flex-1" size="large" color="#4ECDC4" />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-6 pb-10" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between my-6">
          <Text className="text-3xl font-black text-gray-800">Düzenle</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* İsim & Soyisim (Yan Yana) */}
        <View className="flex-row space-x-4 mb-4">
          <View className="flex-1">
            <Text className="text-gray-400 font-bold text-[10px] uppercase mb-1 ml-1">
              Ad
            </Text>
            <TextInput
              className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Adın"
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-gray-400 font-bold text-[10px] uppercase mb-1 ml-1">
              Soyad
            </Text>
            <TextInput
              className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Soyadın"
            />
          </View>
        </View>

        {/* Bio */}
        <Text className="text-gray-400 font-bold text-[10px] uppercase mb-1 ml-1">
          Hakkında
        </Text>
        <TextInput
          className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4 min-h-[80px]"
          multiline
          value={bio}
          onChangeText={setBio}
          placeholder="Kendinden bahset..."
          textAlignVertical="top"
        />

        {/* Konum & Website */}
        <Text className="text-gray-400 font-bold text-[10px] uppercase mb-1 ml-1">
          Konum
        </Text>
        <TextInput
          className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4"
          value={location}
          onChangeText={setLocation}
          placeholder="Örn: İstanbul, TR"
        />

        <Text className="text-gray-400 font-bold text-[10px] uppercase mb-1 ml-1">
          Website
        </Text>
        <TextInput
          className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4"
          value={website}
          onChangeText={setWebsite}
          placeholder="https://..."
          keyboardType="url"
        />

        {/* Tercihler (Preferences) */}
        <Text className="text-gray-400 font-bold text-[10px] uppercase mb-2 ml-1">
          İlgi Alanların (Tercihler)
        </Text>
        <View className="flex-row items-center mb-3">
          <TextInput
            className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 mr-2"
            value={newPref}
            onChangeText={setNewPref}
            placeholder="Yeni ekle..."
          />
          <TouchableOpacity
            onPress={addPreference}
            className="bg-[#4ECDC4] p-4 rounded-2xl"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap mb-8">
          {preferences.map((p, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => removePreference(p)}
              className="bg-[#4ECDC4]/10 border border-[#4ECDC4] px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center"
            >
              <Text className="text-[#4ECDC4] font-medium mr-1">{p}</Text>
              <Ionicons name="close-circle" size={14} color="#4ECDC4" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Güncelle Butonu */}
        <TouchableOpacity
          disabled={saving}
          onPress={handleUpdate}
          className={`h-16 rounded-3xl items-center justify-center shadow-xl shadow-teal-500/30 ${saving ? 'bg-gray-200' : 'bg-[#4ECDC4]'}`}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-black text-lg tracking-widest uppercase">
              Bilgileri Güncelle
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
