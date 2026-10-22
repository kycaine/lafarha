/**
 * WhatsApp Deep-Linking & Routing Utility
 * 
 * Mengatasi masalah pembukaan WhatsApp dari berbagai browser & perangkat:
 * - Desktop: Langsung ke WhatsApp Web di tab baru (tanpa tertahan di wa.me redirect gate).
 * - Android: Menggunakan Android Intent resmi (intent://send/...) lengkap dengan S.browser_fallback_url
 *   sehingga langsung membangunkan aplikasi WhatsApp dan aman di browser privasi (Brave, Quetta)
 *   serta in-app browser.
 * - iOS: Menggunakan custom URI scheme (whatsapp://send) dengan listener blur/pagehide/visibility
 *   untuk mencegah redirect tab ganda saat aplikasi WhatsApp atau dialog sistem terbuka.
 */

export interface WhatsAppUrls {
  cleanPhone: string;
  webUrl: string;
  universalUrl: string;
  appUri: string;
  intentUrl: string;
}

export interface DevicePlatform {
  isAndroid: boolean;
  isIOS: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isInAppBrowser: boolean;
}

/**
 * Membersihkan format nomor telepon WhatsApp ke standar internasional tanpa tanda '+'
 * Contoh:
 * - '081234567890' -> '6281234567890'
 * - '+62 812-3456-7890' -> '6281234567890'
 * - '81234567890' -> '6281234567890'
 */
export function cleanWhatsAppNumber(phone?: string | null): string {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  }

  return cleaned;
}

/**
 * Mendeteksi platform & lingkungan browser pengguna saat ini (client-side)
 */
export function getDevicePlatform(): DevicePlatform {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      isAndroid: false,
      isIOS: false,
      isMobile: false,
      isDesktop: true,
      isInAppBrowser: false,
    };
  }

  const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || "";
  const isAndroid = /android/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
  const isMobile = isAndroid || isIOS;
  const isDesktop = !isMobile;
  const isInAppBrowser = /FBAN|FBAV|Instagram|musical_ly|ByteDance|TikTok|Line\/|Twitter/i.test(ua);

  return {
    isAndroid,
    isIOS,
    isMobile,
    isDesktop,
    isInAppBrowser,
  };
}

/**
 * Menghasilkan kumpulan URL WhatsApp sesuai berbagai protokol
 */
export function getWhatsAppUrls(phone: string, message?: string): WhatsAppUrls {
  const cleanPhone = cleanWhatsAppNumber(phone);
  const encodedText = message ? encodeURIComponent(message) : "";
  const queryParam = encodedText ? `&text=${encodedText}` : "";

  // 1. WhatsApp Web langsung untuk Desktop
  const webUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}${queryParam}`;

  // 2. Universal API URL (fallback aman standar WhatsApp)
  const universalUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}${queryParam}`;

  // 3. Custom URI Scheme langsung membuka aplikasi
  const appUri = `whatsapp://send?phone=${cleanPhone}${queryParam}`;

  // 4. Android Intent resmi dengan fallback otomatis ke universalUrl
  const fallbackEncoded = encodeURIComponent(universalUrl);
  const intentUrl = `intent://send/?phone=${cleanPhone}${queryParam}#Intent;scheme=whatsapp;package=com.whatsapp;S.browser_fallback_url=${fallbackEncoded};end`;

  return {
    cleanPhone,
    webUrl,
    universalUrl,
    appUri,
    intentUrl,
  };
}

/**
 * URL fallback standar yang aman diletakkan pada atribut `href` tag <a>
 */
export function getWhatsAppFallbackUrl(phone: string, message?: string): string {
  const urls = getWhatsAppUrls(phone, message);
  return urls.universalUrl;
}

/**
 * Membuka WhatsApp secara cerdas berdasarkan perangkat & browser pengguna
 */
export function openWhatsApp(
  phone: string,
  message?: string,
  options?: { newTabOnDesktop?: boolean }
): void {
  if (typeof window === "undefined") return;

  const urls = getWhatsAppUrls(phone, message);
  if (!urls.cleanPhone) {
    console.warn("[WhatsApp] Nomor telepon tidak valid:", phone);
    return;
  }

  const platform = getDevicePlatform();

  // Skenario 1: Desktop (PC / Laptop / Mac)
  // Buka WhatsApp Web di tab baru agar halaman website saat ini tetap terbuka
  if (platform.isDesktop) {
    const target = options?.newTabOnDesktop !== false ? "_blank" : "_self";
    window.open(urls.webUrl, target, "noopener,noreferrer");
    return;
  }

  // Skenario 2: Android (Chrome, Brave, Quetta, Samsung Internet, Webview)
  // Gunakan Android Intent resmi: langsung membuka aplikasi WhatsApp.
  // Jika WhatsApp belum terinstall, sistem Android otomatis membuka S.browser_fallback_url
  if (platform.isAndroid) {
    window.location.href = urls.intentUrl;
    return;
  }

  // Skenario 3: iOS (iPhone / iPad / Safari)
  // Gunakan custom scheme `whatsapp://send` dengan deteksi blur & visibility
  if (platform.isIOS) {
    let appOpened = false;

    const onAppSwitch = () => {
      appOpened = true;
    };

    window.addEventListener("blur", onAppSwitch, { once: true });
    window.addEventListener("pagehide", onAppSwitch, { once: true });
    
    const onVisibilityChange = () => {
      if (document.hidden) {
        appOpened = true;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange, { once: true });

    // Coba bangunkan aplikasi WhatsApp via custom scheme
    window.location.href = urls.appUri;

    // Fallback timer: hanya dialihkan jika pengguna masih di Safari dan tidak ada perpindahan app
    setTimeout(() => {
      window.removeEventListener("blur", onAppSwitch);
      window.removeEventListener("pagehide", onAppSwitch);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (!appOpened && !document.hidden) {
        window.location.href = urls.universalUrl;
      }
    }, 2200);
    return;
  }

  // Fallback perangkat lain / tidak terdeteksi
  window.location.href = urls.universalUrl;
}

/**
 * Event handler helper untuk tag <a> atau <button>
 * Contoh:
 * <a href={getWhatsAppFallbackUrl(phone, msg)} onClick={handleWhatsAppClick(phone, msg)}>...</a>
 */
export function handleWhatsAppClick(
  phone: string,
  message?: string,
  options?: { newTabOnDesktop?: boolean }
) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    openWhatsApp(phone, message, options);
  };
}
