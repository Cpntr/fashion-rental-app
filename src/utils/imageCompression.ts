export async function fileToCompressedDataUrl(
  file: File,
  {
    maxWidth = 1600,
    maxHeight = 1600,
    maxBytes = 800 * 1024, // 800 KB
    startQuality = 0.8,
    minQuality = 0.5,
  } = {},
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height, 1);
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, w, h);

  const prefix = 'data:image/jpeg;base64,';
  const toBytes = (dataUrl: string) =>
    Math.ceil((dataUrl.length - prefix.length) * 3 / 4);

  let q = startQuality;
  let out = canvas.toDataURL('image/jpeg', q);
  while (toBytes(out) > maxBytes && q > minQuality) {
    q = Math.max(minQuality, +(q - 0.1).toFixed(2));
    out = canvas.toDataURL('image/jpeg', q);
  }
  return out;
}
