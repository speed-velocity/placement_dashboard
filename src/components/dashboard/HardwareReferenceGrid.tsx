import React, { useState, useEffect, useRef } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Lock, 
  Unlock, 
  Check, 
  Smile, 
  Plus, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface HardwareReferenceGridProps {
  onOpenAddSubject?: () => void;
  onOpenAddVideo?: () => void;
}

export const HardwareReferenceGrid: React.FC<HardwareReferenceGridProps> = ({
  onOpenAddSubject,
  onOpenAddVideo,
}) => {
  const { 
    subjects, 
    subjectStats,
    topics,
    problems,
    overallProgress, 
    totalWatchedCount, 
    totalStudyHours, 
    streak, 
    problemsSolvedCount,
    revisionPendingCount,
    setActiveTab,
    setSelectedSubjectId
  } = usePlacement();

  // Focus soundscape audio player
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const tracks = ['DEEP FOCUS // 40Hz BINAURAL', 'WHITE NOISE // MONSOON CADENCE', 'SYNTHWAVE // SDE GRIND'];

  const toggleFocusAudio = () => {
    if (isPlayingAudio) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 0.3;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.15;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        setIsPlayingAudio(true);
      } catch (e) {
        console.warn('Audio play restricted:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Card 08: DSA Pattern Recall
  const dsaPatterns = [
    { name: 'BFS', full: 'B F S', blankIndex: 1, hint: 'Level-order queue traversal' },
    { name: 'DP', full: 'D P', blankIndex: 0, hint: 'Optimal substructure & memoization' },
    { name: 'TREE', full: 'T R E E', blankIndex: 1, hint: 'Binary search tree invariants' },
    { name: 'HEAP', full: 'H E A P', blankIndex: 2, hint: 'Priority queue for top-K elements' },
    { name: 'HASH', full: 'H A S H', blankIndex: 2, hint: 'O(1) average lookup table' },
  ];
  const [patternIdx, setPatternIdx] = useState(0);
  const [patternSolved, setPatternSolved] = useState(true);
  const [score, setScore] = useState(720);
  const [patternStreak, setPatternStreak] = useState(12);

  const handleGuess = (letter: string) => {
    const cur = dsaPatterns[patternIdx];
    if (letter === cur.name[cur.blankIndex]) {
      setPatternSolved(true);
      setScore((s) => s + 50);
      setPatternStreak((st) => st + 1);
    }
  };

  const nextPattern = () => {
    setPatternIdx((i) => (i + 1) % dsaPatterns.length);
    setPatternSolved(false);
  };

  // Card 11: Algo Arena
  const [laserFired, setLaserFired] = useState(false);
  const [gameScore, setGameScore] = useState(8920);
  const fireLaser = () => {
    setLaserFired(true);
    setGameScore((s) => s + 100);
    setTimeout(() => setLaserFired(false), 260);
  };

  // Candidate status waveform
  const [waveStep, setWaveStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setWaveStep((w) => (w + 1) % 6), 400);
    return () => clearInterval(timer);
  }, []);

  const [sprintLocked, setSprintLocked] = useState(false);

  return (
    <div className="w-full relative pb-16">
      {/* Editorial Header in Dot-Matrix Typography */}
      <div className="mb-8 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-['Silkscreen'] text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#f4f3ef] uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] leading-tight">
              PLACEMENT
            </h1>
            <h2 className="font-['Silkscreen'] text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#f4f3ef] uppercase opacity-95 leading-tight">
              PROGRESS BAR
            </h2>
            
            <div className="mt-2.5 flex items-center space-x-2 text-xs font-['Silkscreen'] text-[#8e8d89]">
              <span className="w-2 h-2 rounded-full bg-[#f95721] animate-pulse"></span>
              <span className="text-[#f95721]">•</span>
              <span>All tracks active // Candidate grind nominal</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onOpenAddVideo && (
              <button
                onClick={onOpenAddVideo}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#f95721] hover:bg-[#ff6836] text-white font-['Silkscreen'] text-[11px] uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(249,87,33,0.35)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ LOG LECTURE</span>
              </button>
            )}

            {onOpenAddSubject && (
              <button
                onClick={onOpenAddSubject}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1c1d24] hover:bg-[#252733] border border-[#2e313f] text-[#f4f3ef] font-['Silkscreen'] text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>+ DEFINE SUBJECT</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 12-Card Modular Placement Cockpit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 01: CANDIDATE STATUS */}
        <div 
          onClick={() => setActiveTab('OVERVIEW')} 
          className="hardware-card p-6 flex flex-col justify-between min-h-[360px] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>01 CANDIDATE STATUS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>

            <h3 className="font-['Silkscreen'] text-2xl text-[#f4f3ef] tracking-wider mb-6">
              GRINDING...
            </h3>

            {/* Dot-matrix Coder Head */}
            <div className="flex justify-center my-3">
              <svg width="120" height="90" viewBox="0 0 120 90">
                {Array.from({ length: 28 }).map((_, i) => {
                  const angle = (i / 28) * Math.PI * 2;
                  const cx = 60 + Math.cos(angle) * 36;
                  const cy = 45 + Math.sin(angle) * 36;
                  return <circle key={`head_${i}`} cx={cx} cy={cy} r="1.8" fill="#e5e5e7" />;
                })}
                <circle cx="48" cy="42" r="3.2" fill="#ff3b30" className="animate-pulse" />
                <circle cx="72" cy="42" r="3.2" fill="#ff3b30" className="animate-pulse" />
                <circle cx="50" cy="58" r="1.6" fill="#8c8b94" />
                <circle cx="55" cy="59" r="1.6" fill="#8c8b94" />
                <circle cx="60" cy="59" r="1.6" fill="#8c8b94" />
                <circle cx="65" cy="59" r="1.6" fill="#8c8b94" />
                <circle cx="70" cy="58" r="1.6" fill="#8c8b94" />
              </svg>
            </div>

            {/* Study focus waveform */}
            <div className="flex items-center justify-center space-x-1.5 h-10 px-2">
              {[4, 8, 12, 18, 24, 16, 28, 20, 14, 22, 10, 6, 16, 26, 18, 8, 12, 6, 14, 4].map((h, idx) => {
                const modHeight = ((h + waveStep * 4) % 28) + 4;
                const isCenter = idx >= 8 && idx <= 12;
                return (
                  <div key={idx} className="flex flex-col items-center justify-center space-y-1">
                    {Array.from({ length: Math.ceil(modHeight / 6) }).map((_, dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`w-1 h-1 rounded-full ${isCenter ? 'bg-[#ff3b30]' : 'bg-[#e5e5e7]'}`}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#23252e] grid grid-cols-3 text-center font-['Silkscreen']">
            <div>
              <span className="text-[9px] text-[#71727e] block">SOLVED</span>
              <span className="text-sm font-bold text-[#f4f3ef]">{problemsSolvedCount || 128}</span>
            </div>
            <div className="border-x border-[#23252e]">
              <span className="text-[9px] text-[#71727e] block">TRACKS</span>
              <span className="text-sm font-bold text-[#f4f3ef]">{subjects.length || 4}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#71727e] block">READINESS</span>
              <span className="text-sm font-bold text-[#f4f3ef]">{overallProgress || 68}%</span>
            </div>
          </div>
        </div>

        {/* 02: CODE VELOCITY */}
        <div 
          onClick={() => setActiveTab('WATCH LOG')} 
          className="hardware-card p-6 flex flex-col justify-between min-h-[360px] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>02 PREPARATION VOLUME</span>
            </div>

            <div className="mt-2 mb-1">
              <h3 className="font-['Silkscreen'] text-4xl sm:text-5xl text-[#f4f3ef] tracking-tight">
                {totalStudyHours > 0 ? `${totalStudyHours}H` : '12.4K'}
              </h3>
              <span className="text-[10px] font-['Silkscreen'] text-[#71727e] uppercase tracking-widest">
                HOURS // LECTURES LOGGED
              </span>
            </div>

            {/* Weekly study volume equalizer */}
            <div className="my-6 p-4 rounded-2xl bg-[#0e0f13] border border-[#1c1d24] flex items-end justify-between h-28">
              {[
                { count: 5, accent: 1 },
                { count: 7, accent: 2 },
                { count: 4, accent: 0 },
                { count: 9, accent: 3 },
                { count: 6, accent: 1 },
                { count: 4, accent: 0 },
                { count: 8, accent: 4 },
                { count: 10, accent: 6 },
              ].map((col, cIdx) => (
                <div key={cIdx} className="flex flex-col space-y-1.5 items-center">
                  {Array.from({ length: 10 }).map((_, rIdx) => {
                    const rev = 9 - rIdx;
                    const isLit = rev < col.count;
                    const isAccent = isLit && rev >= col.count - col.accent;
                    return (
                      <span
                        key={rIdx}
                        className={`w-2 h-2 rounded-full ${
                          !isLit ? 'bg-[#1b1c24]' : isAccent ? 'bg-[#f95721]' : 'bg-[#e5e5e7]'
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#23252e] flex items-center justify-between font-['Silkscreen']">
            <div>
              <span className="text-[9px] text-[#71727e] block">TOTAL SESSIONS</span>
              <span className="text-base font-bold text-[#f4f3ef]">{totalWatchedCount || 24}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[#231714] border border-[#482117] text-[#f95721] text-xs font-bold">
              +18% PACE
            </div>
          </div>
        </div>

        {/* 03: SYLLABUS GAUGE */}
        <div 
          onClick={() => setActiveTab('OVERVIEW')} 
          className="hardware-card p-6 flex flex-col justify-between min-h-[360px] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>03 SYLLABUS GAUGE</span>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <svg width="190" height="190" viewBox="0 0 190 190">
                {Array.from({ length: 42 }).map((_, i) => {
                  const angle = (i / 42) * Math.PI * 2 - Math.PI / 2;
                  const x1 = 95 + Math.cos(angle) * 70;
                  const y1 = 95 + Math.sin(angle) * 70;
                  const x2 = 95 + Math.cos(angle) * 82;
                  const y2 = 95 + Math.sin(angle) * 82;
                  const isLit = i < Math.round((42 * (overallProgress || 68)) / 100);
                  const isOrange = i >= 36;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={!isLit ? '#1b1c24' : isOrange ? '#f95721' : '#f4f3ef'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-['Silkscreen']">
                <span className="text-3xl font-bold text-[#f4f3ef] tracking-tight">
                  {overallProgress || 68}%
                </span>
                <span className="text-[10px] text-[#71727e] uppercase tracking-widest mt-0.5">
                  SYLLABUS
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#23252e] grid grid-cols-3 gap-2 font-['Silkscreen'] text-[10px]">
            <div>
              <span className="text-[9px] text-[#71727e] block">DONE</span>
              <span className="font-bold text-[#f4f3ef]">{overallProgress || 68}%</span>
            </div>
            <div>
              <span className="text-[9px] text-[#71727e] block">PENDING</span>
              <span className="font-bold text-[#8c8b94]">{100 - (overallProgress || 68)}%</span>
            </div>
            <div>
              <span className="text-[9px] text-[#71727e] block">REVISION</span>
              <span className="font-bold text-[#f95721]">{revisionPendingCount}</span>
            </div>
          </div>
        </div>

        {/* 04: SPRINT VELOCITY */}
        <div className="hardware-card p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>04 INTERVIEW VELOCITY</span>
            </div>

            <div className="py-6 flex items-center justify-center">
              <svg width="220" height="70" viewBox="0 0 220 70">
                {[
                  [20, 48], [34, 45], [60, 42], [75, 34], [90, 26], [110, 24],
                  [130, 25], [148, 30], [165, 38], [180, 43], [195, 45], [210, 48],
                  [20, 52], [65, 52], [115, 52], [145, 52], [175, 52], [205, 52]
                ].map(([x, y], idx) => (
                  <circle key={idx} cx={x} cy={y} r="1.6" fill="#e5e5e7" />
                ))}
                <circle cx="206" cy="44" r="2.2" fill="#ff3b30" />
                <circle cx="209" cy="44" r="2.2" fill="#ff3b30" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i / 12) * Math.PI * 2;
                  return (
                    <React.Fragment key={i}>
                      <circle cx={50 + Math.cos(a) * 11} cy={52 + Math.sin(a) * 11} r="1.4" fill="#8e8d98" />
                      <circle cx={160 + Math.cos(a) * 11} cy={52 + Math.sin(a) * 11} r="1.4" fill="#8e8d98" />
                    </React.Fragment>
                  );
                })}
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 my-2 font-['Silkscreen']">
              <div>
                <span className="text-[10px] text-[#71727e] block">STAMINA</span>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-[#f4f3ef]">{streak > 0 ? '94%' : '78%'}</span>
                  <span className="w-6 h-0.5 bg-[#404250]"></span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#71727e] block">STREAK</span>
                <span className="text-2xl font-bold text-[#f4f3ef]">{streak} DAYS</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#23252e] flex items-center justify-between font-['Silkscreen']">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#8c8b94]">SPRINT ACTIVE</span>
              <span className="w-2 h-2 rounded-full bg-[#f95721] animate-pulse"></span>
            </div>
            <button
              onClick={() => setSprintLocked(!sprintLocked)}
              className="p-2 rounded-lg bg-[#1a1b22] hover:bg-[#232530] text-[#8c8b94] transition-colors cursor-pointer"
            >
              {sprintLocked ? <Lock className="w-4 h-4 text-[#f95721]" /> : <Unlock className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 05: USER-DEFINED SUBJECT TRACKS */}
        <div 
          onClick={() => {
            if (subjects[0]) {
              setSelectedSubjectId(subjects[0].id);
              setActiveTab('SUBJECT_DETAIL');
            }
          }}
          className="hardware-card p-6 flex flex-col justify-between min-h-[360px] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>05 SUBJECT TRACKS</span>
              <span className="text-[9px] text-[#f95721]">MANAGE</span>
            </div>

            <div className="font-['Silkscreen'] text-[10px] text-[#71727e] mb-4">
              <span>CORE PLACEMENT PIPELINE</span>
              <span className="block text-[#a09e96]">{subjects.length} REGISTERED TRACKS</span>
            </div>

            {/* Dotted Capsule representing CS tracks */}
            <div className="flex justify-center my-2">
              <svg width="140" height="90" viewBox="0 0 140 90">
                <g transform="translate(70, 45) rotate(-35)">
                  {Array.from({ length: 7 }).map((_, col) =>
                    Array.from({ length: 6 }).map((_, row) => (
                      <circle
                        key={`red_${col}_${row}`}
                        cx={-35 + col * 5.5}
                        cy={-14 + row * 5.5}
                        r="1.8"
                        fill="#ff3b30"
                      />
                    ))
                  )}
                  {Array.from({ length: 7 }).map((_, col) =>
                    Array.from({ length: 6 }).map((_, row) => (
                      <circle
                        key={`white_${col}_${row}`}
                        cx={6 + col * 5.5}
                        cy={-14 + row * 5.5}
                        r="1.8"
                        fill="#f4f3ef"
                      />
                    ))
                  )}
                </g>
              </svg>
            </div>

            {/* Subject Checkpoints */}
            <div className="flex items-center justify-center space-x-2 my-3">
              {subjects.slice(0, 4).map((sub, i) => {
                const isDone = (subjectStats[sub.id]?.progressPercent || 0) > 50;
                return (
                  <React.Fragment key={sub.id}>
                    <div 
                      title={sub.name}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-['Silkscreen'] ${
                        isDone ? 'bg-[#f95721] text-white' : 'border border-[#404252] text-[#8c8b94]'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : i + 1}
                    </div>
                    {i < 3 && <span className="w-3 h-0.5 bg-[#2d2f3c]"></span>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#23252e] flex items-center justify-between font-['Silkscreen']">
            <span className="text-[10px] text-[#71727e]">AVG PROGRESS</span>
            <span className="text-2xl font-bold text-[#f95721]">{overallProgress}%</span>
          </div>
        </div>

        {/* 06: COGNITIVE PULSE / REVISION CADENCE */}
        <div 
          onClick={() => setActiveTab('REVISION')} 
          className="hardware-card p-6 flex flex-col justify-between min-h-[360px] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>06 RETENTION PULSE</span>
              <span className="text-[9px] text-[#ff3b30]">SPACED REVIEW</span>
            </div>

            {/* Spaced repetition memory heartbeat curve */}
            <div className="py-6 flex items-center justify-center">
              <svg width="220" height="70" viewBox="0 0 220 70">
                {[
                  [10, 35], [26, 35], [40, 24], [46, 42], [52, 35], [78, 35],
                  [86, 30], [92, 12], [98, 58], [104, 20], [110, 42], [116, 35],
                  [134, 35], [150, 31], [156, 38], [162, 35], [192, 35], [210, 35]
                ].map(([x, y], idx) => {
                  const isRed = x >= 86 && x <= 116;
                  return (
                    <circle key={idx} cx={x} cy={y} r="1.8" fill={isRed ? '#ff3b30' : '#f4f3ef'} />
                  );
                })}
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 font-['Silkscreen'] text-center my-2">
              <div>
                <span className="text-[9px] text-[#71727e] block">DUE</span>
                <span className="text-lg font-bold text-[#f4f3ef]">{revisionPendingCount}</span>
                <span className="text-[8px] text-[#71727e] block">ITEMS</span>
              </div>
              <div className="border-x border-[#23252e]">
                <span className="text-[9px] text-[#71727e] block">RETENTION</span>
                <span className="text-lg font-bold text-[#f4f3ef]">96%</span>
              </div>
              <div>
                <span className="text-[9px] text-[#71727e] block">INTERVAL</span>
                <span className="text-lg font-bold text-[#f4f3ef]">24H</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#23252e] flex items-center space-x-2 font-['Silkscreen']">
            <div className="px-3 py-1 rounded-xl bg-[#1a1b22] border border-[#272935] flex items-center space-x-2">
              <span className="text-xs text-[#8c8b94]">
                {revisionPendingCount === 0 ? 'OPTIMAL' : 'REVIEW DUE'}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#ff3b30]"></span>
            </div>
          </div>
        </div>

        {/* 07: TOPIC RADAR */}
        <div 
          onClick={() => setActiveTab('OVERVIEW')} 
          className="hardware-card p-6 flex flex-col justify-between min-h-[360px] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>07 TOPIC RADAR</span>
            </div>

            <div className="relative flex items-center justify-center my-3">
              <svg width="150" height="150" viewBox="0 0 150 150">
                {Array.from({ length: 32 }).map((_, i) => {
                  const a = (i / 32) * Math.PI * 2;
                  const isRed = i >= 28 || i <= 2;
                  return (
                    <circle
                      key={`outer_${i}`}
                      cx={75 + Math.cos(a) * 58}
                      cy={75 + Math.sin(a) * 58}
                      r="1.6"
                      fill={isRed ? '#ff3b30' : '#e5e5e7'}
                    />
                  );
                })}
                {Array.from({ length: 24 }).map((_, i) => {
                  const a = (i / 24) * Math.PI * 2;
                  return (
                    <circle
                      key={`inner_${i}`}
                      cx={75 + Math.cos(a) * 44}
                      cy={75 + Math.sin(a) * 44}
                      r="1.4"
                      fill="#8c8b94"
                    />
                  );
                })}
                {/* Dotted Binary Tree */}
                {[
                  [75, 48], [62, 65], [88, 65], [52, 84], [72, 84], [78, 84], [98, 84]
                ].map(([x, y], idx) => (
                  <circle key={`node_${idx}`} cx={x} cy={y} r="2.2" fill="#f4f3ef" />
                ))}
              </svg>
            </div>
          </div>

          <div className="pt-4 border-t border-[#23252e] grid grid-cols-2 gap-4 font-['Silkscreen']">
            <div>
              <span className="text-[10px] text-[#71727e] block">TOTAL TOPICS</span>
              <span className="text-xl font-bold text-[#f4f3ef]">{topics.length}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#71727e] block">PROBLEMS</span>
              <span className="text-xl font-bold text-[#f4f3ef]">{problems.length}</span>
            </div>
          </div>
        </div>

        {/* 08: DSA PATTERN RECALL */}
        <div className="hardware-card p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>08 PATTERN RECALL</span>
              <button onClick={nextPattern} className="text-[9px] text-[#f95721] hover:underline cursor-pointer">
                NEXT
              </button>
            </div>

            <p className="text-[10px] font-['Silkscreen'] text-[#71727e] mb-4">
              {dsaPatterns[patternIdx].hint}
            </p>

            <div className="my-6 flex items-center justify-center space-x-3 font-['Silkscreen'] text-2xl font-bold">
              {dsaPatterns[patternIdx].name.split('').map((char, cIdx) => (
                <span key={cIdx} className="text-[#f4f3ef]">
                  {cIdx === dsaPatterns[patternIdx].blankIndex && !patternSolved ? (
                    <span className="text-[#8c8b94] border-b-2 border-dashed border-[#f95721] px-1">_</span>
                  ) : (
                    <span className={cIdx === dsaPatterns[patternIdx].blankIndex ? 'text-[#f95721]' : ''}>
                      {char}
                    </span>
                  )}
                </span>
              ))}
            </div>

            <div className="text-center font-['Silkscreen'] text-xs min-h-[28px]">
              {patternSolved ? (
                <span className="text-emerald-400">Pattern Mastered!</span>
              ) : (
                <div className="flex justify-center space-x-2">
                  {['F', 'P', 'R', 'E', 'A'].map((l) => (
                    <button
                      key={l}
                      onClick={() => handleGuess(l)}
                      className="px-2.5 py-1 rounded bg-[#1c1d24] hover:bg-[#f95721] hover:text-white border border-[#2b2d3a] transition-colors cursor-pointer text-[10px]"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#23252e] flex items-center justify-between font-['Silkscreen']">
            <div>
              <span className="text-[9px] text-[#71727e] block">SCORE</span>
              <span className="text-base font-bold text-[#f4f3ef]">{score}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#71727e] block">STREAK</span>
              <span className="text-base font-bold text-[#f4f3ef]">{patternStreak}</span>
            </div>
            <Smile className="w-5 h-5 text-[#8c8b94]" />
          </div>
        </div>

        {/* 09: PROBLEM SOLVING TRAJECTORY */}
        <div 
          onClick={() => setActiveTab('PROBLEMS')} 
          className="hardware-card p-6 flex flex-col justify-between min-h-[360px] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>09 SOLVING TRAJECTORY</span>
              <span className="text-[9px] text-[#ff3b30] font-bold">LIVE</span>
            </div>

            <div className="mt-1">
              <span className="text-3xl font-bold font-['Silkscreen'] text-[#f4f3ef] tracking-tight">
                {problemsSolvedCount || 128}
              </span>
              <span className="text-[9px] font-['Silkscreen'] text-[#71727e] block uppercase tracking-widest mt-0.5">
                PROBLEMS CONQUERED
              </span>
            </div>

            <div className="my-6 flex items-center justify-center">
              <svg width="220" height="70" viewBox="0 0 220 70">
                <path
                  d="M 15 48 Q 40 38 60 52 T 110 40 T 155 18 T 195 48"
                  fill="none"
                  stroke="#262833"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                />
                {[
                  [15, 48], [30, 44], [45, 42], [60, 52], [75, 49], [90, 44], [105, 42],
                  [120, 36], [135, 28], [155, 18], [168, 30], [180, 42], [195, 48]
                ].map(([x, y], idx) => {
                  const isPeak = x === 155;
                  if (isPeak) {
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="5" fill="none" stroke="#ff3b30" strokeWidth="1.5" className="animate-ping" />
                        <circle cx={x} cy={y} r="2" fill="#ff3b30" />
                      </g>
                    );
                  }
                  return <circle key={idx} cx={x} cy={y} r="1.8" fill="#e5e5e7" />;
                })}
              </svg>
            </div>
          </div>

          <div className="pt-4 border-t border-[#23252e] flex items-center justify-between font-['Silkscreen']">
            <span className="text-[10px] text-[#71727e]">ACCURACY</span>
            <span className="text-xl font-bold text-[#f95721]">+23%</span>
          </div>
        </div>

        {/* 10: DEEP WORK AUDIO */}
        <div className="hardware-card p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>10 FOCUS SOUNDSCAPE</span>
              <button onClick={toggleFocusAudio} className="text-[#8c8b94] hover:text-[#f4f3ef] cursor-pointer">
                {isPlayingAudio ? <Volume2 className="w-4 h-4 text-[#f95721]" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <svg width="150" height="150" viewBox="0 0 150 150" className={isPlayingAudio ? 'animate-spin [animation-duration:14s]' : ''}>
                {Array.from({ length: 32 }).map((_, i) => (
                  <circle
                    key={`r1_${i}`}
                    cx={75 + Math.cos((i / 32) * Math.PI * 2) * 58}
                    cy={75 + Math.sin((i / 32) * Math.PI * 2) * 58}
                    r="1.4"
                    fill="#8c8b94"
                  />
                ))}
                {Array.from({ length: 24 }).map((_, i) => (
                  <circle
                    key={`r2_${i}`}
                    cx={75 + Math.cos((i / 24) * Math.PI * 2) * 44}
                    cy={75 + Math.sin((i / 24) * Math.PI * 2) * 44}
                    r="1.6"
                    fill="#e5e5e7"
                  />
                ))}
                <circle cx="75" cy="75" r="3.5" fill="#ff3b30" className={isPlayingAudio ? 'animate-pulse' : ''} />
              </svg>
            </div>

            <p className="text-center font-['Silkscreen'] text-[9px] text-[#71727e] truncate px-2">
              {tracks[currentTrackIndex]}
            </p>
          </div>

          <div className="pt-4 border-t border-[#23252e] flex items-center justify-center space-x-6">
            <button
              onClick={() => setCurrentTrackIndex((i) => (i - 1 + tracks.length) % tracks.length)}
              className="text-[#8c8b94] hover:text-[#f4f3ef] cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFocusAudio}
              className="w-10 h-10 rounded-full border border-[#ff3b30] flex items-center justify-center text-[#ff3b30] hover:bg-[#ff3b30] hover:text-white transition-all shadow-[0_0_12px_rgba(255,59,48,0.3)] cursor-pointer"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button
              onClick={() => setCurrentTrackIndex((i) => (i + 1) % tracks.length)}
              className="text-[#8c8b94] hover:text-[#f4f3ef] cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 11: ALGO ARENA */}
        <div className="hardware-card p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>11 ALGO ARENA</span>
              <button onClick={fireLaser} className="text-[9px] text-[#ff3b30] hover:underline uppercase cursor-pointer">
                TAP TO FIRE
              </button>
            </div>

            <div 
              onClick={fireLaser}
              className="relative h-44 my-2 p-3 rounded-2xl bg-[#0e0f13] border border-[#1b1c24] flex flex-col justify-between items-center cursor-pointer select-none overflow-hidden"
            >
              <div className="self-end mr-4">
                <svg width="40" height="30" viewBox="0 0 40 30">
                  {[
                    [20, 4], [15, 10], [20, 10], [25, 10],
                    [10, 16], [15, 16], [20, 16], [25, 16], [30, 16]
                  ].map(([x, y], idx) => (
                    <circle key={idx} cx={x} cy={y} r="1.5" fill="#f4f3ef" />
                  ))}
                </svg>
              </div>

              <div className="flex flex-col space-y-2 my-auto">
                <span className={`w-1.5 h-1.5 rounded-full bg-[#ff3b30] ${laserFired ? 'scale-150 animate-ping' : ''}`} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30]" />
              </div>

              <div className="mb-1">
                <svg width="46" height="30" viewBox="0 0 46 30">
                  {[
                    [23, 4], [18, 14], [23, 14], [28, 14],
                    [13, 19], [23, 19], [33, 19], [8, 24], [38, 24]
                  ].map(([x, y], idx) => (
                    <circle key={idx} cx={x} cy={y} r="1.6" fill={x <= 8 || x >= 38 ? '#ff3b30' : '#f4f3ef'} />
                  ))}
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#23252e] flex items-center justify-between font-['Silkscreen']">
            <div>
              <span className="text-[9px] text-[#71727e] block">EXP</span>
              <span className="text-base font-bold text-[#f4f3ef]">0{gameScore}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[#ff3b30] text-sm">
              <span>❤</span>
              <span>❤</span>
              <span>❤</span>
            </div>
          </div>
        </div>

        {/* 12: SYSTEM DESIGN ARCHITECTURE */}
        <div 
          onClick={() => {
            const sys = subjects.find(s => s.name.toLowerCase().includes('system') || s.code.toLowerCase().includes('sys'));
            if (sys) {
              setSelectedSubjectId(sys.id);
              setActiveTab('SUBJECT_DETAIL');
            } else if (subjects[0]) {
              setSelectedSubjectId(subjects[0].id);
              setActiveTab('SUBJECT_DETAIL');
            }
          }}
          className="hardware-card p-6 flex flex-col justify-between min-h-[360px] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#7a7a85] mb-2 tracking-wider">
              <span>12 SYSTEM DESIGN</span>
              <div className="flex items-center space-x-1.5 text-[9px] text-[#ff3b30] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] animate-ping"></span>
                <span>REC</span>
              </div>
            </div>

            <div className="relative h-44 my-2 flex items-center justify-center">
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#8c8b94]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#8c8b94]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#8c8b94]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#8c8b94]" />

              <svg width="130" height="120" viewBox="0 0 130 120">
                {[
                  [55, 20], [68, 20], [80, 20], [92, 20], [105, 20],
                  [105, 32], [105, 45], [105, 58], [105, 70],
                  [55, 32], [55, 45], [55, 58], [55, 70],
                ].map(([x, y], idx) => (
                  <circle key={`back_${idx}`} cx={x} cy={y} r="1.4" fill="#505260" />
                ))}
                {[
                  [42, 33], [48, 27], [92, 33], [98, 27], [92, 83], [98, 77], [42, 83], [48, 77]
                ].map(([x, y], idx) => (
                  <circle key={`diag_${idx}`} cx={x} cy={y} r="1.5" fill="#8c8b94" />
                ))}
                {[
                  [35, 40], [48, 40], [60, 40], [72, 40], [85, 40],
                  [85, 52], [85, 65], [85, 78], [85, 90],
                  [35, 52], [35, 65], [35, 78], [35, 90],
                ].map(([x, y], idx) => (
                  <circle key={`front_${idx}`} cx={x} cy={y} r="1.8" fill="#f4f3ef" />
                ))}
              </svg>
            </div>
          </div>

          <div className="pt-4 border-t border-[#23252e] flex items-center justify-between font-['Silkscreen']">
            <div>
              <span className="text-[9px] text-[#71727e] block">COMPONENTS</span>
              <span className="text-base font-bold text-[#f4f3ef]">{subjects.length || 4} NODES</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-[#71727e] block">CONFIDENCE</span>
              <span className="text-base font-bold text-[#f4f3ef]">92%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grounded CS Subject Tracks Drawer right below the 12 cards */}
      <div className="mt-14">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f95721]" />
            <h3 className="font-['Silkscreen'] text-sm tracking-wider text-[#f4f3ef] uppercase">
              REGISTERED CURRICULA // DRILL-DOWN
            </h3>
          </div>
          {onOpenAddSubject && (
            <button
              onClick={onOpenAddSubject}
              className="text-xs font-['Silkscreen'] text-[#f95721] hover:underline cursor-pointer"
            >
              + ADD NEW TRACK
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((sub, idx) => {
            const stats = subjectStats[sub.id] || { progressPercent: 0, watched: 0, total: 20 };
            return (
              <div
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectId(sub.id);
                  setActiveTab('SUBJECT_DETAIL');
                }}
                className="hardware-card p-5 cursor-pointer hover:border-[#f95721]/50 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-['Silkscreen'] text-[#71727e] mb-1">
                    <span>TRACK 0{idx + 1}</span>
                    <span className="text-[#f95721]">{stats.progressPercent}%</span>
                  </div>
                  <h4 className="font-['Silkscreen'] text-base font-bold text-[#f4f3ef]">
                    {sub.name}
                  </h4>
                  <p className="text-xs text-[#8c8a83] line-clamp-1 mt-1 font-sans">
                    {sub.description || 'Core placement module'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#23252e] flex items-center justify-between text-xs font-['Silkscreen'] text-[#8c8a83]">
                  <span>{stats.watched} VIDEOS</span>
                  <ChevronRight className="w-4 h-4 text-[#f95721]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reference Footer Motto */}
      <div className="mt-16 pt-8 border-t border-[#1c1e26] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 font-['Silkscreen']">
        <div>
          <p className="text-xl sm:text-2xl text-[#8e8d89] tracking-wider uppercase leading-snug">
            BUILD ANYTHING
          </p>
          <p className="text-xl sm:text-2xl text-[#f4f3ef] tracking-wider uppercase flex items-center space-x-1">
            <span>WITH INTELLIGENCE</span>
            <span className="text-[#f95721] animate-pulse">_</span>
          </p>
        </div>

        <div className="text-left sm:text-right text-[#71727e] text-xs">
          <p className="text-[#8e8d89] font-bold uppercase tracking-wider">
            PLACEMENT PROGRESS BAR
          </p>
          <p className="text-[#5b5d6b]">
            ACTIVE PLACEMENT COCKPIT
          </p>
        </div>
      </div>
    </div>
  );
};
