import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { RevisionLevel } from '../../types';
import { RotateCcw, CheckCircle2, FileText, ArrowRight, Sparkles, Filter, ExternalLink } from 'lucide-react';

interface RevisionViewProps {
  onOpenNotes: (videoId: string) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({ onOpenNotes }) => {
  const { 
    revisionQueue, 
    revisionPendingCount, 
    markVideoRevised, 
    topics, 
    videos 
  } = usePlacement();

  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | RevisionLevel>('ALL');

  const topicMap = new Map(topics.map(t => [t.id, t.title]));

  // Include videos that are in revision queue or have revision level tracked
  const revisionItems = videos.filter((v) => {
    if (selectedLevelFilter === 'ALL') {
      return v.status === 'REVISION' || (v.status === 'WATCHED' && v.revisionLevel !== 'MASTERED');
    }
    return v.revisionLevel === selectedLevelFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#f95721] font-bold tracking-[0.25em] uppercase">
              SPACED REPETITION PROTOCOL
            </span>
            <h2 className="font-sans text-3xl font-extrabold text-[#f4f3ef] tracking-tight mt-1">
              REVISION QUEUE
            </h2>
            <p className="font-mono text-xs text-[#797c8d] mt-1">
              Systematic retention reinforcement. Target 3 rounds before marking Mastered.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 rounded-xl bg-[#121318] border border-[#262832] text-center">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#797c8d] block">
                STATUS
              </span>
              <span className="font-mono text-xl font-bold text-[#f95721]">
                {revisionPendingCount} ITEMS PENDING
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Banner */}
        <div className="mt-4 p-3 rounded-xl bg-[#131418] border border-[#20222a] flex items-center justify-between font-mono text-xs text-[#9d9b93]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#f95721]" />
            <span>"THE TREE ISN’T GOING TO TRAVERSE ITSELF."</span>
          </div>
          <span className="text-[#646675] hidden sm:inline">ALGORITHM RETENTION: OPTIMAL</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#16171c] border border-[#262832]">
        <div className="flex items-center space-x-2 text-[#8c8a83] mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] uppercase tracking-wider">LEVEL FILTER:</span>
        </div>

        {(['ALL', 0, 1, 2, 3, 'MASTERED'] as const).map((lvl) => (
          <button
            key={String(lvl)}
            onClick={() => setSelectedLevelFilter(lvl)}
            className={`
              px-3 py-1 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer border
              ${
                selectedLevelFilter === lvl
                  ? 'bg-[#f95721] text-white border-[#f95721] font-semibold'
                  : 'bg-[#121318] text-[#8c8a83] border-[#22242e] hover:text-[#f4f3ef]'
              }
            `}
          >
            {lvl === 'ALL' ? 'ALL PENDING' : lvl === 'MASTERED' ? 'MASTERED' : `LEVEL ${lvl}`}
          </button>
        ))}
      </div>

      {/* Revision Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {revisionItems.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-[#16171c] border border-dashed border-[#262832]">
            <p className="font-mono text-sm text-[#8c8a83]">
              No revision transmissions pending for Level {String(selectedLevelFilter)}.
            </p>
          </div>
        ) : (
          revisionItems.map((item) => {
            const topicTitle = topicMap.get(item.topicId) || 'TOPIC';

            return (
              <div
                key={item.id}
                id={`revision-card-${item.id}`}
                className="p-5 rounded-2xl bg-[#16171c] border border-[#262832] hover:border-[#383a48] transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1e2029] text-[#f95721] border border-[#2b2e3b] font-semibold">
                      {item.subjectId.toUpperCase()} // {topicTitle}
                    </span>

                    {/* Small Circular Indicators */}
                    <div className="flex items-center space-x-1.5" title={`Revision Level: ${item.revisionLevel}`}>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#797c8d]">
                        LVL {item.revisionLevel === 'MASTERED' ? 'MAX' : item.revisionLevel}:
                      </span>
                      {[1, 2, 3].map((dotIndex) => {
                        const filled =
                          item.revisionLevel === 'MASTERED' ||
                          (typeof item.revisionLevel === 'number' && item.revisionLevel >= dotIndex);
                        return (
                          <span
                            key={dotIndex}
                            className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                              filled
                                ? 'bg-[#f95721] border-[#f95721] shadow-[0_0_6px_rgba(249,87,33,0.5)]'
                                : 'bg-transparent border-[#383a48]'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <h3 className="font-sans text-base font-bold text-[#f4f3ef] leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center space-x-3 text-[10px] font-mono text-[#797c8d] mt-2">
                    <span>LAST WATCHED: {item.watchedDate || '22 SEP 2026'}</span>
                    <span>●</span>
                    <span className="uppercase text-[#a09e96]">DIFF: {item.difficulty}</span>
                  </div>

                  {item.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#121318] border border-[#20222a] text-xs font-sans text-[#a7a59d]">
                      <span className="font-mono text-[9px] text-[#f95721] font-semibold mr-1 uppercase">
                        [{item.noteCategory || 'RECALL'}]:
                      </span>
                      {item.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#20222a]">
                  <button
                    onClick={() => onOpenNotes(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#14151a] hover:bg-[#1d1f27] text-[#d4d2cb] border border-[#252732] font-mono text-xs uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#8c8a83]" />
                    <span>REVIEW</span>
                  </button>

                  <button
                    onClick={() => markVideoRevised(item.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1f212a] hover:bg-[#f95721] text-[#f4f3ef] hover:text-white border border-[#303342] hover:border-[#f95721] font-mono text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-all cursor-pointer group"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#f95721] group-hover:text-white transition-colors" />
                    <span>MARK REVISED</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
