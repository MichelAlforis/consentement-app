import Link from 'next/link';

export default function Logo({ variant = 'default' }: { variant?: 'default' | 'footer' }) {
  const badgeSize = variant === 'footer' ? 30 : 36;
  const imgSize = Math.round(badgeSize * 1.6);

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div
        className="relative flex-shrink-0 rounded-xl"
        style={{
          width: badgeSize,
          height: badgeSize,
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          boxShadow: '0 0 16px rgba(139,92,246,0.3)',
          overflow: 'visible',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/symbol.svg"
          alt=""
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -10%)',
            width: imgSize,
            height: 'auto',
            filter: 'brightness(0) invert(1)',
            display: 'block',
            pointerEvents: 'none',
          }}
        />
      </div>

      <span className={`font-black tracking-tight group-hover:opacity-80 transition-opacity ${variant === 'footer' ? 'text-base text-oui-muted' : 'text-lg text-white'}`}>
        OuiClair
      </span>
    </Link>
  );
}
