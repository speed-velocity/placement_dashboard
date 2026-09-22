import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { NoteCategory } from '../../types';
import { FileText, Search, Edit3, Plus, Sparkles, Filter, ExternalLink } from 'lucide-react';

interface NotesViewProps {
  onOpenNotes: (videoId: string) => void;
}

const NOTE_CATEGORIES: NoteCategory[] = [
  'KEY CONCEPT',
  'CODE PATTERN',
  'IMPORTANT',
  'MISTAKE',
  'INTERVIEW INSIGHT',
  'PERSONAL EXPLANATION',
];

export const NotesView: React.FC<NotesViewProps> = ({ onOpenNotes }) => {
  const { videos, topics } = usePlacement();
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | NoteCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const topicMap = new Map(topics.map(t => [t.id, t.title]));

  // Videos that have notes
  const noteVideos = videos.filter((v) => {
    if (!v.notes || v.notes.trim() === '') return false;
    if (selectedCategory !== 'ALL' && v.noteCategory !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const topicName = topicMap.get(v.topicId)?.toLowerCase() || '';
      return (
        v.title.toLowerCase().includes(q) ||
        topicName.includes(q) ||
        v.notes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryColor = (cat?: NoteCategory) => {
    switch (cat) {
      case 'KEY CONCEPT':
        return 'text-[#f95721] bg-[#2a1b16] border-[#f95721]/40';
      case 'CODE PATTERN':
        return 'text-sky-400 bg-sky-950/40 border-sky-800/40';
      case 'IMPORTANT':
        return 'text-[#e8a338] bg-amber-950/40 border-amber-800/40';
      case 'MISTAKE':
        return 'text-red-400 bg-red-950/40 border-red-800/40';
      case 'INTERVIEW INSIGHT':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
      case 'PERSONAL EXPLANATION':
        return 'text-purple-300 bg-purple-950/40 border-purple-800/40';
      default:
        return 'text-[#8c8a83] bg-[#1a1c24] border-[#2c2e3c]';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#f95721] font-bold tracking-[0.25em] uppercase">
              COGNITIVE NOTEBASE
            </span>
            <h2 className="font-sans text-3xl font-extrabold text-[#f4f3ef] tracking-tight mt-1">
              PLACEMENT NOTES
            </h2>
            <p className="font-mono text-xs text-[#797c8d] mt-1">
              User-authored notes repository. Authentic insights, patterns, and traps recorded during study sessions.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-[#121318] border border-[#232532] text-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#797c8d] block">
              SAVED MEMOS
            </span>
            <span className="font-mono text-xl font-bold text-[#f95721]">
              {noteVideos.length} <span className="text-xs text-[#717382] font-normal">RECORDS</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Categories HUD */}
      <div className="p-4 rounded-2xl bg-[#16171c] border border-[#262832] space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666877]" />
            <input
              type="text"
              placeholder="Search concepts, patterns, mistakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121318] border border-[#232530] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
            />
          </div>

          <span className="font-mono text-[10px] text-[#717382] uppercase tracking-wider">
            SHOWING {noteVideos.length} USER NOTES
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#20222a]">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border ${
              selectedCategory === 'ALL'
                ? 'bg-[#f95721] text-white border-[#f95721] font-semibold'
                : 'bg-[#121318] text-[#8c8a83] border-[#22242e] hover:text-[#f4f3ef]'
            }`}
          >
            ALL CATEGORIES
          </button>
          {NOTE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#272935] text-[#f4f3ef] border-[#f95721] font-semibold'
                  : 'bg-[#121318] text-[#7a7c8a] border-[#22242e] hover:text-[#f4f3ef]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {noteVideos.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-[#16171c] border border-dashed border-[#262832]">
            <p className="font-mono text-sm text-[#8c8a83]">
              No notes found for current filter or search.
            </p>
          </div>
        ) : (
          noteVideos.map((video) => {
            const topicTitle = topicMap.get(video.topicId) || 'TOPIC';

            return (
              <div
                key={video.id}
                id={`note-card-${video.id}`}
                className="p-5 rounded-2xl bg-[#16171c] border border-[#262832] hover:border-[#383b4b] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1e2029] text-[#8c8a83] border border-[#2b2e3b]">
                      {video.subjectId.toUpperCase()} // {topicTitle}
                    </span>

                    <span
                      className={`font-mono text-[9px] px-2 py-0.5 rounded border font-semibold uppercase tracking-wider ${getCategoryColor(
                        video.noteCategory
                      )}`}
                    >
                      {video.noteCategory || 'KEY CONCEPT'}
                    </span>
                  </div>

                  <h3 className="font-sans text-base font-bold text-[#f4f3ef] flex items-center justify-between">
                    <span>{video.title}</span>
                    {video.sourceUrl && (
                      <a
                        href={video.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Open lecture reference"
                        className="text-[#8c8a83] hover:text-[#f95721] transition-colors ml-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </h3>

                  <div className="mt-3 p-3.5 rounded-xl bg-[#121318] border border-[#20222a] text-xs font-sans text-[#d4d2cb] leading-relaxed whitespace-pre-wrap">
                    {video.notes}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#20222a]">
                  <span className="font-mono text-[10px] text-[#717382]">
                    REV LEVEL: {video.revisionLevel}
                  </span>

                  <button
                    onClick={() => onOpenNotes(video.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#1c1e27] hover:bg-[#252834] text-[#f4f3ef] border border-[#2b2d3c] font-mono text-xs uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3 h-3 text-[#f95721]" />
                    <span>EDIT NOTE</span>
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
