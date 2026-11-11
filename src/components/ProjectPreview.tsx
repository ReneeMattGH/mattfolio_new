import { Lock, ShieldCheck } from 'lucide-react';
import type { CSSProperties } from 'react';
import { projectImages } from '../data/projectImages';
import type { Project, PreviewKind } from '../types/content';
import { projectTone } from '../lib/tones';
import { cn } from '../lib/utils';

function Line({
  w = '100%',
  className,
}: {
  w?: string;
  className?: string;
}) {
  return (
    <span
      className={cn('block h-1 rounded-full bg-white/[0.11]', className)}
      style={{ width: w }}
    />
  );
}

function CodeLine({ indent = 0, widths }: { indent?: number; widths: number[] }) {
  return (
    <div className="flex h-[6px] items-center gap-1" style={{ paddingLeft: indent * 7 }}>
      {widths.map((width, index) => (
        <span
          key={index}
          className={cn(
            'rounded-full',
            index === 0 ? 'h-[3px] bg-accent/50' : 'h-[3px] bg-white/[0.12]',
          )}
          style={{ width: `${width}px` }}
        />
      ))}
    </div>
  );
}

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-line px-3">
      <span className="h-[5px] w-[5px] rounded-full bg-white/15" />
      <span className="h-[5px] w-[5px] rounded-full bg-white/15" />
      <span className="h-[5px] w-[5px] rounded-full bg-white/15" />
      <span className="ml-2 truncate font-mono text-[8px] tracking-[0.04em] text-faint">
        {url}
      </span>
      <span className="ml-auto font-mono text-[9px] text-faint">·</span>
    </div>
  );
}

function TerminalChrome({ label }: { label: string }) {
  return (
    <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-line px-3">
      <span className="h-[5px] w-[5px] rounded-full bg-white/15" />
      <span className="h-[5px] w-[5px] rounded-full bg-white/15" />
      <span className="h-[5px] w-[5px] rounded-full bg-white/15" />
      <span className="ml-2 truncate font-mono text-[8px] tracking-[0.04em] text-faint">
        {label}
      </span>
    </div>
  );
}

function ChartSvg({ prediction = true }: { prediction?: boolean }) {
  return (
    <svg viewBox="0 0 200 80" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      {[20, 40, 60].map((y) => (
        <line key={y} x1="0" x2="200" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      ))}
      {[40, 80, 120, 160].map((x) => (
        <line key={x} x1={x} x2={x} y1="0" y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      ))}
      <polyline
        points="0,62 14,56 28,60 42,46 56,50 70,38 84,42 98,30 112,36 126,24 140,30 154,20"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {prediction ? (
        <polyline
          points="154,20 168,24 182,16 198,18"
          fill="none"
          stroke="rgba(143,180,255,0.45)"
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />
      ) : null}
      <circle cx="154" cy="20" r="2" fill="var(--accent)" />
    </svg>
  );
}

