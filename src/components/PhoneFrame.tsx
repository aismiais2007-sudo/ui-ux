import type { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  bottomIndicatorBg?: string;
}

export function PhoneFrame({
  children,
  bottomIndicatorBg = 'bg-white/95',
}: PhoneFrameProps) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] sm:bg-[#EAE3D7] sm:py-6 sm:px-4 sm:flex sm:items-center sm:justify-center">
      {/* Subtle metallic titanium outer ring on desktop (>= 640px) */}
      <div className="w-full min-h-screen sm:min-h-0 sm:w-auto sm:p-[2px] sm:rounded-[50px] sm:bg-gradient-to-b sm:from-zinc-400/80 sm:via-zinc-600/70 sm:to-zinc-500/80 sm:shadow-2xl">
        {/* Dark titanium/black iPhone 15 Pro bezel on desktop (>= 640px), invisible on mobile (< 640px) */}
        <div className="w-full min-h-screen sm:min-h-0 sm:border-[10px] sm:border-slate-900 sm:rounded-[48px] sm:shadow-2xl sm:bg-[#FAF7F2] sm:overflow-hidden">
          {/* 390px app viewport container */}
          <div className="w-full min-h-screen sm:min-h-0 sm:w-[390px] sm:h-[820px] sm:max-h-[calc(100vh-4rem)] flex flex-col bg-[#FAF7F2] relative overflow-x-hidden">
            {/* Realistic iOS Status Bar (hidden on real mobile < 640px) */}
            <div
              aria-hidden="true"
              className="hidden sm:flex items-center justify-between px-6 pt-2.5 pb-2 bg-[#FAF7F2] shrink-0 select-none z-40"
            >
              <span className="w-12 text-[13px] font-semibold tracking-tight text-[#241D18] tabular-nums">
                09:41
              </span>

              {/* Dynamic Island pill notch */}
              <div className="w-[114px] h-[28px] rounded-full bg-black flex items-center justify-end pr-2.5 shadow-inner">
                <span className="w-2.5 h-2.5 rounded-full bg-[#111827] ring-1 ring-white/10" />
              </div>

              {/* Signal, Wi-Fi, Battery icons */}
              <div className="w-12 flex items-center justify-end gap-1.5 text-[#241D18]">
                <svg className="w-3.5 h-3" viewBox="0 0 16 12" fill="currentColor">
                  <rect x="0" y="8" width="2.5" height="4" rx="0.7" />
                  <rect x="4" y="5.5" width="2.5" height="6.5" rx="0.7" />
                  <rect x="8" y="3" width="2.5" height="9" rx="0.7" />
                  <rect x="12" y="0" width="2.5" height="12" rx="0.7" />
                </svg>
                <svg className="w-3.5 h-3" viewBox="0 0 16 12" fill="currentColor">
                  <path d="M8 9.6a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Zm-3.6-2a5.2 5.2 0 0 1 7.2 0 .8.8 0 0 1-1.1 1.15 3.6 3.6 0 0 0-5 0 .8.8 0 1 1-1.1-1.15Zm-2.6-2.7a8.8 8.8 0 0 1 12.4 0 .8.8 0 0 1-1.12 1.14 7.2 7.2 0 0 0-10.16 0A.8.8 0 1 1 1.8 4.9Z" />
                </svg>
                <svg className="w-5 h-3" viewBox="0 0 24 12" fill="none">
                  <rect
                    x="0.75"
                    y="1"
                    width="19.5"
                    height="10"
                    rx="2.6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <rect x="2.5" y="2.75" width="15" height="6.5" rx="1.2" fill="currentColor" />
                  <path
                    d="M21.8 4.2v3.6a1.4 1.4 0 0 0 0-3.6Z"
                    fill="currentColor"
                    opacity="0.7"
                  />
                </svg>
              </div>
            </div>

            {/* App Screen Content */}
            <div className="flex-1 flex flex-col min-h-0">{children}</div>

            {/* Subtle iOS Home Indicator bar (hidden on real mobile < 640px) */}
            <div
              aria-hidden="true"
              className={`hidden sm:flex items-center justify-center pt-1.5 pb-2 shrink-0 ${bottomIndicatorBg}`}
            >
              <div className="w-32 h-[5px] rounded-full bg-[#241D18]/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
