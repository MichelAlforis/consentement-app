import Link from 'next/link';
import Image from 'next/image';

export default function Logo({ variant = 'default' }: { variant?: 'default' | 'footer' }) {
  const size = variant === 'footer' ? 28 : 32;

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Icône app — logo.png inversé en blanc sur fond gradient */}
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          boxShadow: '0 0 16px rgba(139,92,246,0.3)',
        }}
      >
        <Image
          src="/logo.png"
          alt="OuiClair"
          width={size}
          height={size}
          className="object-contain p-0.5"
          style={{ filter: 'brightness(0) invert(1)' }}
          priority
        />
      </div>

      <span className={`font-black tracking-tight group-hover:opacity-80 transition-opacity ${variant === 'footer' ? 'text-base' : 'text-lg'} text-oui-text`}>
        Oui<span className="text-oui-violet-light">Clair</span>
      </span>
    </Link>
  );
}
