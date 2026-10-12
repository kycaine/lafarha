/**
 * Utility untuk konversi dan kompresi gambar client-side ke format WebP
 * Memastikan ukuran file sesuai batas maksimal tanpa mengurangi ketajaman visual.
 */

export interface CompressionOptions {
  /** Batas maksimal ukuran file dalam bytes (contoh: 500 * 1024 untuk 500KB) */
  maxSizeBytes: number;
  /** Batas maksimal lebar gambar dalam pixel (default: 1920) */
  maxWidth?: number;
  /** Batas maksimal tinggi gambar dalam pixel (default: 1920) */
  maxHeight?: number;
  /** Kualitas awal WebP (0.1 - 1.0, default: 0.90 untuk visually lossless) */
  initialQuality?: number;
  /** Kualitas minimal jika file masih di atas batas ukuran (default: 0.65) */
  minQuality?: number;
}

export interface CompressedImageResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  format: "image/webp";
}

/**
 * Konversi File gambar apa saja (PNG, JPG, HEIC, dll) ke format WebP
 * dengan resolusi proporsional dan ukuran file di bawah batas maksimal.
 */
export async function convertAndCompressToWebp(
  file: File,
  options: CompressionOptions
): Promise<CompressedImageResult> {
  const {
    maxSizeBytes,
    maxWidth = 1920,
    maxHeight = 1920,
    initialQuality = 0.90,
    minQuality = 0.65,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("File tidak dapat dibuka sebagai gambar"));

      img.onload = async () => {
        try {
          let { width, height } = img;

          // 1. Skala proporsional jika melebihi batas maxWidth / maxHeight
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // 2. Buat Canvas untuk render
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d", { willReadFrequently: false });
          if (!ctx) {
            return reject(new Error("Gagal menginisialisasi canvas"));
          }

          // Anti-aliasing halus
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // 3. Iteratif kompresi ke WebP hingga ukuran <= maxSizeBytes
          let quality = initialQuality;
          let blob: Blob | null = null;

          const getBlob = (q: number): Promise<Blob | null> => {
            return new Promise((res) => {
              canvas.toBlob((b) => res(b), "image/webp", q);
            });
          };

          blob = await getBlob(quality);

          // Jika masih di atas batas ukuran, kurangi kualitas bertahap
          while (blob && blob.size > maxSizeBytes && quality > minQuality) {
            quality = Math.max(minQuality, quality - 0.08);
            blob = await getBlob(quality);
          }

          // Jika pada minQuality masih sedikit melebihi, kecilkan dimensinya sedikit
          if (blob && blob.size > maxSizeBytes) {
            let scale = 0.85;
            while (blob && blob.size > maxSizeBytes && scale >= 0.5) {
              const scaledCanvas = document.createElement("canvas");
              scaledCanvas.width = Math.round(width * scale);
              scaledCanvas.height = Math.round(height * scale);
              const scaledCtx = scaledCanvas.getContext("2d");
              if (scaledCtx) {
                scaledCtx.imageSmoothingEnabled = true;
                scaledCtx.imageSmoothingQuality = "high";
                scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
                blob = await new Promise<Blob | null>((res) => {
                  scaledCanvas.toBlob((b) => res(b), "image/webp", minQuality);
                });
              }
              scale -= 0.15;
            }
          }

          if (!blob) {
            return reject(new Error("Gagal mengonversi gambar ke WebP"));
          }

          // Buat File object baru dengan nama berekstensi .webp
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const webpFile = new File([blob], `${baseName}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
          });

          // Baca dataUrl untuk preview instan
          const dataUrl = await new Promise<string>((res) => {
            const r = new FileReader();
            r.onloadend = () => res(r.result as string);
            r.readAsDataURL(blob!);
          });

          resolve({
            file: webpFile,
            dataUrl,
            originalSize: file.size,
            compressedSize: blob.size,
            width,
            height,
            format: "image/webp",
          });
        } catch (err) {
          reject(err);
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format ukuran bytes ke teks yang ramah dibaca (KB / MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Normalisasi URL gambar dari database atau storage R2
 * - Gambar /storage/... dialihkan melalui /api/proxy/storage/... atau /storage/...
 * - Gambar base64 (data:...) atau link eksternal (http/https) tetap utuh
 */
export function getStorageImageUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/api/proxy/storage/")) {
    return url;
  }
  if (url.startsWith("/storage/")) {
    return `/api/proxy${url}`;
  }
  if (url.startsWith("storage/")) {
    return `/api/proxy/${url}`;
  }
  return url;
}

