import React, { useState, useEffect } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { NoteCategory } from '../../types';
import { X, Save, FileEdit, ExternalLink } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  videoId: string | null;
  onClose: () => void;
}

const CATEGORIES: NoteCategory[] = [
  'KEY CONCEPT',
  'CODE PATTERN',
  'IMPORTANT',
  'MISTAKE',
  'INTERVIEW INSIGHT',
  'PERSONAL EXPLANATION',
];

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, videoId, onClose }) => {
  const { videos, updateVideoNotes, topics } = usePlacement();

  const video = videos.find(v => v.id === videoId);
  const topic = topics.find(t => t.id === video?.topicId);

  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<NoteCategory>('KEY CONCEPT');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (video) {
      setNotes(video.notes || '');
      setCategory(video.noteCategory || 'KEY CONCEPT');
      setSavedSuccess(false);
    }
  }, [video, isOpen]);

  if (!isOpen || !video) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVideoNotes(video.id, notes.trim(), category);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div 
        id="video-note-modal"
        className="w-full max-w-xl rounded-2xl bg-[#16171c] border border-[#2c2f3c] shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="p-6 pb-4 border-b border-[#22242e] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileEdit className="w-4 h-4 text-[#f95721]" />
            <h3 className="font-mono text-sm font-bold tracking-[0.2em] text-[#f4f3ef] uppercase">
              COGNITIVE NOTE // {video.subjectId.toUpperCase()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c8a83] hover:text-[#f4f3ef] hover:bg-[#20222b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8c8a83] mb-1">
              <span>TOPIC: {topic?.title || 'GENERAL'}</span>
              {video.sourceUrl && (
                <a
                  href={video.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#f95721] hover:underline flex items-center space-x-1"
                >
                  <span>LECTURE LINK</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <h4 className="font-sans text-base font-bold text-[#f4f3ef]">
              {video.title}
            </h4>
          </div>

          {/* Categories */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1.5">
              NOTE CATEGORY
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-1.5 px-2 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer border text-center ${
                    category === cat
                      ? 'bg-[#f95721] text-white border-[#f95721] font-semibold'
                      : 'bg-[#121318] text-[#8c8a83] border-[#22242e] hover:text-[#f4f3ef]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
              RECORDED INTEL & CODE PATTERN
            </label>
            <textarea
              rows={6}
              required
              placeholder="Detail your personal explanation, base conditions, edge cases, or interview pointers..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#121318] border border-[#262834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721] leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-[#20222a] flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#787a89]">
              {savedSuccess ? 'SAVED TO LOCAL ENGINE' : 'MANUAL NOTE ENGINE'}
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#1a1c24] hover:bg-[#20222b] text-[#8c8a83] hover:text-[#f4f3ef] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                CLOSE
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#f95721] hover:bg-[#ff6938] text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-[0_0_12px_rgba(249,87,33,0.35)] transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE NOTE</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
