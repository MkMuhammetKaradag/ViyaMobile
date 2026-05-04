import * as SecureStore from 'expo-secure-store';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

export type ThemePreference = 'default' | 'light' | 'dark';

interface ThemeContextValue {
  themePreference: ThemePreference;
  resolvedTheme: 'light' | 'dark';
  setThemePreference: (theme: ThemePreference) => Promise<void>;
  isThemeReady: boolean;
}

const THEME_PREFERENCE_KEY = 'themePreference';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>('default');
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme =
          await SecureStore.getItemAsync(THEME_PREFERENCE_KEY);

        if (
          storedTheme === 'light' ||
          storedTheme === 'dark' ||
          storedTheme === 'default'
        ) {
          setThemePreferenceState(storedTheme);
        } else {
          setThemePreferenceState('default');
        }
      } catch (error) {
        console.warn('Tema tercihi okunamadı:', error);
        setThemePreferenceState('default');
      } finally {
        setIsThemeReady(true);
      }
    };

    loadThemePreference();
  }, []);

  const setThemePreference = async (value: ThemePreference) => {
    try {
      await SecureStore.setItemAsync(THEME_PREFERENCE_KEY, value);
      setThemePreferenceState(value);
    } catch (error) {
      console.warn('Theme preference could not be saved:', error);
    }
  };

  const resolvedTheme = useMemo<'light' | 'dark'>(() => {
    if (themePreference === 'default') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }

    return themePreference;
  }, [themePreference, systemColorScheme]);

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        resolvedTheme,
        setThemePreference,
        isThemeReady,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
