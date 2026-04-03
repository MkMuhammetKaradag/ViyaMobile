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
  return (
    <View className="mb-8">
      <TextInput
        placeholder="Rotalara bir isim ver..."
        value={title}
        onChangeText={onTitleChange}
        className="text-xl font-bold p-4 bg-gray-50 rounded-2xl mb-4 border border-gray-100"
      />
      <TextInput
        placeholder="Hikayen ne?"
        value={desc}
        onChangeText={onDescChange}
        multiline
        className="p-4 bg-gray-50 rounded-2xl min-h-[100]"
      />
    </View>
  );
}
