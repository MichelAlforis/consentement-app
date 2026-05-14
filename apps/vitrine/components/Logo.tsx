import Link from 'next/link';

export default function Logo({ variant = 'default' }: { variant?: 'default' | 'footer' }) {
  const size = variant === 'footer' ? 30 : 44;

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(145deg, #2d1b69 0%, #0d0714 100%)',
          boxShadow: '0 0 20px rgba(139,92,246,0.25)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/symbol.svg"
          alt=""
          style={{
            position: 'absolute',
            top: '-5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            height: 'auto',
            filter: 'invert(71%) sepia(36%) saturate(900%) hue-rotate(220deg) brightness(110%)',
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
