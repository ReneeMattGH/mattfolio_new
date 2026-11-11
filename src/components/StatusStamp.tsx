import { ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatusStampProps {
  className?: string;
}

export function StatusStamp({ className }: StatusStampProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative h-[108px] w-[108px] shrink-0 md:h-[124px] md:w-[124px]', className)}
    >
      <svg viewBox="0 0 124 124" className="stamp-spin h-full w-full">
        <defs>
          <path
            id="status-stamp-path"
            d="M62,62 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
            fill="none"
          />
        </defs>
        <text
          fill="rgba(255,255,255,0.52)"
          fontSize="7.6"
          fontFamily="Geist Mono, ui-monospace, monospace"
          letterSpacing="1.4"
        >
          <textPath
            href="#status-stamp-path"
            textLength="286"
            lengthAdjust="spacingAndGlyphs"
          >
            AVAILABLE FOR WORK · CHENNAI / REMOTE · 2026 ·
          </textPath>
        </text>
      </svg>

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/35 bg-accent/[0.07]">
          <ArrowUpRight size={17} className="text-accent" />
        </span>
      </span>
    </div>
  );
}
