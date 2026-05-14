import Link from 'next/link';

export default function Logo({ variant = 'default' }: { variant?: 'default' | 'footer' }) {
  const size = variant === 'footer' ? 28 : 32;

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          boxShadow: '0 0 16px rgba(139,92,246,0.3)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/symbol.svg"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            filter: 'brightness(0) invert(1)',
            display: 'block',
          }}
        />
      </div>

      <span className={`font-black tracking-tight group-hover:opacity-80 transition-opacity ${variant === 'footer' ? 'text-base text-oui-muted' : 'text-lg text-white'}`}>
        OuiClair
      </span>
    </Link>
  );
}
