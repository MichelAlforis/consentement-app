import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ variant = 'default' }: { variant?: 'default' | 'footer' }) {
  const size = variant === 'footer' ? 30 : 44;
  const inset = variant === 'footer' ? 1 : 2;

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <Image
        src="/app-icon.png"
        alt=""
        width={size}
        height={size}
        className="flex-shrink-0 object-contain"
        style={{ padding: inset, boxSizing: 'border-box' }}
        priority
      />

      <span className={`font-black tracking-tight group-hover:opacity-80 transition-opacity ${variant === 'footer' ? 'text-base text-oui-muted' : 'text-lg text-white'}`}>
        OuiClair
      </span>
    </Link>
  );
}
