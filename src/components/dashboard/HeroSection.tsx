import React from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { DottedProgressRing } from '../visualizations/DottedProgressRing';
import { Flame, CheckCircle2, Play, ArrowRight, Target, Sparkles, Plus, Layers } from 'lucide-react';

interface HeroSectionProps {
  onOpenAddSubject?: () => void;
  onOpenAddVideo?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAddSubject, onOpenAddVideo }) => {
  const { 
    subjects,
    overallProgress, 
    subjectStats, 
    streak, 
    videos, 
    markVideoWatched, 
    setActiveTab, 
    setSelectedSubjectId,
    setSelectedTopicId,
    loadTemplatePreset
  } = usePlacement();

  // Find next mission video
  const nextVideo = videos.find(v => v.status === 'UNWATCHED') || videos[0];
  const activeSubject = subjects.find(s => s.id === nextVideo?.subjectId);

  const handleResumeOrMarkNext = () => {
    if (nextVideo) {
      markVideoWatched(nextVideo.id);
    } else if (onOpenAddVideo) {
      onOpenAddVideo();
    }
  };

  const handleNavigateMission = () => {
    if (nextVideo) {
      setSelectedSubjectId(nextVideo.subjectId);
      setSelectedTopicId(nextVideo.topicId);
      setActiveTab('SUBJECT_DETAIL');
    }
  };

  return (
    <section id="placement-progress-hero" className="w-full">
      <div className="relative overflow-hidden rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_8px_30px_rgba(0,0,0,0.45)] p-6 lg:p-8">
        {/* Grid texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#f95721 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Top bar inside card */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#22242d] pb-4 mb-6 gap-3">
          <div className="flex items-center space-x-2.5">
            <Target className="w-4 h-4 text-[#f95721]" />
            <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#f4f3ef] uppercase">
              CENTER COMMAND // PLACEMENT PROGRESS
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#787a86]">
              {subjects.length > 0 ? `CURRICULUM: ${subjects.length} USER TRACKS` : 'NO TRACKS DEFINED'}
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#20222b] text-emerald-400 border border-[#2d303d] flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>RADAR SYNCHRONIZED</span>
            </span>
          </div>
        </div>

        {subjects.length === 0 ? (
          /* Empty / Initial Setup State */
          <div className="py-8 px-4 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1d1f28] border border-[#2b2e3c] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(249,87,33,0.15)]">
              <Layers className="w-7 h-7 text-[#f95721]" />
            </div>
            <div>
              <h3 className="font-sans text-xl font-bold text-[#f4f3ef]">
                Define Your Custom Preparation Tracks
              </h3>
              <p className="font-mono text-xs text-[#8c8a83] mt-1.5">
                Every candidate’s placement journey is unique. Define your custom subjects (such as DSA, Core CS, System Design, or Aptitude) with your own target topics and study resources.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onOpenAddSubject && (
                <button
                  onClick={onOpenAddSubject}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#f95721] hover:bg-[#ff6836] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_16px_rgba(249,87,33,0.35)] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ DEFINE FIRST SUBJECT TRACK</span>
                </button>
              )}

              <button
                onClick={loadTemplatePreset}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1c1e26] hover:bg-[#252834] text-[#8c8a83] hover:text-[#f4f3ef] font-mono text-xs uppercase tracking-wider border border-[#2c2f3d] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f95721]" />
                <span>LOAD STANDARD 4-CORE PRESET</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Cockpit Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual centerpiece: Dotted Progress Ring & Overall Preparation */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-[#121317]/80 border border-[#1e2027]">
              <DottedProgressRing percentage={overallProgress} size={230} totalSegments={52} />

              <div className="mt-4 text-center">
                <h3 className="font-mono text-xs font-semibold tracking-[0.25em] text-[#f4f3ef] uppercase">
                  OVERALL PREPARATION
                </h3>
                <p className="font-mono text-[10px] tracking-wider text-[#7e808c] mt-0.5">
                  CALCULATED ACROSS {subjects.length} CUSTOM CURRICULA
                </p>
              </div>
            </div>

            {/* Subject Breakdown: Dynamic list of user's subjects */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#8c8a83] uppercase">
                    DOMAIN BREAKDOWN
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-[#6a6c78]">
                    {subjects.length} MODULES ENGAGED
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {subjects.map((sub) => {
                    const stats = subjectStats[sub.id] || {
                      watched: 0,
                      total: sub.targetVideos || 25,
                      progressPercent: 0,
                    };

                    return (
                      <div 
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubjectId(sub.id);
                          setActiveTab('SUBJECT_DETAIL');
                        }}
                        className="group p-2.5 rounded-lg bg-[#191a22] border border-[#252733] hover:border-[#f95721]/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-xs font-medium text-[#f4f3ef] group-hover:text-[#f95721] transition-colors truncate">
                            {sub.name}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#f95721] shrink-0 ml-2">
                            {stats.progressPercent}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-[#121318] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: `${stats.progressPercent}%`,
                              backgroundColor: sub.color || '#f95721',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Study Streak Under Hero */}
              <div className="p-3 rounded-lg bg-[#191a22] border border-[#252733] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-[#f95721]" />
                  <span className="font-mono text-xs text-[#f4f3ef] font-semibold">
                    CURRENT STREAK
                  </span>
                </div>
                <span className="font-mono text-xs text-[#f95721] font-bold">
                  {streak} DAYS ACTIVE
                </span>
              </div>
            </div>

            {/* Right Column: Mission Control / Next Action */}
            <div className="lg:col-span-4 p-5 rounded-xl bg-[#14151a] border border-[#262832] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-1.5 text-[#f95721] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
                    ACTIVE SDE TARGET
                  </span>
                </div>

                {nextVideo ? (
                  <>
                    <h4 className="font-sans text-base font-bold text-[#f4f3ef] line-clamp-2">
                      {nextVideo.title}
                    </h4>
                    <p className="font-mono text-[11px] text-[#8c8a83] mt-1">
                      {activeSubject?.code || 'STUDY'} // {nextVideo.difficulty}
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="font-sans text-base font-bold text-[#f4f3ef]">
                      Ready for New Target
                    </h4>
                    <p className="font-mono text-[11px] text-[#8c8a83] mt-1">
                      Log your next lecture or problem to maintain your grind momentum.
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-[#202229]">
                {nextVideo ? (
                  <button
                    onClick={handleResumeOrMarkNext}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-[#f95721] hover:bg-[#ff6836] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_12px_rgba(249,87,33,0.3)] cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MARK AS WATCHED</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenAddVideo}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-[#f95721] hover:bg-[#ff6836] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_12px_rgba(249,87,33,0.3)] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ LOG NEW VIDEO</span>
                  </button>
                )}

                {nextVideo && (
                  <button
                    onClick={handleNavigateMission}
                    className="w-full flex items-center justify-center space-x-1 px-4 py-2 rounded-lg bg-[#1a1b22] hover:bg-[#20222b] text-[#8c8a83] hover:text-[#f4f3ef] font-mono text-[11px] uppercase tracking-wider border border-[#252834] transition-colors cursor-pointer"
                  >
                    <span>OPEN SUBJECT TOPIC</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
