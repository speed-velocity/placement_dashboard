import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { SubjectId, Video, DifficultyLevel, Topic } from '../../types';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  CheckCircle2, 
  RotateCcw, 
  FileEdit, 
  Plus, 
  Play, 
  Sparkles,
  Search,
  Filter,
  Trash2,
  Edit2,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

interface SubjectDetailViewProps {
  subjectId: SubjectId;
  onOpenAddVideoWithTopic?: (topicId: string, subjectId: SubjectId) => void;
  onOpenAddTopic?: (subjectId: SubjectId) => void;
  onOpenEditTopic?: (topic: Topic) => void;
  onOpenEditSubject?: (subjectId: SubjectId) => void;
  onOpenNotes?: (videoId: string) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subjectId,
  onOpenAddVideoWithTopic,
  onOpenAddTopic,
  onOpenEditTopic,
  onOpenEditSubject,
  onOpenNotes,
}) => {
  const { 
    subjects,
    topics, 
    topicStats, 
    subjectStats, 
    videos, 
    markVideoWatched, 
    markVideoRevised,
    deleteVideo,
    deleteTopic,
    selectedTopicId,
    setSelectedTopicId,
    setActiveTab,
  } = usePlacement();

  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(selectedTopicId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | DifficultyLevel>('ALL');

  const currentSubject = subjects.find(s => s.id === subjectId);
  const currentSubjectStats = subjectStats[subjectId];
  const subjectTopics = topicStats.filter(t => t.subjectId === subjectId);

  if (!currentSubject) {
    return (
      <div className="p-12 text-center rounded-2xl bg-[#16171c] border border-[#262832]">
        <h3 className="font-mono text-base text-[#f4f3ef] font-bold uppercase mb-2">
          Subject Module Not Found
        </h3>
        <p className="font-mono text-xs text-[#8c8a83] mb-4">
          This subject may have been removed or not yet configured.
        </p>
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className="px-4 py-2 rounded-xl bg-[#1e2029] hover:bg-[#252834] text-[#f95721] font-mono text-xs uppercase tracking-wider border border-[#2d303f] cursor-pointer"
        >
          Return to Cockpit Overview
        </button>
      </div>
    );
  }

  const toggleExpand = (topicId: string) => {
    setExpandedTopicId(prev => (prev === topicId ? null : topicId));
    setSelectedTopicId(topicId);
  };

  const getDifficultyBadge = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'EASY':
        return 'text-emerald-400 border-emerald-800/50 bg-emerald-950/40';
      case 'MEDIUM':
        return 'text-[#e8a338] border-[#e8a338]/40 bg-amber-950/30';
      case 'HARD':
        return 'text-[#f95721] border-[#f95721]/40 bg-red-950/30';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back button & top navigation breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className="flex items-center space-x-1.5 font-mono text-xs text-[#8c8a83] hover:text-[#f4f3ef] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO OVERVIEW</span>
        </button>

        <div className="flex items-center space-x-2">
          {onOpenEditSubject && (
            <button
              onClick={() => onOpenEditSubject(subjectId)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#181a22] hover:bg-[#222530] text-[#8c8a83] hover:text-[#f4f3ef] font-mono text-xs uppercase tracking-wider border border-[#262834] transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>EDIT SUBJECT</span>
            </button>
          )}

          {onOpenAddTopic && (
            <button
              onClick={() => onOpenAddTopic(subjectId)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#1c1e28] hover:bg-[#252836] text-[#f95721] hover:text-[#ff6b3b] font-mono text-xs uppercase tracking-wider border border-[#2e3140] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ ADD TOPIC MODULE</span>
            </button>
          )}
        </div>
      </div>

      {/* Subject Header Banner */}
      <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span 
                className="font-mono text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: currentSubject.color || '#f95721' }}
              >
                {currentSubject.code}
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#20222a] text-[#8c8a83] border border-[#2b2e3b]">
                USER-DEFINED CURRICULUM
              </span>
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#f4f3ef] tracking-tight mt-1">
              {currentSubject.name}
            </h2>
            <p className="font-mono text-xs text-[#8c8a83] mt-1">
              {currentSubject.description || `DEEP TOPICAL TRACKER // ${subjectTopics.length} MODULES IN THIS DOMAIN`}
            </p>
          </div>

          {/* Subject Telemetry Quick Chips */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-[#121318] border border-[#21232c] text-center min-w-[95px]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#777a88] block">
                WATCHED
              </span>
              <span className="font-mono text-base font-bold text-[#f4f3ef]">
                {currentSubjectStats?.watched || 0} / {currentSubjectStats?.total || 25}
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-[#121318] border border-[#21232c] text-center min-w-[95px]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#777a88] block">
                PROGRESS
              </span>
              <span className="font-mono text-base font-bold text-[#f95721]">
                {currentSubjectStats?.progressPercent || 0}%
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-[#121318] border border-[#21232c] text-center min-w-[95px]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#777a88] block">
                REVISION
              </span>
              <span className="font-mono text-base font-bold text-[#e2e0d8]">
                {currentSubjectStats?.revisionCount || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Global Subject Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#202229]">
          <div className="flex items-center justify-between font-mono text-[10px] text-[#8c8a83] mb-1.5">
            <span>CURRICULUM COMPLETION</span>
            <span className="text-[#f95721] font-semibold">{currentSubjectStats?.progressPercent || 0}%</span>
          </div>
          <div className="w-full bg-[#121318] h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${currentSubjectStats?.progressPercent || 0}%`,
                backgroundColor: currentSubject.color || '#f95721',
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#16171c] border border-[#22242f]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6c6e7e] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topic or video titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#121318] border border-[#22242e] text-xs font-mono text-[#f4f3ef] placeholder-[#666878] focus:outline-none focus:border-[#f95721]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#787a8a]">
            DIFF:
          </span>
          {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-2.5 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border ${
                difficultyFilter === diff
                  ? 'bg-[#f95721] text-white border-[#f95721] font-semibold'
                  : 'bg-[#121318] text-[#8c8a83] border-[#22242e] hover:text-[#f4f3ef]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Accordion List */}
      {subjectTopics.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#16171c] border border-dashed border-[#282a36] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#1d1f27] border border-[#2b2e3a] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6 text-[#f95721]" />
          </div>
          <div>
            <h4 className="font-sans text-lg font-bold text-[#f4f3ef]">
              No Syllabus Topics Defined in {currentSubject.name}
            </h4>
            <p className="font-mono text-xs text-[#8c8a83] max-w-md mx-auto mt-1">
              Structure your preparation by breaking this subject down into modules (e.g. Arrays, Linked Lists, Concurrency, etc.).
            </p>
          </div>
          {onOpenAddTopic && (
            <button
              onClick={() => onOpenAddTopic(subjectId)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#f95721] hover:bg-[#ff6836] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_12px_rgba(249,87,33,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ DEFINE FIRST TOPIC</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {subjectTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            
            // Get videos under this topic
            let topicVideos = videos.filter(v => v.topicId === topic.id);
            if (difficultyFilter !== 'ALL') {
              topicVideos = topicVideos.filter(v => v.difficulty === difficultyFilter);
            }
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              topicVideos = topicVideos.filter(v => 
                v.title.toLowerCase().includes(q) || 
                (v.notes && v.notes.toLowerCase().includes(q))
              );
            }

            return (
              <div
                key={topic.id}
                id={`topic-accordion-${topic.id}`}
                className="rounded-2xl bg-[#16171c] border border-[#262832] overflow-hidden transition-all shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
              >
                {/* Topic Header Accordion Bar */}
                <div
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#191b22] transition-colors"
                  onClick={() => toggleExpand(topic.id)}
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="font-mono text-xs px-2 py-1 rounded bg-[#1e2029] text-[#f95721] border border-[#2d303e] font-bold">
                      {topic.number}
                    </span>
                    <div>
                      <h3 className="font-sans text-base font-bold text-[#f4f3ef] flex items-center space-x-2">
                        <span>{topic.title}</span>
                      </h3>
                      <span className="font-mono text-[10px] text-[#7b7e8d] block mt-0.5">
                        {topic.description || `${topic.watched} of ${topic.total} Completed`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 justify-between sm:justify-end">
                    {/* Topic Progress pill */}
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-[#121318] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#f95721] h-full rounded-full transition-all"
                          style={{ width: `${topic.progressPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#f95721] min-w-[32px] text-right">
                        {topic.progressPercent}%
                      </span>
                    </div>

                    {/* Action buttons inside topic header */}
                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      {onOpenAddVideoWithTopic && (
                        <button
                          onClick={() => onOpenAddVideoWithTopic(topic.id, subjectId)}
                          title="Add Video to this Topic"
                          className="p-1.5 rounded-lg text-[#8c8a83] hover:text-[#f4f3ef] hover:bg-[#232532] border border-transparent hover:border-[#2f3242] transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}

                      {onOpenEditTopic && (
                        <button
                          onClick={() => onOpenEditTopic(topic)}
                          title="Edit Topic"
                          className="p-1.5 rounded-lg text-[#8c8a83] hover:text-[#f4f3ef] hover:bg-[#232532] border border-transparent hover:border-[#2f3242] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete topic "${topic.title}"?`)) {
                            deleteTopic(topic.id);
                          }
                        }}
                        title="Delete Topic"
                        className="p-1.5 rounded-lg text-[#8c8a83] hover:text-red-400 hover:bg-[#232532] border border-transparent hover:border-[#2f3242] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[#8c8a83]">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Topic Videos Expansion Drawer */}
                {isExpanded && (
                  <div className="border-t border-[#20222a] p-4 sm:p-5 bg-[#131418] space-y-2.5">
                    {topicVideos.length === 0 ? (
                      <div className="p-6 text-center rounded-xl bg-[#171820] border border-dashed border-[#262834]">
                        <p className="font-mono text-xs text-[#7b7e8e] mb-2">
                          No videos or lectures logged for this module yet.
                        </p>
                        {onOpenAddVideoWithTopic && (
                          <button
                            onClick={() => onOpenAddVideoWithTopic(topic.id, subjectId)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#20222c] hover:bg-[#272935] text-[#f95721] font-mono text-xs uppercase tracking-wider border border-[#2d303f] cursor-pointer"
                          >
                            + Add Video to {topic.title}
                          </button>
                        )}
                      </div>
                    ) : (
                      topicVideos.map((video) => {
                        const isWatched = video.status === 'WATCHED' || video.status === 'MASTERED' || video.status === 'REVISION';

                        return (
                          <div
                            key={video.id}
                            id={`video-row-${video.id}`}
                            className={`
                              p-3 sm:p-3.5 rounded-xl border transition-all duration-150
                              flex flex-col sm:flex-row sm:items-center justify-between gap-3
                              ${
                                isWatched
                                  ? 'bg-[#16171d] border-[#22242e]'
                                  : 'bg-[#181a22] border-[#262835] hover:border-[#333644]'
                              }
                            `}
                          >
                            {/* Left: Checkbox + Title + Difficulty */}
                            <div className="flex items-start space-x-3">
                              <button
                                onClick={() => markVideoWatched(video.id)}
                                title={isWatched ? 'Watched' : 'Mark Watched'}
                                className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer border ${
                                  isWatched
                                    ? 'bg-[#f95721] border-[#f95721] text-white'
                                    : 'bg-[#121318] border-[#383a48] text-transparent hover:border-[#f95721]'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>

                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${getDifficultyBadge(video.difficulty)}`}>
                                    {video.difficulty}
                                  </span>

                                  {video.status === 'MASTERED' && (
                                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 uppercase font-bold">
                                      MASTERED
                                    </span>
                                  )}

                                  {video.status === 'REVISION' && (
                                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 uppercase font-bold">
                                      REVISION
                                    </span>
                                  )}

                                  {video.watchedDate && (
                                    <span className="font-mono text-[9px] text-[#6d7080]">
                                      WATCHED {video.watchedDate}
                                    </span>
                                  )}
                                </div>

                                <h4 className={`font-sans text-xs sm:text-sm font-semibold ${isWatched ? 'text-[#e2e0d8]' : 'text-[#f4f3ef]'}`}>
                                  {video.title}
                                </h4>

                                {video.notes && (
                                  <p className="font-mono text-[11px] text-[#8c8a83] mt-1 line-clamp-1">
                                    <span className="text-[#f95721] font-semibold">[{video.noteCategory || 'NOTE'}]: </span>
                                    {video.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Right Actions: Revision Dots, Notes, Resource Link, Delete */}
                            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                              {/* Spaced Revision Indicator */}
                              <div className="flex items-center space-x-1 mr-1" title={`Revision Tier: ${video.revisionLevel}`}>
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

                              {/* Mark Revised button */}
                              <button
                                onClick={() => markVideoRevised(video.id)}
                                title="Advance Spaced Revision Level"
                                className="p-1.5 rounded-lg bg-[#1a1b22] hover:bg-[#242632] text-[#8c8a83] hover:text-[#f95721] border border-[#272935] transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>

                              {/* Notes button */}
                              {onOpenNotes && (
                                <button
                                  onClick={() => onOpenNotes(video.id)}
                                  title="Add or Edit Notes"
                                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                    video.notes
                                      ? 'bg-[#201a18] text-[#f95721] border-[#4a2419]'
                                      : 'bg-[#1a1b22] text-[#8c8a83] hover:text-[#f4f3ef] border-[#272935]'
                                  }`}
                                >
                                  <FileEdit className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Source / Lecture Link */}
                              {video.sourceUrl && (
                                <a
                                  href={video.sourceUrl}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  title="Open Lecture Resource"
                                  className="p-1.5 rounded-lg bg-[#1a1b22] hover:bg-[#242632] text-[#8c8a83] hover:text-[#f95721] border border-[#272935] transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {/* Delete video */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete "${video.title}"?`)) {
                                    deleteVideo(video.id);
                                  }
                                }}
                                title="Delete Video"
                                className="p-1.5 rounded-lg text-[#6d7080] hover:text-red-400 hover:bg-[#242632] border border-transparent hover:border-[#2f3242] transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
