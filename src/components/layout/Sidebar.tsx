import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { ActiveTab, SubjectId } from '../../types';
import { 
  LayoutDashboard, 
  RotateCcw, 
  Video as VideoIcon, 
  Code2, 
  FileText, 
  Activity,
  ChevronRight,
  Plus,
  Layers,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  onOpenAddSubject?: () => void;
}

const EASTER_EGGS = [
  'NO ZERO DAYS.',
  'CURRENT STATUS: COOKING.',
  'ONE MORE VIDEO.',
  'SKILL TREE EXPANDING.',
  'PROGRESS DETECTED.',
  'LESS SCROLLING. MORE SOLVING.',
  'THE TREE ISN’T GOING TO TRAVERSE ITSELF.',
  'COMPILE. DEBUG. REPEAT.'
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  mobileOpen = false, 
  setMobileOpen,
  onOpenAddSubject
}) => {
  const { 
    subjects,
    subjectStats,
    activeTab, 
    setActiveTab, 
    selectedSubjectId,
    setSelectedSubjectId,
    revisionPendingCount,
    problemsPendingCount,
    videos
  } = usePlacement();

  const [easterEggIndex, setEasterEggIndex] = useState(0);

  const cycleEasterEgg = () => {
    setEasterEggIndex((prev) => (prev + 1) % EASTER_EGGS.length);
  };

  const handleSelectSubject = (id: SubjectId) => {
    setSelectedSubjectId(id);
    setActiveTab('SUBJECT_DETAIL');
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleToolNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSelectedSubjectId(null);
    if (setMobileOpen) setMobileOpen(false);
  };

  const watchedVideosCount = videos.filter(v => v.status === 'WATCHED' || v.status === 'MASTERED').length;

  return (
    <aside
      id="sidebar-navigation"
      className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#14151a] border-r border-[#22242c]
        flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Brand & Identity */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f95721] shadow-[0_0_8px_rgba(249,87,33,0.6)]" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#8c8a83] uppercase">
              COCKPIT // v2.0
            </span>
          </div>
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#1e2028] text-[#8c8a83] border border-[#2b2d38]">
            SDE-26
          </span>
        </div>

        <div 
          className="space-y-0.5 cursor-pointer group" 
          onClick={() => { setActiveTab('OVERVIEW'); setSelectedSubjectId(null); }}
        >
          <h1 className="font-['Silkscreen'] text-xs tracking-wider text-[#8c8a83] group-hover:text-[#f95721] transition-colors uppercase">
            PLACEMENT
          </h1>
          <h2 className="font-['Silkscreen'] text-lg font-bold tracking-tight text-[#f4f3ef] leading-tight">
            PROGRESS BAR
          </h2>
        </div>

        <div className="mt-3 pt-3 border-t border-[#1f2129]">
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#686973] leading-relaxed">
            TRACK THE GRIND. BUILD THE SKILL. GET PLACED.
          </p>
          <div className="mt-2 flex items-center space-x-1.5 text-[10px] font-['Silkscreen'] text-[#8c8a83]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f95721] animate-pulse" />
            <span className="text-[9px] text-[#8c8a83]">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* 1. Overview item */}
        <div>
          <button
            id="nav-btn-overview"
            onClick={() => handleToolNav('OVERVIEW')}
            className={`
              w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-left
              transition-all duration-150 border
              ${
                activeTab === 'OVERVIEW'
                  ? 'bg-[#1c1e26] text-[#f4f3ef] border-[#f95721]/30 shadow-[inset_2px_0_0_0_#f95721]'
                  : 'text-[#8c8a83] border-transparent hover:bg-[#181920] hover:text-[#d4d2cc]'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <span
                className={`font-mono text-[10px] tracking-wider transition-colors ${
                  activeTab === 'OVERVIEW' ? 'text-[#f95721] font-semibold' : 'text-[#4c4e5c] group-hover:text-[#6e7182]'
                }`}
              >
                00
              </span>
              <LayoutDashboard
                className={`w-4 h-4 transition-colors ${
                  activeTab === 'OVERVIEW' ? 'text-[#f95721]' : 'text-[#696b79] group-hover:text-[#a0a2b0]'
                }`}
              />
              <span className="font-mono text-xs tracking-wider uppercase">
                OVERVIEW
              </span>
            </div>
            <ChevronRight
              className={`w-3 h-3 transition-transform ${
                activeTab === 'OVERVIEW' ? 'text-[#f95721] translate-x-0.5' : 'text-[#343644] opacity-0 group-hover:opacity-100'
              }`}
            />
          </button>
        </div>

        {/* 2. User-Defined Subject Modules Section */}
        <div>
          <div className="px-3 pb-1 flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#555763]">
              SUBJECT TRACKS // {subjects.length}
            </span>
            {onOpenAddSubject && (
              <button
                onClick={onOpenAddSubject}
                title="Define New Subject"
                className="text-[#f95721] hover:text-[#ff7446] font-mono text-[10px] flex items-center space-x-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>ADD</span>
              </button>
            )}
          </div>

          <div className="space-y-1 mt-1">
            {subjects.length === 0 ? (
              <div 
                onClick={onOpenAddSubject}
                className="p-3 rounded-lg bg-[#181922] border border-dashed border-[#292b3a] hover:border-[#f95721]/60 text-center cursor-pointer transition-colors"
              >
                <span className="font-mono text-[10px] text-[#f95721] uppercase tracking-wider block font-semibold">
                  + DEFINE FIRST SUBJECT
                </span>
                <span className="font-mono text-[9px] text-[#6e7080] block mt-0.5">
                  e.g. DSA, OOPS, Core CS
                </span>
              </div>
            ) : (
              subjects.map((sub, index) => {
                const isActive = activeTab === 'SUBJECT_DETAIL' && selectedSubjectId === sub.id;
                const stats = subjectStats[sub.id];
                const codeNum = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

                return (
                  <button
                    key={sub.id}
                    id={`nav-subject-${sub.id}`}
                    onClick={() => handleSelectSubject(sub.id)}
                    className={`
                      w-full group flex items-center justify-between px-3 py-2 rounded-lg text-left
                      transition-all duration-150 border
                      ${
                        isActive
                          ? 'bg-[#1c1e26] text-[#f4f3ef] border-[#f95721]/30 shadow-[inset_2px_0_0_0_#f95721]'
                          : 'text-[#8c8a83] border-transparent hover:bg-[#181920] hover:text-[#d4d2cc]'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                      <span
                        className={`font-mono text-[10px] tracking-wider shrink-0 ${
                          isActive ? 'text-[#f95721] font-semibold' : 'text-[#4c4e5c]'
                        }`}
                      >
                        {codeNum}
                      </span>
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: sub.color || '#f95721' }}
                      />
                      <span className="font-mono text-xs tracking-wider uppercase truncate">
                        {sub.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {stats && (
                        <span
                          className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-[#f95721] text-white font-semibold'
                              : 'bg-[#1f2129] text-[#787a8a]'
                          }`}
                        >
                          {stats.progressPercent}%
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3 h-3 transition-transform ${
                          isActive ? 'text-[#f95721] translate-x-0.5' : 'text-[#343644] opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* 3. Placement Tools Section */}
        <div>
          <div className="px-3 pb-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#555763]">
              PREPARATION TOOLS
            </span>
          </div>

          <div className="space-y-1 mt-1">
            {[
              { id: 'REVISION' as ActiveTab, label: 'REVISION', icon: RotateCcw, badge: revisionPendingCount },
              { id: 'WATCH LOG' as ActiveTab, label: 'WATCH LOG', icon: VideoIcon, badge: watchedVideosCount },
              { id: 'PROBLEMS' as ActiveTab, label: 'PROBLEMS', icon: Code2, badge: problemsPendingCount },
              { id: 'NOTES' as ActiveTab, label: 'NOTES', icon: FileText },
              { id: 'TELEMETRY' as ActiveTab, label: 'TELEMETRY', icon: Activity },
            ].map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleToolNav(item.id)}
                  className={`
                    w-full group flex items-center justify-between px-3 py-2 rounded-lg text-left
                    transition-all duration-150 border
                    ${
                      isActive
                        ? 'bg-[#1c1e26] text-[#f4f3ef] border-[#f95721]/30 shadow-[inset_2px_0_0_0_#f95721]'
                        : 'text-[#8c8a83] border-transparent hover:bg-[#181920] hover:text-[#d4d2cc]'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#f95721]' : 'text-[#696b79] group-hover:text-[#a0a2b0]'
                      }`}
                    />
                    <span className="font-mono text-xs tracking-wider uppercase">
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {item.badge !== undefined && (
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-[#f95721] text-white font-semibold'
                            : 'bg-[#1f2129] text-[#8c8a83] group-hover:text-[#d4d2cc]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-3 h-3 transition-transform ${
                        isActive ? 'text-[#f95721] translate-x-0.5' : 'text-[#343644] opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sassy Microcopy Easter Egg & Telemetry Status Footer */}
      <div className="p-4 border-t border-[#1f2129] bg-[#121318]">
        <button
          onClick={cycleEasterEgg}
          title="Click to cycle motivational microcopy"
          className="w-full text-left p-2.5 rounded bg-[#171920] border border-[#232530] hover:border-[#323544] transition-colors mb-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#f95721]">
              TACTICAL INTEL //
            </span>
            <span className="font-mono text-[8px] text-[#555765] group-hover:text-[#8c8a83]">
              CLICK
            </span>
          </div>
          <p className="font-mono text-[10px] text-[#d4d2cb] font-medium leading-tight">
            "{EASTER_EGGS[easterEggIndex]}"
          </p>
        </button>

        <div className="flex items-center justify-between px-1 text-[11px] font-mono text-[#8c8a83]">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] tracking-widest text-emerald-400 font-medium">
              SYSTEM ONLINE
            </span>
          </div>
          <span className="text-[10px] text-[#5a5c6a]">
            v2.0
          </span>
        </div>
      </div>
    </aside>
  );
};