function CandleSvg() {
  const candles = [
    [8, 30, 22, 18, 34],
    [24, 24, 30, 20, 34],
    [40, 29, 26, 22, 33],
    [56, 25, 20, 16, 28],
    [72, 19, 24, 15, 28],
    [88, 23, 17, 13, 26],
    [104, 17, 20, 12, 24],
    [120, 21, 15, 11, 23],
    [136, 15, 13, 8, 19],
    [152, 13, 18, 9, 21],
    [168, 18, 12, 8, 20],
    [184, 11, 9, 5, 15],
  ];

  return (
    <svg viewBox="0 0 200 80" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      {[20, 40, 60].map((y) => (
        <line key={y} x1="0" x2="200" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      ))}
      {candles.map(([x, open, close, high, low], index) => {
        const top = Math.min(open, close);
        const height = Math.max(2, Math.abs(close - open));
        const isLast = index === candles.length - 1;
        return (
          <g key={x} stroke={isLast ? 'var(--accent)' : 'rgba(255,255,255,0.28)'}>
            <line x1={x} x2={x} y1={high} y2={low} strokeWidth="0.8" />
            <rect
              x={x - 2}
              y={top}
              width="4"
              height={height}
              fill={isLast ? 'var(--accent)' : 'rgba(255,255,255,0.12)'}
              strokeWidth="0.5"
            />
          </g>
        );
      })}
      <polyline
        points="0,50 24,44 48,42 72,34 96,30 120,24 144,20 168,18 196,12"
        fill="none"
        stroke="rgba(143,180,255,0.55)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function GlobeSvg() {
  return (
    <svg viewBox="0 0 120 100" className="h-[85%] w-[85%]" aria-hidden="true">
      <g stroke="rgba(255,255,255,0.13)" fill="none" strokeWidth="0.6">
        <circle cx="60" cy="50" r="36" />
        <ellipse cx="60" cy="50" rx="36" ry="13" />
        <ellipse cx="60" cy="50" rx="22" ry="36" />
        <ellipse cx="60" cy="50" rx="10" ry="36" />
        <ellipse cx="60" cy="50" rx="36" ry="26" />
      </g>
      <g fill="var(--accent)">
        <circle cx="48" cy="36" r="1.5" />
        <circle cx="68" cy="44" r="1.2" />
        <circle cx="56" cy="58" r="1" />
      </g>
      <g stroke="rgba(143,180,255,0.35)" fill="none" strokeWidth="0.5">
        <path d="M48 36 C 56 28, 64 34, 68 44" />
        <path d="M68 44 C 64 52, 58 54, 56 58" />
      </g>
      <g fill="rgba(255,255,255,0.25)">
        <circle cx="38" cy="46" r="0.8" />
        <circle cx="76" cy="34" r="0.8" />
        <circle cx="72" cy="60" r="0.8" />
        <circle cx="50" cy="70" r="0.8" />
      </g>
    </svg>
  );
}

function Mockup({ kind }: { kind: PreviewKind }) {
  switch (kind) {
    case 'ide':
      return (
        <div className="grid h-full grid-cols-[1fr_66px] gap-2 sm:grid-cols-[46px_1fr_66px] md:grid-cols-[58px_1fr_76px]">
          <div className="hidden flex-col gap-2 border-r border-line pr-2 sm:flex">
            <div className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span className="font-mono text-[6px] tracking-[0.08em] text-faint">HAVX</span>
            </div>
            {['contracts', 'src', 'wallet', 'tests', 'deploy'].map((label, index) => (
              <div key={label} className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-[1px] bg-white/20" />
                <span
                  className={cn(
                    'font-mono text-[5.5px]',
                    index === 0 ? 'text-muted' : 'text-faint/70',
                  )}
                >
                  {label}
                </span>
              </div>
            ))}
            <span className="mt-auto h-1 w-2/3 rounded-full bg-white/[0.08]" />
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex items-center gap-2 border-b border-line pb-1.5 font-mono text-[5.5px] text-faint">
              <span className="border-b border-accent pb-1 text-ink">Vault.sol</span>
              <span>Wallet.tsx</span>
              <span className="ml-auto hidden sm:inline">Solidity</span>
            </div>
            <div className="flex flex-col gap-[3px]">
              <CodeLine widths={[16, 26, 12]} />
              <CodeLine widths={[10, 34]} />
              <CodeLine indent={1} widths={[14, 22, 18]} />
              <CodeLine indent={1} widths={[20, 12]} />
              <CodeLine indent={2} widths={[24, 16, 10]} />
              <CodeLine indent={2} widths={[12, 28]} />
              <CodeLine indent={1} widths={[9]} />
              <CodeLine widths={[9]} />
            </div>
            <div className="mt-auto flex items-center gap-1.5 rounded border border-line bg-white/[0.02] px-1.5 py-1">
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span className="font-mono text-[5px] text-faint">Compiled · no errors</span>
              <span className="ml-auto font-mono text-[5px] text-accent">Ready</span>
            </div>
          </div>

          <div className="hidden flex-col gap-2 rounded border border-line bg-white/[0.02] p-2 md:flex">
            <span className="font-mono text-[5.5px] uppercase tracking-[0.08em] text-faint">
              HAVXWallet
            </span>
            <span className="mt-1 block h-1 w-3/4 rounded-full bg-white/[0.12]" />
            <span className="block h-1 w-1/2 rounded-full bg-white/[0.08]" />
            <div className="mt-2 flex flex-col gap-1 border-t border-line pt-2">
              <span className="font-mono text-[5px] text-faint">Network</span>
              <span className="font-mono text-[6px] text-ink">Mainnet</span>
            </div>
            <button
              type="button"
              tabIndex={-1}
              className="mt-auto rounded-[2px] bg-accent py-1 text-center font-mono text-[6px] font-medium text-accent-ink"
            >
              Deploy
            </button>
          </div>
        </div>
      );

    case 'marketplace':
      return (
        <div className="flex h-full flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-5 flex-1 items-center gap-1.5 rounded-[3px] border border-line px-2">
              <span className="h-1.5 w-1.5 rounded-full border border-white/20" />
              <span className="h-1 w-1/3 rounded-full bg-white/[0.09]" />
            </div>
            <span className="rounded-[3px] bg-accent px-2 py-1.5 font-mono text-[5.5px] font-medium text-accent-ink">
              Publish
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {['Vision', 'Text', 'Audio', 'Code'].map((label, index) => (
              <div
                key={label}
                className="flex min-w-0 flex-col rounded-[3px] border border-line bg-white/[0.02] p-1.5"
              >
                <div className="flex h-7 items-end gap-[2px] rounded-[2px] bg-white/[0.035] p-1">
                  {[38, 62, 46, 74, 54].map((height, barIndex) => (
                    <span
                      key={barIndex}
                      className={cn(
                        'w-full rounded-t-[1px]',
                        index === 1 && barIndex === 3 ? 'bg-accent/60' : 'bg-white/10',
                      )}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <span className="mt-1.5 truncate font-mono text-[5.5px] text-muted">{label}</span>
                <span className="mt-1 font-mono text-[4.5px] text-faint">BNB Greenfield</span>
                <span className="mt-1.5 inline-flex w-fit rounded-[2px] border border-line px-1 font-mono text-[4.5px] text-faint">
                  On-chain
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-line pt-1.5 font-mono text-[5px] text-faint">
            <span>Datasets · 0x8f…4a</span>
            <span className="text-accent">Greenfield</span>
          </div>
        </div>
      );

    case 'vault':
      return (
        <div className="relative flex h-full items-center justify-center">
          <div className="absolute left-1 top-1 flex flex-col gap-1 sm:left-2 sm:top-2">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full border border-white/15" />
                <span
                  className="h-1 rounded-full bg-white/10"
                  style={{ width: `${34 + row * 9}px` }}
                />
              </div>
            ))}
          </div>
          <div className="flex w-full max-w-[190px] flex-col items-center rounded border border-line bg-white/[0.02] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/35 bg-accent/[0.06]">
              <Lock size={11} className="text-accent" />
            </div>
            <span className="mt-2 font-mono text-[5.5px] uppercase tracking-[0.08em] text-faint">
              Wallet-gated vault
            </span>
            <Line w="62%" className="mt-2" />
            <div className="mt-3 flex w-full flex-col gap-1.5">
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-between rounded-[2px] border border-line px-1.5 py-1"
                >
                  <span className="h-1 rounded-full bg-white/10" style={{ width: 42 + row * 8 }} />
                  <span className="flex gap-[2px]">
                    {[0, 1, 2, 3].map((dot) => (
                      <span key={dot} className="h-[2px] w-[2px] rounded-full bg-faint/60" />
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              tabIndex={-1}
              className="mt-3 w-full rounded-[2px] border border-line-strong py-1 font-mono text-[5.5px] text-ink"
            >
              Unlock with wallet
            </button>
          </div>
        </div>
      );

    case 'payroll':
      return (
        <div className="flex h-full flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              ['Payroll', 62],
              ['Converted', 44],
              ['Pending', 30],
            ].map(([label, width]) => (
              <div key={String(label)} className="rounded-[3px] border border-line bg-white/[0.02] p-1.5">
                <span className="font-mono text-[5px] uppercase tracking-[0.06em] text-faint">
                  {label}
                </span>
                <span className="mt-1.5 block h-1.5 w-4/5 rounded-full bg-white/[0.13]" />
                <span className="mt-1.5 block h-[3px] w-full rounded-full bg-white/[0.06]">
                  <span
                    className="block h-[3px] rounded-full bg-accent/60"
                    style={{ width: `${Number(width)}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-1 flex-col rounded-[3px] border border-line">
            <div className="flex items-center gap-2 border-b border-line px-2 py-1.5 font-mono text-[5px] uppercase tracking-[0.06em] text-faint">
              <span className="w-1/3">Recipient</span>
              <span className="w-1/4">USDT</span>
              <span className="w-1/4">INR</span>
              <span>Status</span>
            </div>
            {[0, 1, 2, 3].map((row) => (
              <div
                key={row}
                className="flex items-center gap-2 border-b border-line/60 px-2 py-1.5 last:border-b-0"
              >
                <span className="flex w-1/3 items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-1 w-10 rounded-full bg-white/[0.1]" />
                </span>
                <span className="h-1 w-1/4 rounded-full bg-white/[0.12]" />
                <span className="h-1 w-1/4 rounded-full bg-white/[0.08]" />
                <span className="rounded-[2px] border border-line px-1 font-mono text-[4.5px] text-faint">
                  {row === 0 ? 'Settled' : 'Queued'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'subscribe':
      return (
        <div className="mx-auto flex h-full w-full max-w-[280px] flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[6px] uppercase tracking-[0.08em] text-faint">
              Subscriptions
            </span>
            <span className="rounded-[2px] border border-line px-1.5 py-0.5 font-mono text-[5px] text-faint">
              Bitcoin L2
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {['Storage', 'Newsletter', 'API access'].map((label, index) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[3px] border border-line bg-white/[0.02] px-2 py-2"
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-[2px] bg-white/[0.07]" />
                  <span className="font-mono text-[5.5px] text-muted">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[5px] text-faint">Monthly</span>
                  <span
                    className={cn(
                      'relative h-2.5 w-4 rounded-full border',
                      index === 0 ? 'border-accent/40 bg-accent/20' : 'border-line bg-white/[0.05]',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-[1px] h-[6px] w-[6px] rounded-full',
                        index === 0 ? 'right-[1px] bg-accent' : 'left-[1px] bg-white/30',
                      )}
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-line pt-2">
            <span className="font-mono text-[5px] uppercase tracking-[0.06em] text-faint">
              Next billing
            </span>
            <span className="font-mono text-[6px] text-accent">Scheduled</span>
          </div>
        </div>
      );

    case 'invoice':
      return (
        <div className="grid h-full grid-cols-[1fr_38%] gap-2">
          <div className="flex flex-col rounded-[3px] border border-line bg-white/[0.02] p-2">
            <div className="flex items-center justify-between border-b border-line pb-1.5">
              <span className="font-mono text-[6px] text-ink">Invoice</span>
              <span className="rounded-[2px] border border-line px-1 font-mono text-[4.5px] text-faint">
                Tokenized
              </span>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              <Line w="70%" />
              <Line w="48%" />
              <Line w="62%" />
              <Line w="34%" />
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-line pt-2">
              <span className="font-mono text-[5px] text-faint">Due</span>
              <span className="h-1.5 w-10 rounded-full bg-white/[0.14]" />
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[3px] border border-accent/25 bg-accent/[0.04] p-2">
            <span className="font-mono text-[5px] uppercase tracking-[0.08em] text-faint">
              Advance
            </span>
            <span className="font-mono text-[13px] leading-none text-ink">—</span>
            <span className="font-mono text-[4.5px] text-faint">Settle on-chain</span>
            <button
              type="button"
              tabIndex={-1}
              className="rounded-[2px] bg-accent py-1 font-mono text-[5px] font-medium text-accent-ink"
            >
              Advance
            </button>
          </div>
        </div>
      );

    case 'lending':
      return (
        <div className="flex h-full flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Collateral', 64],
              ['Credit line', 42],
            ].map(([label, width]) => (
              <div key={String(label)} className="rounded-[3px] border border-line bg-white/[0.02] p-2">
                <span className="font-mono text-[5px] uppercase tracking-[0.06em] text-faint">
                  {label}
                </span>
                <span className="mt-2 block h-1.5 w-2/3 rounded-full bg-white/[0.13]" />
                <span className="mt-2 block h-[3px] w-full rounded-full bg-white/[0.06]">
                  <span
                    className="block h-[3px] rounded-full bg-accent/65"
                    style={{ width: `${Number(width)}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-1 flex-col rounded-[3px] border border-line">
            <div className="flex items-center gap-2 border-b border-line px-2 py-1.5 font-mono text-[5px] uppercase tracking-[0.06em] text-faint">
              <span className="w-1/3">Wallet</span>
              <span className="w-1/4">Health</span>
              <span className="ml-auto">Terms</span>
            </div>
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className="flex items-center gap-2 border-b border-line/60 px-2 py-2 last:border-b-0"
              >
                <span className="flex w-1/3 items-center gap-1">
                  <span className="h-2 w-2 rounded-full border border-white/15" />
                  <span className="h-1 w-10 rounded-full bg-white/10" />
                </span>
                <span className="w-1/4">
                  <span className="block h-[3px] w-full rounded-full bg-white/[0.06]">
                    <span
                      className="block h-[3px] rounded-full bg-accent/60"
                      style={{ width: `${72 - row * 16}%` }}
                    />
                  </span>
                </span>
                <span className="ml-auto font-mono text-[4.5px] text-faint">On-chain</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'assets':
      return (
        <div className="grid h-full grid-cols-2 gap-2">
          {['Riverside', 'Harbour', 'Midtown', 'Garden'].map((label, index) => (
            <div
              key={label}
              className="flex flex-col rounded-[3px] border border-line bg-white/[0.02] p-2"
            >
              <svg viewBox="0 0 60 28" className="h-6 w-full" aria-hidden="true">
                <path
                  d={
                    index % 2 === 0
                      ? 'M4 25V12h14v13M18 25V6h17v19M35 25V16h12v9M41 16v-5h6v5'
                      : 'M5 25V8h16v17M21 25V14h12v11M33 25V4h18v21M39 9h5M39 13h5'
                  }
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.8"
                  fill="none"
                />
              </svg>
              <span className="mt-1 font-mono text-[5.5px] text-muted">{label}</span>
              <span className="mt-1 font-mono text-[4.5px] text-faint">RWA · Fractional</span>
              <span className="mt-auto block pt-2">
                <span className="block h-[3px] w-full rounded-full bg-white/[0.06]">
                  <span
                    className={cn('block h-[3px] rounded-full', index === 0 ? 'bg-accent/60' : 'bg-white/20')}
                    style={{ width: `${58 - index * 11}%` }}
                  />
                </span>
              </span>
            </div>
          ))}
        </div>
      );

    case 'chart':
      return (
        <div className="flex h-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[6px] uppercase tracking-[0.06em] text-faint">
              Market outlook
            </span>
            <span className="rounded-[2px] bg-accent/[0.12] px-1.5 py-0.5 font-mono text-[5px] text-accent">
              AI bias
            </span>
          </div>
          <div className="relative flex-1 rounded-[3px] border border-line bg-white/[0.015] p-1">
            <ChartSvg />
            <span className="absolute right-2 top-2 h-1 w-6 rounded-full bg-accent/50" />
          </div>
          <div className="flex flex-wrap gap-1">
            {['Momentum', 'Volume', 'Structure'].map((label) => (
              <span
                key={label}
                className="rounded-[2px] border border-line px-1.5 py-0.5 font-mono text-[4.5px] text-faint"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      );

    case 'globe':
      return (
        <div className="grid h-full grid-cols-[1fr_36%] gap-2">
          <div className="flex items-center justify-center rounded-[3px] border border-line bg-white/[0.015]">
            <GlobeSvg />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[5.5px] uppercase tracking-[0.06em] text-faint">
              Trade flow
            </span>
            {[70, 48, 62, 36].map((width, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="h-[3px] w-1/2 rounded-full bg-white/[0.08]" />
                <span className="block h-1 w-full rounded-full bg-white/[0.05]">
                  <span
                    className={cn(
                      'block h-1 rounded-full',
                      index === 0 ? 'bg-accent/60' : 'bg-white/[0.16]',
                    )}
                    style={{ width: `${width}%` }}
                  />
                </span>
              </div>
            ))}
            <span className="mt-auto font-mono text-[4.5px] text-faint">Regional context</span>
          </div>
        </div>
      );

    case 'terminal':
      return (
        <div className="flex h-full flex-col gap-1 font-mono text-[6.5px] leading-[1.7]">
          <div className="text-muted">
            <span className="text-accent">$</span> zerohour scan
          </div>
          <div className="text-faint">› reading workspace</div>
          <div className="text-faint">› static analysis complete</div>
          <div className="text-faint">› checking dependencies</div>
          <div className="flex items-center gap-1 text-accent">
            › review suggested patch
            <span className="h-2 w-[3px] bg-accent" />
          </div>
          <div className="mt-auto flex flex-wrap gap-1 border-t border-line pt-2">
            {['src/api', 'src/lib', 'tests'].map((label) => (
              <span
                key={label}
                className="rounded-[2px] border border-line px-1 py-0.5 text-[4.5px] text-faint"
              >
                {label}
              </span>
            ))}
            <span className="ml-auto text-[4.5px] text-faint">AI review</span>
          </div>
        </div>
      );

    case 'health':
      return (
        <div className="grid h-full grid-cols-2 gap-2">
          <div className="flex flex-col rounded-[3px] border border-line bg-white/[0.02] p-2">
            <div className="flex items-center justify-between border-b border-line pb-1.5">
              <span className="font-mono text-[5.5px] text-muted">Patient</span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
            {[0, 1, 2].map((row) => (
              <div key={row} className="mt-1.5 flex flex-col gap-1 rounded-[2px] border border-line p-1.5">
                <Line w={`${70 - row * 12}%`} />
                <Line w="42%" className="opacity-60" />
              </div>
            ))}
          </div>
          <div className="flex flex-col rounded-[3px] border border-line bg-white/[0.02] p-2">
            <div className="flex items-center justify-between border-b border-line pb-1.5">
              <span className="font-mono text-[5.5px] text-muted">Doctor</span>
              <ShieldCheck size={8} className="text-accent" />
            </div>
            {[0, 1].map((row) => (
              <div key={row} className="mt-1.5 flex flex-col gap-1 rounded-[2px] border border-line p-1.5">
                <Line w="64%" />
                <Line w="36%" className="opacity-60" />
              </div>
            ))}
            <button
              type="button"
              tabIndex={-1}
              className="mt-auto rounded-[2px] border border-accent/40 bg-accent/[0.08] py-1 font-mono text-[5px] text-accent"
            >
              Access granted
            </button>
          </div>
        </div>
      );

    case 'trading':
      return (
        <div className="flex h-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[6px] uppercase tracking-[0.06em] text-faint">
              ATR · EMA strategy
            </span>
            <span className="rounded-[2px] border border-line px-1.5 py-0.5 font-mono text-[5px] text-faint">
              Alerts
            </span>
          </div>
          <div className="flex-1 rounded-[3px] border border-line bg-white/[0.015] p-1">
            <CandleSvg />
          </div>
          <div className="flex items-center justify-between border-t border-line pt-1.5 font-mono text-[4.8px] text-faint">
            <span>ATR 14</span>
            <span>EMA 21</span>
            <span className="text-accent">Signal watch</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function ProjectPreview({ project }: { project: Project }) {
  const terminal = project.preview === 'terminal';
  const image = project.image ?? projectImages[project.id];
  const tone = projectTone(project);
  const tint = {
    '--accent': tone,
    backgroundImage: `radial-gradient(420px circle at 86% -12%, ${tone}14, transparent 66%)`,
  } as CSSProperties;

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden rounded-[9px] border border-line bg-[#15171b]"
      style={tint}
    >
      {terminal ? (
        <TerminalChrome label="zerohour — zsh" />
      ) : (
        <BrowserChrome url={`${project.id}.matt`} />
      )}
      <div className="relative min-h-0 flex-1 overflow-hidden p-2.5 md:p-3">
        {image ? (
          <img
            src={image}
            alt={`${project.title} interface preview`}
            className="h-full w-full rounded-[4px] object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Mockup kind={project.preview} />
        )}
      </div>
    </div>
  );
}
