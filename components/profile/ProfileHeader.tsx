import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { UserProfile } from '../../src/types/user'; // Tipini doğru yerden import et

// Bileşenin hangi verileri alacağını tanımlıyoruz
interface ProfileHeaderProps {
  user: UserProfile | null;
  isOtherUser?: boolean;
}

export default function ProfileHeader({
  user,
  isOtherUser = false,
}: ProfileHeaderProps) {
  const router = useRouter();
  const theme = useThemeColors();
  const getButtonText = () => {
    if (user?.is_following) return 'Takipten çık';
    if (!user?.is_private) return 'Takip Et';
    return user?.is_requested ? 'İstek Gönderildi' : 'Takip Et';
  };
  return (
    <View>
      <View
        style={{
          height: 176,
          width: '100%',
          backgroundColor: theme.surface,
          position: 'relative',
        }}
      >
        {user?.banner_url ? (
          <Image
            source={{ uri: user.banner_url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              backgroundColor: theme.primary + '33',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="images-outline"
              size={40}
              color={theme.primary}
              opacity={0.35}
            />
          </View>
        )}

        {!isOtherUser && (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile/profile_edit')}
            style={{
              position: 'absolute',
              right: 16,
              top: 48,
              backgroundColor: 'rgba(0,0,0,0.25)',
              padding: 10,
              borderRadius: 999,
            }}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={theme.accentText}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: -56 }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
            borderWidth: 4,
            borderColor: theme.background,
            backgroundColor: theme.surface,
            overflow: 'hidden',
            shadowColor: theme.text,
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {user?.avatar_url ? (
            <Image
              source={{ uri: user.avatar_url }}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.surface,
              }}
            >
              <Ionicons name="person" size={40} color={theme.subtext} />
            </View>
          )}
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{ color: theme.text, fontSize: 26, fontWeight: '900' }}
            >
              {user?.first_name} {user?.last_name}
            </Text>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={theme.primary}
              style={{ marginLeft: 6 }}
            />
          </View>
          <Text
            style={{ color: theme.subtext, fontWeight: '600', marginTop: 4 }}
          >
            @{user?.username}
          </Text>
        </View>

        {user?.bio && (
          <Text
            style={{
              marginTop: 16,
              color: theme.subtext,
              lineHeight: 22,
              fontSize: 15,
            }}
          >
            {user.bio}
          </Text>
        )}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 }}>
          {user?.location && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 16,
                marginBottom: 8,
              }}
            >
              <Ionicons
                name="location-outline"
                size={16}
                color={theme.subtext}
              />
              <Text
                style={{ marginLeft: 6, color: theme.subtext, fontSize: 14 }}
              >
                {user.location}
              </Text>
            </View>
          )}
          {user?.website && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Ionicons name="link-outline" size={16} color={theme.primary} />
              <Text
                style={{ marginLeft: 6, color: theme.primary, fontSize: 14 }}
              >
                {user.website}
              </Text>
            </View>
          )}
        </View>

        {user?.preferences && user.preferences.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text
              style={{
                color: theme.subtext,
                fontSize: 12,
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                marginBottom: 12,
              }}
            >
              İlgi Alanları
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {user.preferences.map((pref, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: theme.surface,
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                    marginRight: 8,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                >
                  <Text
                    style={{
                      color: theme.text,
                      fontWeight: '600',
                      fontSize: 14,
                    }}
                  >
                    # {pref}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {isOtherUser && (
          <View
            style={{
              backgroundColor: theme.primary,
              padding: 10,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontWeight: '700',
                fontSize: 18,
                textAlign: 'center',
              }}
            >
              {getButtonText()}
            </Text>
          </View>
        )}
        {/* )} */}

        <View
          style={{
            flexDirection: 'row',
            marginTop: 24,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            paddingTop: 24,
            paddingBottom: 24,
          }}
        >
          <View style={{ marginRight: 32 }}>
            <Text
              style={{ color: theme.text, fontWeight: '900', fontSize: 20 }}
            >
              128
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>Rota</Text>
          </View>
          <View style={{ marginRight: 32 }}>
            <Text
              style={{ color: theme.text, fontWeight: '900', fontSize: 20 }}
            >
              1.2K
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>Takipçi</Text>
          </View>
          <View>
            <Text
              style={{ color: theme.text, fontWeight: '900', fontSize: 20 }}
            >
              450
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>Beğeni</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
