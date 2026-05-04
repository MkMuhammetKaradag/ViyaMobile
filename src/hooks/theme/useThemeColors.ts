import { COLORS } from '@/src/constants/Theme';
import { useTheme } from './ThemeContext';

export function useThemeColors() {
  const { resolvedTheme } = useTheme();

  return COLORS[resolvedTheme];
}
