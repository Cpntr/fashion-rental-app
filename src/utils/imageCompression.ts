// utils/imageCompression.ts
export async function fileToCompressedDataUrl(
  file: File,
  {
    maxWidth = 1600,
    maxHeight = 1600,
    maxBytes = 800 * 1024, // 800 KB
    minQuality = 0.5,
  }: { maxWidth?: number; maxHeight?: number; maxBytes?: number; minQuality?: number } = {},
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer]);
  const imageBitmap = await createImageBitmap(blob);

  const ratio = Math.min(maxWidth / imageBitmap.width, maxHeight / imageBitmap.height, 1);
  const targetW = Math.round(imageBitmap.width * ratio);
  const targetH = Math.round(imageBitmap.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imageBitmap, 0, 0, targetW, targetH);

  // Try from 0.8 down to minQuality to fit maxBytes
  let quality = 0.8;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);

  const toBytes = (dataUrlStr: string) =>
    Math.ceil((dataUrlStr.length - 'data:image/jpeg;base64,'.length) * 3 / 4);

  let size = toBytes(dataUrl);

  while (size > maxBytes && quality > minQuality) {
    quality = Math.max(minQuality, quality - 0.1);
    dataUrl = canvas.toDataURL('image/jpeg', quality);
    size = toBytes(dataUrl);
  }

  return dataUrl;
}
