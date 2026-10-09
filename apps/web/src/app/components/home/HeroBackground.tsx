"use client";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">

      {/* ── Base: very subtle warm-white tint ── */}
      <div className="absolute inset-0 bg-[#FDFCF8]" />

      {/* ── Dot grid ── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dotgrid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#B8902A" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>

      {/* ── Soft gradient orbs ── */}
      {/* Top-left warm blob */}
      <div
        className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.06) 45%, transparent 70%)",
          animation: "blobDrift1 18s ease-in-out infinite",
        }}
      />

      {/* Bottom-right warm blob */}
      <div
        className="absolute -bottom-40 -right-40 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, rgba(201,168,76,0.04) 50%, transparent 70%)",
          animation: "blobDrift2 22s ease-in-out infinite",
        }}
      />

      {/* Center highlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 65%)",
          animation: "blobDrift3 26s ease-in-out infinite",
        }}
      />

      {/* ── Decorative geometric lines ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.06 }}
      >
        {/* Diagonal lines — upper right */}
        <line x1="60%" y1="0" x2="110%" y2="60%" stroke="#C9A84C" strokeWidth="0.8" />
        <line x1="70%" y1="0" x2="120%" y2="60%" stroke="#C9A84C" strokeWidth="0.5" />
        <line x1="80%" y1="0" x2="130%" y2="60%" stroke="#C9A84C" strokeWidth="0.4" />
        {/* Diagonal lines — lower left */}
        <line x1="-10%" y1="40%" x2="40%" y2="110%" stroke="#C9A84C" strokeWidth="0.8" />
        <line x1="-20%" y1="40%" x2="30%" y2="110%" stroke="#C9A84C" strokeWidth="0.5" />
        {/* Horizontal accent */}
        <line x1="0" y1="72%" x2="30%" y2="72%" stroke="#C9A84C" strokeWidth="0.6" />
      </svg>

      {/* ── Large decorative ring — top right ── */}
      <svg
        className="absolute -top-24 -right-24 opacity-[0.07]"
        width="520" height="520"
        viewBox="0 0 520 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "slowSpin 60s linear infinite" }}
      >
        <circle cx="260" cy="260" r="240" stroke="#C9A84C" strokeWidth="1.2" />
        <circle cx="260" cy="260" r="200" stroke="#C9A84C" strokeWidth="0.7" />
        <circle cx="260" cy="260" r="160" stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="8 12" />
      </svg>

      {/* ── Small ring — bottom left ── */}
      <svg
        className="absolute -bottom-16 -left-16 opacity-[0.06]"
        width="360" height="360"
        viewBox="0 0 360 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "slowSpin 80s linear infinite reverse" }}
      >
        <circle cx="180" cy="180" r="160" stroke="#C9A84C" strokeWidth="1" />
        <circle cx="180" cy="180" r="120" stroke="#C9A84C" strokeWidth="0.6" strokeDasharray="6 10" />
      </svg>

      {/* ── Bottom fade to white ── */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent" />

      {/* ── CSS keyframes ── */}
      <style>{`
        @keyframes blobDrift1 {
          0%,100% { transform: translate(0px, 0px) scale(1);   }
          33%     { transform: translate(40px, -30px) scale(1.05); }
          66%     { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes blobDrift2 {
          0%,100% { transform: translate(0px, 0px) scale(1);   }
          40%     { transform: translate(-50px, 30px) scale(1.08); }
          70%     { transform: translate(30px, -20px) scale(0.95); }
        }
        @keyframes blobDrift3 {
          0%,100% { transform: translate(-50%,-50%) scale(1);    }
          50%     { transform: translate(-50%,-50%) scale(1.12); }
        }
        @keyframes slowSpin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
