import React from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  Activity, 
  Clock, 
  Flame, 
  RotateCcw, 
  Code2, 
  CheckCircle2, 
  BarChart3, 
  Sparkles 
} from 'lucide-react';

export const TelemetryView: React.FC = () => {
  const { 
    totalWatchedCount, 
    totalStudyHours, 
    streak, 
    revisionPendingCount, 
    problemsSolvedCount,
    subjectStats,
    topicStats,
    overallProgress 
  } = usePlacement();

  // 7-day recent activity mock data grounded in realistic placement grind
  const weeklyData = [
    { day: 'WED', hours: 4.2, videos: 3, date: '17 SEP' },
    { day: 'THU', hours: 3.8, videos: 2, date: '18 SEP' },
    { day: 'FRI', hours: 5.5, videos: 4, date: '19 SEP' },
    { day: 'SAT', hours: 6.0, videos: 5, date: '20 SEP' },
    { day: 'SUN', hours: 4.5, videos: 3, date: '21 SEP' },
    { day: 'MON', hours: 5.0, videos: 4, date: '22 SEP' },
    { day: 'TUE', hours: 3.5, videos: 3, date: '23 SEP' },
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  const topTopics = topicStats.slice(0, 8);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#f95721] font-bold tracking-[0.25em] uppercase">
              FLIGHT DATA RECORDER
            </span>
            <h2 className="font-sans text-3xl font-extrabold text-[#f4f3ef] tracking-tight mt-1">
              PREPARATION TELEMETRY
            </h2>
            <p className="font-mono text-xs text-[#797c8d] mt-1">
              Engineered performance metrics. Minimalist dark instrumentation without visual bloat.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs text-[#a09e95] bg-[#121318] px-3 py-1.5 rounded-xl border border-[#20222a]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CALIBRATION: REAL-TIME</span>
          </div>
        </div>

        {/* 5 Core Required Telemetry Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t border-[#20222a]">
          {/* 1. Total Videos Watched */}
          <div className="p-4 rounded-xl bg-[#121318] border border-[#202229]">
            <div className="flex items-center space-x-1.5 text-[#8c8a83] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[9px] uppercase tracking-wider">
                TOTAL WATCHED
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-2xl font-bold text-[#f4f3ef]">
                {totalWatchedCount}
              </span>
              <span className="font-mono text-[10px] text-[#717382]">VIDEOS</span>
            </div>
          </div>

          {/* 2. Total Study Hours */}
          <div className="p-4 rounded-xl bg-[#121318] border border-[#202229]">
            <div className="flex items-center space-x-1.5 text-[#8c8a83] mb-1">
              <Clock className="w-3.5 h-3.5 text-[#f95721]" />
              <span className="font-mono text-[9px] uppercase tracking-wider">
                STUDY HOURS
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-2xl font-bold text-[#f4f3ef]">
                {totalStudyHours}
              </span>
              <span className="font-mono text-[10px] text-[#717382]">HRS</span>
            </div>
          </div>

          {/* 3. Current Streak */}
          <div className="p-4 rounded-xl bg-[#121318] border border-[#202229]">
            <div className="flex items-center space-x-1.5 text-[#8c8a83] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#f95721]" />
              <span className="font-mono text-[9px] uppercase tracking-wider">
                CURRENT STREAK
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-2xl font-bold text-[#f95721]">
                {streak}
              </span>
              <span className="font-mono text-[10px] text-[#717382]">DAYS</span>
            </div>
          </div>

          {/* 4. Revision Pending */}
          <div className="p-4 rounded-xl bg-[#121318] border border-[#202229]">
            <div className="flex items-center space-x-1.5 text-[#8c8a83] mb-1">
              <RotateCcw className="w-3.5 h-3.5 text-[#e8a338]" />
              <span className="font-mono text-[9px] uppercase tracking-wider">
                REVISION PENDING
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-2xl font-bold text-[#f4f3ef]">
                {revisionPendingCount}
              </span>
              <span className="font-mono text-[10px] text-[#717382]">ITEMS</span>
            </div>
          </div>

          {/* 5. Problems Solved */}
          <div className="p-4 rounded-xl bg-[#121318] border border-[#202229]">
            <div className="flex items-center space-x-1.5 text-[#8c8a83] mb-1">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[9px] uppercase tracking-wider">
                PROBLEMS SOLVED
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-2xl font-bold text-[#f4f3ef]">
                {problemsSolvedCount}
              </span>
              <span className="font-mono text-[10px] text-[#717382]">SOLVED</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Minimal Dark Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: WEEKLY ACTIVITY */}
        <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between border-b border-[#20222a] pb-3 mb-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8c8a83]">
                CHART 01 // TELEMETRY
              </span>
              <h3 className="font-sans text-base font-bold text-[#f4f3ef]">
                WEEKLY ACTIVITY
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#6a6c7c]">PAST 7 DAYS</span>
          </div>

          {/* Minimal Histogram in off-white, gray, and orange */}
          <div className="flex items-end justify-between h-44 pt-4 px-2">
            {weeklyData.map((d, i) => {
              const heightPercent = (d.hours / maxHours) * 100;
              const isToday = i === weeklyData.length - 1;

              return (
                <div key={d.day} className="flex flex-col items-center flex-1 space-y-2 group">
                  <span className="font-mono text-[9px] text-[#787a89] group-hover:text-[#f4f3ef] transition-colors">
                    {d.hours}h
                  </span>

                  <div className="w-7 sm:w-10 bg-[#1c1d25] rounded-t-sm h-32 flex items-end justify-center overflow-hidden p-0.5">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        isToday
                          ? 'bg-[#f95721] shadow-[0_0_10px_rgba(249,87,33,0.5)]'
                          : 'bg-[#505260] group-hover:bg-[#858797]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className={`font-mono text-[10px] font-semibold ${isToday ? 'text-[#f95721]' : 'text-[#8c8a83]'}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#20222a] flex items-center justify-between font-mono text-[10px] text-[#717382]">
            <span>AVG STUDY PACE: 4.6 HRS/DAY</span>
            <span className="text-emerald-400 font-semibold">100% STREAK RETENTION</span>
          </div>
        </div>

        {/* Chart 2: SUBJECT DISTRIBUTION */}
        <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between border-b border-[#20222a] pb-3 mb-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8c8a83]">
                CHART 02 // DOMAIN COVERAGE
              </span>
              <h3 className="font-sans text-base font-bold text-[#f4f3ef]">
                SUBJECT DISTRIBUTION
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#6a6c7c]">{Object.keys(subjectStats).length} DOMAINS</span>
          </div>

          <div className="space-y-4 pt-1">
            {Object.values(subjectStats).map((stats) => (
              <div key={stats.id} className="space-y-1.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[#f4f3ef] font-medium">{stats.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#787a89] text-[10px]">{stats.watched}/{stats.total}</span>
                    <span className="text-[#f95721] font-bold">{stats.progressPercent}%</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-[#20222b] rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#f95721] h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.progressPercent}%`, backgroundColor: stats.color || '#f95721' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-3 border-t border-[#20222a] flex items-center justify-between font-mono text-[10px] text-[#717382]">
            <span>OVERALL WEIGHTED PREP: {overallProgress}%</span>
            <span className="text-[#f4f3ef]">PLACEMENT TARGET READY</span>
          </div>
        </div>

        {/* Chart 3: TOPIC PROGRESS (DSA High-Yield Topics) */}
        <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between border-b border-[#20222a] pb-3 mb-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8c8a83]">
                CHART 03 // HIGH YIELD MODULES
              </span>
              <h3 className="font-sans text-base font-bold text-[#f4f3ef]">
                TOPIC PROGRESS
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#6a6c7c]">DSA FOCUS</span>
          </div>

          <div className="space-y-3">
            {topTopics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between gap-3 text-xs font-mono">
                <span className="text-[#717382] w-6 shrink-0">{topic.number}</span>
                <span className="text-[#e2e0d8] flex-1 truncate font-medium">{topic.title}</span>
                <div className="w-32 h-1.5 bg-[#20222b] rounded-full overflow-hidden shrink-0">
                  <div
                    className="bg-[#f95721] h-full rounded-full"
                    style={{ width: `${topic.progressPercent}%` }}
                  />
                </div>
                <span className="text-[#f4f3ef] font-semibold w-10 text-right">{topic.progressPercent}%</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#20222a] font-mono text-[10px] text-[#717382] text-right">
            <span>CORE SDE CURRICULUM</span>
          </div>
        </div>

        {/* Chart 4: WATCH HISTORY (Density Grid) */}
        <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#20222a] pb-3 mb-5">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8c8a83]">
                  CHART 04 // REPETITION CADENCE
                </span>
                <h3 className="font-sans text-base font-bold text-[#f4f3ef]">
                  WATCH HISTORY & CADENCE
                </h3>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 font-semibold">ONLINE</span>
            </div>

            <p className="font-mono text-xs text-[#8c8a83] mb-4 leading-relaxed">
              30-day continuous activity matrix. Dense dot blocks represent active sessions with verified lecture completions.
            </p>

            {/* 30-day minimal dot matrix */}
            <div className="grid grid-cols-10 gap-2 p-4 rounded-xl bg-[#121318] border border-[#20222a]">
              {Array.from({ length: 30 }).map((_, idx) => {
                const isActive = idx < 24; // last 24 days active
                const isHeavy = idx === 23 || idx === 22 || idx === 21 || idx === 18 || idx === 15;

                return (
                  <div
                    key={idx}
                    title={`Day -${30 - idx}`}
                    className={`h-4 rounded-sm transition-all ${
                      isHeavy
                        ? 'bg-[#f95721] shadow-[0_0_6px_rgba(249,87,33,0.5)]'
                        : isActive
                        ? 'bg-[#525463]'
                        : 'bg-[#1e2029]'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#20222a] flex items-center justify-between font-mono text-[10px] text-[#8c8a83]">
            <span>TACTICAL EASTER EGG:</span>
            <span className="text-[#f95721] font-medium">"LESS SCROLLING. MORE SOLVING."</span>
          </div>
        </div>

      </div>
    </div>
  );
};
