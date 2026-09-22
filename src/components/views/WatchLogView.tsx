import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { Video, SubjectId, VideoStatus } from '../../types';
import { 
  CheckCircle2, 
  ExternalLink, 
  RotateCcw, 
  Search, 
  Filter, 
  FileEdit, 
  Trash2, 
  Plus, 
  Calendar,
  Sparkles,
  Layers
} from 'lucide-react';

interface WatchLogViewProps {
  onOpenAddVideo: () => void;
  onOpenNotes: (videoId: string) => void;
}

export const WatchLogView: React.FC<WatchLogViewProps> = ({
  onOpenAddVideo,
  onOpenNotes,
}) => {
  const { 
    videos, 
    topics, 
    subjects,
    markVideoWatched, 
    markVideoRevised, 
    setVideoStatus, 
    deleteVideo 
  } = usePlacement();

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<'ALL' | SubjectId>('ALL');
  const [statusFilter, setStatusFilter] = useState<'WATCHED_ONLY' | 'ALL' | VideoStatus>('WATCHED_ONLY');

  const topicMap = new Map(topics.map(t => [t.id, t.title]));

  const filteredVideos = videos.filter((video) => {
    // Subtitle rule: "ONLY WHAT I ACTUALLY WATCHED."
    if (statusFilter === 'WATCHED_ONLY') {
      if (video.status === 'UNWATCHED') return false;
    } else if (statusFilter !== 'ALL') {
      if (video.status !== statusFilter) return false;
    }

    if (subjectFilter !== 'ALL' && video.subjectId !== subjectFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const topicName = topicMap.get(video.topicId)?.toLowerCase() || '';
      return (
        video.title.toLowerCase().includes(q) ||
        topicName.includes(q) ||
        (video.notes && video.notes.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const totalWatchedCount = videos.filter(v => v.status === 'WATCHED' || v.status === 'MASTERED' || v.status === 'REVISION').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#f95721] font-bold tracking-[0.25em] uppercase">
              SDE LOG // AUDIT RECORD
            </span>
            <h2 className="font-sans text-3xl font-extrabold text-[#f4f3ef] tracking-tight mt-1">
              WATCH LOG
            </h2>
            <p className="font-mono text-sm text-[#e0ded6] font-medium tracking-wide mt-1">
              "ONLY WHAT I ACTUALLY WATCHED."
            </p>
            <p className="font-mono text-xs text-[#797c8d] mt-1">
              Guaranteed ground-truth tracker. No inflated numbers or automated fake completion.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2.5 rounded-xl bg-[#121318] border border-[#232532] text-center">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#797c8d] block">
                ACTUALLY LOGGED
              </span>
              <span className="font-mono text-xl font-bold text-[#f95721]">
                {totalWatchedCount} <span className="text-xs text-[#717382] font-normal">VIDEOS</span>
              </span>
            </div>

            <button
              onClick={onOpenAddVideo}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#f95721] hover:bg-[#ff6735] text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_0_14px_rgba(249,87,33,0.35)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ LOG LECTURE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Control HUD */}
      <div className="p-4 rounded-2xl bg-[#16171c] border border-[#262832] flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#686a7a]" />
          <input
            type="text"
            placeholder="Search logged videos, notes, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#121318] border border-[#232530] text-xs font-mono text-[#f4f3ef] placeholder-[#686a7a] focus:outline-none focus:border-[#f95721]"
          />
        </div>

        {/* View Mode: Watched Only vs All */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#797c8d]">
            MODE:
          </span>
          <button
            onClick={() => setStatusFilter('WATCHED_ONLY')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-colors cursor-pointer border ${
              statusFilter === 'WATCHED_ONLY'
                ? 'bg-[#f95721] text-white border-[#f95721] font-semibold'
                : 'bg-[#121318] text-[#8c8a83] border-[#232530] hover:text-[#f4f3ef]'
            }`}
          >
            WATCHED ONLY
          </button>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-colors cursor-pointer border ${
              statusFilter === 'ALL'
                ? 'bg-[#f95721] text-white border-[#f95721] font-semibold'
                : 'bg-[#121318] text-[#8c8a83] border-[#232530] hover:text-[#f4f3ef]'
            }`}
          >
            ALL REPOSITORY
          </button>
          <button
            onClick={() => setStatusFilter('REVISION')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-colors cursor-pointer border ${
              statusFilter === 'REVISION'
                ? 'bg-amber-900/60 text-amber-300 border-amber-600 font-semibold'
                : 'bg-[#121318] text-[#8c8a83] border-[#232530] hover:text-[#f4f3ef]'
            }`}
          >
            IN REVISION
          </button>
          <button
            onClick={() => setStatusFilter('MASTERED')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-colors cursor-pointer border ${
              statusFilter === 'MASTERED'
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-600 font-semibold'
                : 'bg-[#121318] text-[#8c8a83] border-[#232530] hover:text-[#f4f3ef]'
            }`}
          >
            MASTERED
          </button>
        </div>

        {/* Subject Filter */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#797c8d]">
            SUBJ:
          </span>
          <button
            onClick={() => setSubjectFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border ${
              subjectFilter === 'ALL'
                ? 'bg-[#272935] text-[#f4f3ef] border-[#f95721]'
                : 'bg-[#121318] text-[#787a89] border-[#22242e] hover:text-[#e0ded6]'
            }`}
          >
            ALL
          </button>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSubjectFilter(sub.id)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border ${
                subjectFilter === sub.id
                  ? 'bg-[#272935] text-[#f4f3ef] border-[#f95721]'
                  : 'bg-[#121318] text-[#787a89] border-[#22242e] hover:text-[#e0ded6]'
              }`}
            >
              {sub.name.slice(0, 8).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards Grid / Table */}
      <div className="space-y-3">
        {filteredVideos.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#16171c] border border-dashed border-[#262832]">
            <p className="font-mono text-sm text-[#8c8a83]">
              No lecture video logs match your current filter criteria.
            </p>
            <button
              onClick={onOpenAddVideo}
              className="mt-3 px-4 py-2 rounded-lg bg-[#1e2029] hover:bg-[#252834] text-[#f4f3ef] font-mono text-xs uppercase tracking-wider border border-[#2e3140] cursor-pointer"
            >
              + Log New Lecture Video Now
            </button>
          </div>
        ) : (
          filteredVideos.map((video) => {
            const topicTitle = topicMap.get(video.topicId) || 'TOPIC';

            return (
              <div
                key={video.id}
                id={`watch-log-card-${video.id}`}
                className="p-5 rounded-2xl bg-[#16171c] border border-[#262832] hover:border-[#343746] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left side: Subject, Topic, Title, URL, Date, Notes */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1e2029] text-[#f95721] border border-[#2b2e3b] font-semibold">
                      {video.subjectId.toUpperCase()}
                    </span>

                    <span className="font-mono text-[10px] text-[#8c8a83] bg-[#14151a] px-2 py-0.5 rounded border border-[#20222a]">
                      {topicTitle}
                    </span>

                    <span
                      className={`font-mono text-[9px] px-2 py-0.5 rounded border font-semibold ${
                        video.status === 'MASTERED'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/50'
                          : video.status === 'WATCHED'
                          ? 'bg-[#1e202b] text-[#f4f3ef] border-[#383b4c]'
                          : video.status === 'REVISION'
                          ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                          : 'bg-[#14151a] text-[#717382] border-[#22242e]'
                      }`}
                    >
                      {video.status}
                    </span>

                    {video.watchedDate && (
                      <span className="font-mono text-[10px] text-[#717382] flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-[#717382]" />
                        <span>LOGGED: {video.watchedDate}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline space-x-2">
                    <h3 className="font-sans text-base font-bold text-[#f4f3ef]">
                      {video.title}
                    </h3>
                    {video.sourceUrl && (
                      <a
                        href={video.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Open Resource Link"
                        className="text-[#8c8a83] hover:text-[#f95721] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {video.notes && (
                    <div className="text-xs font-sans text-[#a7a59d] bg-[#121317] p-2.5 rounded-xl border border-[#202229]">
                      <span className="font-mono text-[9px] text-[#f95721] font-semibold mr-1.5 uppercase">
                        [{video.noteCategory || 'KEY CONCEPT'}]:
                      </span>
                      <span>{video.notes}</span>
                    </div>
                  )}
                </div>

                {/* Right side: Revision Level indicators & Actions */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {/* Revision Indicators */}
                  <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[#121318] border border-[#202229]">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#797c8d] mr-1">
                      REV:
                    </span>
                    {[1, 2, 3].map((lvl) => (
                      <span
                        key={lvl}
                        className={`w-2.5 h-2.5 rounded-full border ${
                          video.revisionLevel === 'MASTERED' || (typeof video.revisionLevel === 'number' && video.revisionLevel >= lvl)
                            ? 'bg-[#f95721] border-[#f95721]'
                            : 'bg-transparent border-[#383a48]'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Notes Button */}
                  <button
                    onClick={() => onOpenNotes(video.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#1a1c24] hover:bg-[#232532] text-[#d4d2cb] border border-[#2a2c3a] font-mono text-[10px] uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <FileEdit className="w-3 h-3 text-[#8c8a83]" />
                    <span>NOTES</span>
                  </button>

                  {/* Revise Button */}
                  {video.status !== 'UNWATCHED' && (
                    <button
                      onClick={() => markVideoRevised(video.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#1a1c24] hover:bg-[#232532] text-[#e8a338] border border-[#2a2c3a] hover:border-amber-800/60 font-mono text-[10px] uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>REVISE</span>
                    </button>
                  )}

                  {/* Mark Watched Button */}
                  <button
                    id={`log-mark-watched-${video.id}`}
                    onClick={() => markVideoWatched(video.id)}
                    className={`
                      px-3.5 py-1.5 rounded-xl font-mono text-[10px] uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-all cursor-pointer
                      ${
                        video.status === 'WATCHED' || video.status === 'MASTERED'
                          ? 'bg-[#18231e] text-emerald-400 border border-emerald-800/40 hover:bg-emerald-950/60'
                          : 'bg-[#f95721] hover:bg-[#ff6735] text-white shadow-[0_0_12px_rgba(249,87,33,0.35)]'
                      }
                    `}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{video.status === 'WATCHED' || video.status === 'MASTERED' ? 'WATCHED' : 'MARK WATCHED'}</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteVideo(video.id)}
                    title="Remove from log"
                    className="p-2 rounded-xl text-[#676977] hover:text-red-400 hover:bg-[#201518] border border-transparent hover:border-red-900/30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
