import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import React from 'react';
import { TextInput, View } from 'react-native';

type Props = {
  title: string;
  desc: string;
  onTitleChange: (v: string) => void;
  onDescChange: (v: string) => void;
};

export function TripFormHeader({
  title,
  desc,
  onTitleChange,
  onDescChange,
}: Props) {
  const theme = useThemeColors();

  return (
    <View style={{ marginBottom: 32 }}>
      <TextInput
        placeholder="Rotalara bir isim ver..."
        placeholderTextColor={theme.placeholder}
        value={title}
        onChangeText={onTitleChange}
        style={{
          fontSize: 20,
          fontWeight: '900',
          padding: 16,
          backgroundColor: theme.surface,
          borderRadius: 24,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: theme.border,
          color: theme.text,
        }}
      />
      <TextInput
        placeholder="Hikayen ne?"
        placeholderTextColor={theme.placeholder}
        value={desc}
        onChangeText={onDescChange}
        multiline
        style={{
          padding: 16,
          backgroundColor: theme.surface,
          borderRadius: 24,
          minHeight: 100,
          borderWidth: 1,
          borderColor: theme.border,
          color: theme.text,
        }}
      />
    </View>
  );
}
