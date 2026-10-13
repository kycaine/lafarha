// Email sending via Resend HTTP API (Workers-compatible, no SDK needed).

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'La Farha <noreply@lafarha.id>';

export type SendEmailParams = {
  apiKey: string;
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
};

export async function sendEmail({ apiKey, to, subject, html, from, replyTo }: SendEmailParams): Promise<void> {
  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: from ?? DEFAULT_FROM,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error ${res.status}: ${body}`);
  }
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]!));

export function muthawifApprovedTemplate(nama: string, loginUrl: string): { subject: string; html: string } {
  const safeName = escapeHtml(nama || 'Muthawif');
  return {
    subject: 'Selamat! Pendaftaran Muthawif Anda Telah Disetujui',
    html: `<!DOCTYPE html>
<html lang="id">
<body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#0f3d2e;padding:24px;text-align:center;color:#d4af37;font-size:22px;font-weight:bold;">La Farha</td></tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 16px;font-size:20px;color:#0f3d2e;">Assalamu'alaikum, ${safeName}</h1>
          <p style="margin:0 0 16px;line-height:1.6;">Alhamdulillah, pendaftaran Anda sebagai <strong>Muthawif La Farha</strong> telah <strong>disetujui</strong>.</p>
          <p style="margin:0 0 24px;line-height:1.6;">Silakan masuk menggunakan email ini untuk mengakses dashboard muthawif Anda.</p>
          <p style="text-align:center;margin:0 0 24px;">
            <a href="${loginUrl}" style="display:inline-block;background:#0f3d2e;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;">Masuk ke Dashboard</a>
          </p>
          <p style="margin:0;line-height:1.6;color:#6b7280;font-size:13px;">Jazakumullahu khairan,<br/>Tim La Farha</p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">Email ini dikirim otomatis, mohon tidak membalas.</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}
