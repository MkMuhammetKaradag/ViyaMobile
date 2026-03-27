import { Cloudinary } from '@cloudinary/url-gen';

// 1. Cloudinary Yapılandırması
export const cld = new Cloudinary({
  cloud: {
    cloudName: 'YOUR_CLOUD_NAME', // Burayı kendi cloud adınla değiştir
  },
  url: {
    secure: true,
  },
});

/**
 * SDK kullanarak resim yükleme fonksiyonu
 */
export const uploadToCloudinary = async (fileUri: string): Promise<string> => {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const formData = new FormData();

  // ⚠️ KRİTİK: React Native'de FormData'ya dosya eklerken bu format şarttır.
  formData.append('file', {
    uri: fileUri,
    type: 'image/jpeg', // Dosya tipini gerekirse dinamik yapabilirsin
    name: 'upload.jpg',
  } as any);

  formData.append('upload_preset', uploadPreset);

  try {
    console.log('Yükleme başlıyor: ', fileUri);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        // ÖNEMLİ: Content-Type header'ı EKLEME! Fetch otomatik halleder.
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Cloudinary API Hatası:', data);
      throw new Error(data.error?.message || 'Yükleme başarısız');
    }

    console.log('Yükleme Başarılı! URL:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Yükleme sırasında teknik hata:', error);
    throw error;
  }
};
