export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
    const res = await fetch(dataUrl);
    return await res.blob();
};

export const extractBase64 = (dataUrl: string): string => {
    return dataUrl.split(',')[1];
}

export const extractMimeType = (dataUrl: string): string | null => {
  const match = dataUrl.match(/^data:(image\/[a-z]+);base64,/);
  return match ? match[1] : 'image/png';
};