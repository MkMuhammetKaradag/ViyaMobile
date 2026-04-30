import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

export default function ScreenWrapper({
  children,
  backgroundColor,
}: ScreenWrapperProps) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const isDark = colorScheme === 'dark';
  const finalColor = backgroundColor || (isDark ? '#000000' : '#FFFFFF');

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
      NavigationBar.setBackgroundColorAsync(finalColor);
      NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
    }
  }, [finalColor, isDark]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: finalColor,
        paddingTop: insets.top + 2, // status bar alanı
        paddingBottom: insets.bottom, // navigation bar alanı
      }}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
