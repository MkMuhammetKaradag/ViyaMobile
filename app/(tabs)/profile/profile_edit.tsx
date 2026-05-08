import { ThemePreference, useTheme } from '@/src/hooks/theme/ThemeContext';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useUserStore } from '@/src/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Switch,
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
  const { updateUserLocal } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [bannerUri, setBannerUri] = useState<string | null>(null);

  // Form State'leri (Senin modelinle birebir uyumlu)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [isPrivate, setIsPrivate] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [newPref, setNewPref] = useState(''); // Yeni tercih eklemek için geçici state
  const { themePreference, setThemePreference } = useTheme();
  const [selectedTheme, setSelectedTheme] =
    useState<ThemePreference>(themePreference);
  const themeColors = useThemeColors();

  useEffect(() => {
    setSelectedTheme(themePreference);
  }, [themePreference]);

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
      setAvatarUri(u.avatar_url);
      setBannerUri(u.banner_url);
      setIsPrivate(u.is_private);
    } catch (err) {
      Alert.alert('Hata', 'Profil yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };
  const pickImage = async (type: 'avatar' | 'banner') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9], // Avatar kare, Banner geniş
      quality: 0.7, // Cloudinary'yi yormamak için biraz sıkıştıralım
    });

    if (!result.canceled) {
      if (type === 'avatar') setAvatarUri(result.assets[0].uri);
      else setBannerUri(result.assets[0].uri);

      // Hemen yüklemek istersen burada upload fonksiyonunu çağırabilirsin
      uploadImage(result.assets[0].uri, type);
    }
  };
  const handleUpdate = async () => {
    setSaving(true);
    try {
      const payload = {
        first_name: firstName || null,
        last_name: lastName || null,
        bio: bio || null,
        location: location || null,
        website: website || null,
        preferences: preferences,
        is_private: isPrivate !== null ? isPrivate : null,
      };

      await apiClient.put('/api/v1/users/update-profile', payload);
      updateUserLocal({
        first_name: firstName,
        last_name: lastName,
        bio: bio,
        location: location,
        website: website,
        preferences: preferences,
        is_private: isPrivate !== null ? isPrivate : undefined,
      });
      Alert.alert('Başarılı', 'Profilin güncellendi! 🚀');
      // router.navigate('/(tabs)/profile');
      router.back();
    } catch (err) {
      Alert.alert('Hata', 'Güncelleme başarısız oldu.');
    } finally {
      setSaving(false);
    }
  };
  // Backend'e Yükleme (Postman'deki mantığın kod hali)
  const uploadImage = async (uri: string, type: 'avatar' | 'banner') => {
    const formData = new FormData();
    const fileToUpload = {
      uri: uri,
      name: type === 'avatar' ? 'avatar.jpg' : 'banner.jpg',
      type: 'image/jpeg',
    } as any;

    formData.append(type === 'avatar' ? 'avatar' : 'banner', fileToUpload);

    try {
      const endpoint =
        type === 'avatar'
          ? '/api/v1/users/upload-avatar'
          : '/api/v1/users/upload-banner';

      // Backend'den dönen yanıtı (response) alalım
      const res = await apiClient.post<{
        message: string;
        avatar_url?: string;
        banner_url?: string;
      }>(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 🔥 KRİTİK NOKTA: Zustand Store'u yeni URL ile güncelle
      if (type === 'avatar' && res.data.avatar_url) {
        updateUserLocal({ avatar_url: res.data.avatar_url });
      } else if (type === 'banner' && res.data.banner_url) {
        updateUserLocal({ banner_url: res.data.banner_url });
      }

      Alert.alert('Başarılı', 'Fotoğraf güncellendi!');
    } catch (error) {
      console.error('Yükleme hatası:', error);
      Alert.alert('Hata', 'Fotoğraf yüklenemedi.');
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

  const handleThemeChange = async (choice: ThemePreference) => {
    try {
      await setThemePreference(choice);
      setSelectedTheme(choice);
      Alert.alert('Tema kaydedildi', 'Tema tercihin başarıyla güncellendi.');
    } catch (error) {
      Alert.alert('Hata', 'Tema tercihi kaydedilemedi.');
    }
  };

  if (loading) {
    return (
      <ActivityIndicator className="flex-1" size="large" color="#4ECDC4" />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView
        className="px-6 pb-10"
        style={{ backgroundColor: themeColors.background }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between my-6">
          <Text
            style={{ color: themeColors.text }}
            className="text-3xl font-black"
          >
            Düzenle
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={themeColors.text} />
          </TouchableOpacity>
        </View>

        <View>
          {/* Banner Alanı Düzenleme */}
          <View className="h-44 w-full bg-gray-100 relative">
            {/* Eğer bannerUri varsa resmi göster, yoksa Viya renginde boş bir alan bırak */}
            {bannerUri ? (
              <Image
                source={{ uri: bannerUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-[#4ECDC4]/10 items-center justify-center">
                <Ionicons
                  name="images-outline"
                  size={32}
                  color="#4ECDC4"
                  opacity={0.5}
                />
              </View>
            )}

            {/* Banner Düzenleme Butonu (HER ZAMAN GÖRÜNÜR) */}
            <TouchableOpacity
              onPress={() => pickImage('banner')}
              className="absolute right-4 bottom-4 bg-black/40 p-3 rounded-full border border-white/20"
            >
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Avatar Alanı Düzenleme */}
          <View className="items-center -mt-14">
            <View className="relative shadow-xl">
              <View className="w-28 h-28 rounded-full border-4 border-white bg-gray-50 overflow-hidden items-center justify-center">
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    className="w-full h-full"
                  />
                ) : (
                  <Ionicons name="person" size={50} color="#D1D5DB" />
                )}
              </View>

              {/* Avatar Düzenleme Butonu (HER ZAMAN GÖRÜNÜR) */}
              <TouchableOpacity
                onPress={() => pickImage('avatar')}
                className="absolute right-0 bottom-1 bg-[#4ECDC4] p-2.5 rounded-full border-2 border-white shadow-lg"
              >
                <Ionicons name="pencil" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* İsim & Soyisim (Yan Yana) */}
        <View className="flex-row space-x-4 mb-4">
          <View className="flex-1">
            <Text
              style={{ color: themeColors.gray }}
              className="text-gray-400 font-bold text-[10px] uppercase mb-1 ml-1"
            >
              Ad
            </Text>
            <TextInput
              className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
              style={{
                backgroundColor: themeColors.lightGray,
                color: themeColors.text,
                borderColor: themeColors.border,
              }}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Adın"
              placeholderTextColor={themeColors.gray}
            />
          </View>
          <View className="flex-1 ml-4">
            <Text
              style={{ color: themeColors.gray }}
              className="text-gray-400 font-bold text-[10px] uppercase mb-1 ml-1"
            >
              Soyad
            </Text>
            <TextInput
              className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
              style={{
                backgroundColor: themeColors.lightGray,
                color: themeColors.text,
                borderColor: themeColors.border,
              }}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Soyadın"
              placeholderTextColor={themeColors.gray}
            />
          </View>
        </View>

        {/* Bio */}
        <Text
          style={{ color: themeColors.gray }}
          className="text-gray-400 font-bold text-[10px] uppercase mb-1 ml-1"
        >
          Hakkında
        </Text>
        <TextInput
          className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4 min-h-[80px]"
          style={{
            backgroundColor: themeColors.lightGray,
            color: themeColors.text,
            borderColor: themeColors.border,
          }}
          multiline
          value={bio}
          onChangeText={setBio}
          placeholder="Kendinden bahset..."
          placeholderTextColor={themeColors.gray}
          textAlignVertical="top"
        />

        {/* Konum & Website */}
        <Text
          style={{ color: themeColors.gray }}
          className="text-gray-400 font-bold text-[10px] uppercase mb-1 ml-1"
        >
          Konum
        </Text>
        <TextInput
          className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4"
          style={{
            backgroundColor: themeColors.lightGray,
            color: themeColors.text,
            borderColor: themeColors.border,
          }}
          value={location}
          onChangeText={setLocation}
          placeholder="Örn: İstanbul, TR"
          placeholderTextColor={themeColors.gray}
        />

        <Text
          style={{ color: themeColors.gray }}
          className="text-gray-400 font-bold text-[10px] uppercase mb-1 ml-1"
        >
          Website
        </Text>
        <TextInput
          className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4"
          style={{
            backgroundColor: themeColors.lightGray,
            color: themeColors.text,
            borderColor: themeColors.border,
          }}
          value={website}
          onChangeText={setWebsite}
          placeholder="https://..."
          placeholderTextColor={themeColors.gray}
          keyboardType="url"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            paddingHorizontal: 4,
          }}
        >
          <View style={{ flex: 1, marginRight: 16 }}>
            <Text
              style={{
                color: themeColors.text,
                fontWeight: '900',
                fontSize: 15,
              }}
            >
              Profil Gizliliği
            </Text>
            <Text style={{ color: themeColors.subtext, fontSize: 12 }}>
              Profilini gizli yaparsan, sadece onayladığın kişiler profiline ve
              paylaşımlarına erişebilir.
            </Text>
          </View>
          <Switch
            trackColor={{
              false: themeColors.border,
              true: themeColors.primary,
            }}
            thumbColor={
              isPrivate ? themeColors.background : themeColors.surface
            }
            onValueChange={(val) => {
              setIsPrivate(val);
            }}
            value={isPrivate || false}
          />
        </View>

        {/* Tema Seçimi */}
        <View className="mb-6">
          <Text
            style={{ color: themeColors.gray }}
            className="text-[10px] uppercase mb-2 ml-1 font-bold"
          >
            Tema
          </Text>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            {[
              { value: 'default' as ThemePreference, label: 'Sistem' },
              { value: 'light' as ThemePreference, label: 'Açık' },
              { value: 'dark' as ThemePreference, label: 'Karanlık' },
            ].map((item, index) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => handleThemeChange(item.value)}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 24,
                  backgroundColor:
                    selectedTheme === item.value
                      ? themeColors.primary
                      : themeColors.lightGray,
                  borderWidth: 1,
                  borderColor:
                    selectedTheme === item.value
                      ? themeColors.primary
                      : themeColors.border,
                  marginRight: index < 2 ? 10 : 0,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color:
                      selectedTheme === item.value
                        ? '#ffffff'
                        : themeColors.text,
                    fontWeight: '700',
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ color: themeColors.gray, fontSize: 12 }}>
            Varsayılan seçilirse sistem moduna göre tema otomatik ayarlanır.
          </Text>
        </View>

        {/* Tercihler (Preferences) */}
        <Text
          style={{ color: themeColors.gray }}
          className="text-gray-400 font-bold text-[10px] uppercase mb-2 ml-1"
        >
          İlgi Alanların (Tercihler)
        </Text>
        <View className="flex-row items-center mb-3">
          <TextInput
            className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 mr-2"
            style={{
              backgroundColor: themeColors.lightGray,
              color: themeColors.text,
              borderColor: themeColors.border,
            }}
            value={newPref}
            onChangeText={setNewPref}
            placeholder="Yeni ekle..."
            placeholderTextColor={themeColors.gray}
          />
          <TouchableOpacity
            onPress={addPreference}
            style={{
              backgroundColor: themeColors.primary,
              padding: 16,
              borderRadius: 24,
            }}
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
