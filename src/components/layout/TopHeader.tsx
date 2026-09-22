import React from 'react';
import { Settings, Plus, Menu, X, Flame } from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';

interface TopHeaderProps {
  onOpenAddVideo: () => void;
  onOpenSettings: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenAddVideo,
  onOpenSettings,
  mobileOpen,
  setMobileOpen,
}) => {
  const { streak } = usePlacement();

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 w-full bg-[#101114]/90 backdrop-blur-md border-b border-[#1f2129] px-4 lg:px-8 py-3.5"
    >
      <div className="flex items-center justify-between">
        {/* Top-Left: Branding & Hierarchy */}
        <div className="flex items-center space-x-3">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[#8c8a83] hover:text-[#f4f3ef] hover:bg-[#191b22] rounded-lg transition-colors border border-[#262832]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-['Silkscreen'] text-sm sm:text-base font-bold tracking-wider text-[#f4f3ef] uppercase">
                PLACEMENT PROGRESS BAR
              </span>
              <span className="hidden sm:inline-block font-['Silkscreen'] text-[9px] px-1.5 py-0.5 rounded bg-[#1e2029] text-[#f95721] border border-[#2b2e3b]">
                CORE SDE
              </span>
            </div>
            <p className="font-['Silkscreen'] text-[9px] tracking-wider text-[#737580] uppercase mt-0.5">
              • ALL SYSTEMS OPERATIONAL
            </p>
          </div>
        </div>

        {/* Top-Right: System Telemetry & Quick Action */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Study Streak Chip */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#171820] border border-[#262833]">
            <Flame className="w-3.5 h-3.5 text-[#f95721]" />
            <span className="font-mono text-xs font-semibold text-[#f4f3ef]">
              {streak}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8c8a83]">
              DAYS
            </span>
          </div>

          {/* Live Date Indicator */}
          <div className="hidden md:flex flex-col items-end text-right">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-[10px] tracking-widest text-emerald-400 font-medium">
                SYSTEM ONLINE
              </span>
            </div>
            <span className="font-mono text-[10px] tracking-wider text-[#8c8a83]">
              23 SEP 2026
            </span>
          </div>

          {/* + LOG LECTURE Button */}
          <button
            id="header-add-video-btn"
            onClick={onOpenAddVideo}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#f95721] hover:bg-[#ff6836] text-white font-['Silkscreen'] text-[11px] uppercase tracking-wider font-bold transition-all duration-150 shadow-[0_0_12px_rgba(249,87,33,0.3)] hover:shadow-[0_0_16px_rgba(249,87,33,0.45)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">+ LOG LECTURE</span>
            <span className="xs:hidden">+ ADD</span>
          </button>

          {/* Understated Settings Icon */}
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            title="Settings & Data Management"
            className="p-2 rounded-lg text-[#8c8a83] hover:text-[#f4f3ef] hover:bg-[#181a22] border border-[#232530] transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
