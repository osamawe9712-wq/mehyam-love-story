// رقم واتساب مهيام والرسالة الترحيبية الموحّدة
export const WHATSAPP_NUMBER = "966577549712";

export const WHATSAPP_WELCOME_MESSAGE = [
  "🌟 *مرحبًا بكم في مهيام* ☕",
  "حيث القهوة قصة عشق",
  "",
  "━━━━━━━━━━━━━━━",
  "",
  "أرغب بالتواصل معكم بخصوص:",
  "",
  "▫️ الاستفسار عن القائمة",
  "▫️ حجز طاولة",
  "▫️ طلب مسبق",
  "▫️ أخرى: ..........",
  "",
  "━━━━━━━━━━━━━━━",
  "",
  "📝 *تفاصيل إضافية:*",
  "",
  "",
  "شكرًا لكم 🤎",
].join("\n");

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_WELCOME_MESSAGE
)}`;
