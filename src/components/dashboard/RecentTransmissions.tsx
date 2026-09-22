import React from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { Radio, ArrowUpRight } from 'lucide-react';

export const RecentTransmissions: React.FC = () => {
  const { transmissions, setActiveTab } = usePlacement();

  return (
    <div
      id="recent-transmissions-card"
      className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex flex-col justify-between"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[#20222a] pb-3.5 mb-4">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-[#f95721] animate-pulse" />
            <h4 className="font-mono text-xs font-semibold tracking-[0.2em] text-[#f4f3ef] uppercase">
              RECENT TRANSMISSIONS
            </h4>
          </div>
          <span className="font-mono text-[9px] text-[#6b6e7d] uppercase tracking-wider">
            LOG SYNCED
          </span>
        </div>

        {/* Thin Vertical Timeline with Tiny Orange Indicators */}
        <div className="relative pl-4 space-y-4">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-[#242632]" />

          {transmissions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="relative group">
              {/* Tiny Orange Indicator Dot */}
              <div className="absolute -left-[13px] top-1.5 w-2 h-2 rounded-full bg-[#16171c] border-2 border-[#f95721] group-hover:bg-[#f95721] transition-colors" />

              <div className="flex flex-col space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-wider text-[#f95721] font-semibold">
                    {tx.date}
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#1c1e27] text-[#8c8a83] border border-[#262834]">
                    {tx.action}
                  </span>
                </div>

                <h5 className="font-sans text-xs font-medium text-[#f4f3ef] group-hover:text-[#f95721] transition-colors leading-snug">
                  {tx.videoTitle}
                </h5>

                <span className="font-mono text-[10px] text-[#717382] uppercase tracking-wider">
                  {tx.subjectCode} / {tx.topicTitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer link to full Watch Log */}
      <button
        onClick={() => setActiveTab('WATCH LOG')}
        className="mt-5 pt-3 border-t border-[#20222a] flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] hover:text-[#f95721] transition-colors cursor-pointer w-full text-left"
      >
        <span>OPEN FULL WATCH LOG</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
