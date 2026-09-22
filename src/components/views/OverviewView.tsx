import React, { useState } from 'react';
import { HeroSection } from '../dashboard/HeroSection';
import { CoreSubjectCards } from '../dashboard/CoreSubjectCards';
import { RecentTransmissions } from '../dashboard/RecentTransmissions';
import { HardwareReferenceGrid } from '../dashboard/HardwareReferenceGrid';
import { usePlacement } from '../../context/PlacementContext';
import { 
  RotateCcw, 
  Code2, 
  Clock, 
  Flame, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  Plus,
  LayoutGrid,
  ListTree
} from 'lucide-react';

interface OverviewViewProps {
  onOpenAddSubject?: () => void;
  onOpenAddVideo?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onOpenAddSubject, onOpenAddVideo }) => {
  const { 
    subjects,
    revisionQueue, 
    revisionPendingCount, 
    markVideoRevised, 
    setActiveTab, 
    problems, 
    problemsSolvedCount,
    problemsPendingCount,
    totalStudyHours,
    totalWatchedCount,
    streak 
  } = usePlacement();

  const [activeCockpitMode, setActiveCockpitMode] = useState<'REFERENCE' | 'CURRICULUM'>('REFERENCE');

  const easySolved = problems.filter(p => p.difficulty === 'EASY' && p.status === 'SOLVED').length;
  const medSolved = problems.filter(p => p.difficulty === 'MEDIUM' && p.status === 'SOLVED').length;
  const hardSolved = problems.filter(p => p.difficulty === 'HARD' && p.status === 'SOLVED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Cockpit Mode Selector matching technical hardware aesthetic */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-[#14151a] border border-[#22242e] shadow-inner max-w-md">
        <button
          onClick={() => setActiveCockpitMode('REFERENCE')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl font-['Silkscreen'] text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
            activeCockpitMode === 'REFERENCE'
              ? 'bg-[#1e2029] text-[#f95721] border border-[#2e313f] shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
              : 'text-[#8c8a83] hover:text-[#f4f3ef]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>COCKPIT GRID</span>
        </button>

        <button
          onClick={() => setActiveCockpitMode('CURRICULUM')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl font-['Silkscreen'] text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
            activeCockpitMode === 'CURRICULUM'
              ? 'bg-[#1e2029] text-[#f95721] border border-[#2e313f] shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
              : 'text-[#8c8a83] hover:text-[#f4f3ef]'
          }`}
        >
          <ListTree className="w-3.5 h-3.5" />
          <span>CURRICULUM</span>
        </button>
      </div>

      {/* Render selected view */}
      {activeCockpitMode === 'REFERENCE' ? (
        <HardwareReferenceGrid
          onOpenAddSubject={onOpenAddSubject}
          onOpenAddVideo={onOpenAddVideo}
        />
      ) : (
        <>
          {/* 1. Main Visual Centerpiece Hero */}
          <HeroSection onOpenAddSubject={onOpenAddSubject} onOpenAddVideo={onOpenAddVideo} />

          {/* 2. User-Defined Subject Cards */}
          <CoreSubjectCards onOpenAddSubject={onOpenAddSubject} />

          {/* 3. Asymmetric Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 cols): Revision Queue Spotlight + Problem Status */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Revision Queue Spotlight Card */}
          <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border-b border-[#20222a] pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-3.5 h-3.5 text-[#f95721]" />
                <h4 className="font-mono text-xs font-semibold tracking-[0.2em] text-[#f4f3ef] uppercase">
                  REVISION QUEUE
                </h4>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#20222b] text-[#f95721] border border-[#2e313f] font-bold">
                {revisionPendingCount} ITEMS PENDING
              </span>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-wider text-[#7e808e] mb-3">
              ACTIVE RETENTION CYCLES // INTERVAL SPACED REPETITION
            </p>

            {revisionQueue.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#131418] border border-[#20222a] text-center">
                <p className="font-mono text-xs text-[#787a89]">
                  No items currently pending revision. Log lectures or problems to feed your active retention pipeline.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {revisionQueue.slice(0, 3).map((video) => {
                  const sub = subjects.find(s => s.id === video.subjectId);
                  return (
                    <div
                      key={video.id}
                      className="p-3 rounded-xl bg-[#131418] border border-[#20222a] hover:border-[#2d303d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#f95721] font-semibold">
                            {sub?.name ? sub.name.toUpperCase().slice(0, 16) : video.subjectId.toUpperCase()}
                          </span>
                          <span className="font-mono text-[9px] text-[#5b5d6b]">●</span>
                          <span className="font-mono text-[9px] text-[#7a7c8a]">
                            LAST: {video.watchedDate || 'TODAY'}
                          </span>
                        </div>
                        <h5 className="font-sans text-xs font-semibold text-[#f4f3ef] line-clamp-1">
                          {video.title}
                        </h5>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <div className="flex items-center space-x-1 mr-2" title={`Revision Level: ${video.revisionLevel}`}>
                          {[1, 2, 3].map((lvl) => (
                            <span
                              key={lvl}
                              className={`w-2 h-2 rounded-full border ${
                                video.revisionLevel === 'MASTERED' || (typeof video.revisionLevel === 'number' && video.revisionLevel >= lvl)
                                  ? 'bg-[#f95721] border-[#f95721]'
                                  : 'bg-transparent border-[#383a48]'
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() => markVideoRevised(video.id)}
                          className="px-2.5 py-1 rounded bg-[#1c1e27] hover:bg-[#f95721] hover:text-white text-[#d4d2cb] border border-[#2d303e] hover:border-[#f95721] font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          MARK REVISED
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#20222a] flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#6d7080]">
                LEVEL 0 → 1 → 2 → 3 → MASTERED
              </span>
              <button
                onClick={() => setActiveTab('REVISION')}
                className="font-mono text-[10px] uppercase tracking-wider text-[#f95721] hover:text-[#ff7446] flex items-center space-x-1 cursor-pointer"
              >
                <span>EXPLORE ALL {revisionPendingCount} PENDING</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Problem Status Card */}
          <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border-b border-[#20222a] pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Code2 className="w-3.5 h-3.5 text-[#f95721]" />
                <h4 className="font-mono text-xs font-semibold tracking-[0.2em] text-[#f4f3ef] uppercase">
                  PROBLEM STATUS
                </h4>
              </div>
              <button
                onClick={() => setActiveTab('PROBLEMS')}
                className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] hover:text-[#f95721] flex items-center space-x-1 cursor-pointer"
              >
                <span>TRACKER</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#121318] border border-[#202229]">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7e8d] block">
                  SOLVED
                </span>
                <span className="font-mono text-lg font-bold text-emerald-400">
                  {problemsSolvedCount}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#121318] border border-[#202229]">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7e8d] block">
                  PENDING
                </span>
                <span className="font-mono text-lg font-bold text-[#e8a338]">
                  {problemsPendingCount}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#121318] border border-[#202229]">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7e8d] block">
                  EASY
                </span>
                <span className="font-mono text-lg font-semibold text-[#f4f3ef]">
                  {easySolved}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#121318] border border-[#202229]">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7e8d] block">
                  MEDIUM
                </span>
                <span className="font-mono text-lg font-semibold text-[#f4f3ef]">
                  {medSolved}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#121318] border border-[#202229]">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7e8d] block">
                  HARD
                </span>
                <span className="font-mono text-lg font-semibold text-[#f4f3ef]">
                  {hardSolved}
                </span>
              </div>
            </div>

            {/* Visual breakdown progress */}
            <div className="w-full bg-[#121318] h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-400 h-full"
                style={{ width: `${problemsSolvedCount > 0 ? (easySolved / problemsSolvedCount) * 100 : 0}%` }}
                title={`Easy: ${easySolved}`}
              />
              <div
                className="bg-[#e8a338] h-full"
                style={{ width: `${problemsSolvedCount > 0 ? (medSolved / problemsSolvedCount) * 100 : 0}%` }}
                title={`Medium: ${medSolved}`}
              />
              <div
                className="bg-[#f95721] h-full"
                style={{ width: `${problemsSolvedCount > 0 ? (hardSolved / problemsSolvedCount) * 100 : 0}%` }}
                title={`Hard: ${hardSolved}`}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#6e7182] mt-2">
              <span>EASY ({easySolved})</span>
              <span>MEDIUM ({medSolved})</span>
              <span>HARD ({hardSolved})</span>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Recent Transmissions + Tactical Telemetry HUD */}
        <div className="lg:col-span-5 space-y-6">
          <RecentTransmissions />

          {/* Quick HUD telemetry metrics */}
          <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border-b border-[#20222a] pb-3 mb-4">
              <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#f4f3ef] uppercase">
                TELEMETRY HUD
              </span>
              <span className="font-mono text-[9px] text-[#6b6e7d] uppercase tracking-wider">
                ACTIVE COCKPIT
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#121318] border border-[#1f2128]">
                <div className="flex items-center space-x-1.5 text-[#8c8a83] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#f95721]" />
                  <span className="font-mono text-[9px] uppercase tracking-wider">
                    STUDY HOURS
                  </span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="font-mono text-xl font-bold text-[#f4f3ef]">
                    {totalStudyHours}
                  </span>
                  <span className="font-mono text-xs text-[#757785]">HRS</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121318] border border-[#1f2128]">
                <div className="flex items-center space-x-1.5 text-[#8c8a83] mb-1">
                  <Flame className="w-3.5 h-3.5 text-[#f95721]" />
                  <span className="font-mono text-[9px] uppercase tracking-wider">
                    STREAK
                  </span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="font-mono text-xl font-bold text-[#f95721]">
                    {streak}
                  </span>
                  <span className="font-mono text-xs text-[#757785]">DAYS</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121318] border border-[#1f2128]">
                <div className="flex items-center space-x-1.5 text-[#8c8a83] mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-[9px] uppercase tracking-wider">
                    VIDEOS LOGGED
                  </span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="font-mono text-xl font-bold text-[#f4f3ef]">
                    {totalWatchedCount}
                  </span>
                  <span className="font-mono text-xs text-[#757785]">ACTUAL</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121318] border border-[#1f2128]">
                <div className="flex items-center space-x-1.5 text-[#8c8a83] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#f95721]" />
                  <span className="font-mono text-[9px] uppercase tracking-wider">
                    MODULES DEFINED
                  </span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="font-mono text-xl font-bold text-[#f4f3ef]">
                    {subjects.length}
                  </span>
                  <span className="font-mono text-xs text-emerald-400">TRACKS</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#20222a] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#696b7a]">TACTICAL STATUS:</span>
              <span className="text-[#f95721] font-semibold">NO ZERO DAYS. GRIND ENGAGED.</span>
            </div>
          </div>
        </div>

      </div>
        </>
      )}
    </div>
  );
};
