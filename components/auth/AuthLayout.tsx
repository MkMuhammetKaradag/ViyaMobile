import MapBG from '@/assets/images/map_bg.png';
import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <View className="flex-1 bg-white">
      <ImageBackground
        source={MapBG}
        resizeMode="cover"
        imageStyle={{ height: '30%', opacity: 0.4 }}
        imageClassName="opacity-40 absolute top-0"
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <ScrollView
              contentContainerClassName="flex-grow px-8 justify-center"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
