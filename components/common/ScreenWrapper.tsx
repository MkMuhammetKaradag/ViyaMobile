import { useTheme } from '@/src/hooks/theme/ThemeContext';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

export default function ScreenWrapper({
  children,
  backgroundColor,
}: ScreenWrapperProps) {
  const { resolvedTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const isDark = resolvedTheme === 'dark';
  const finalColor = backgroundColor || colors.background;

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
        // Status bar ve güvenli alan boşlukları
        paddingTop: Platform.OS === 'android' ? insets.top + 2 : insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
