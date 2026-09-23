export const runtime = 'edge';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: 'Inter, sans-serif',
        color: '#f1f5f9',
        textAlign: 'center',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          fontSize: '120px',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #C9A84C, #E8C96C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px',
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#f1f5f9',
          marginBottom: '12px',
        }}
      >
        Halaman Tidak Ditemukan
      </h1>
      <p
        style={{
          fontSize: '16px',
          color: '#94a3b8',
          maxWidth: '400px',
          marginBottom: '40px',
          lineHeight: 1.6,
        }}
      >
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #C9A84C, #E8C96C)',
          color: '#0f172a',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '15px',
          textDecoration: 'none',
          transition: 'opacity 0.2s',
        }}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
