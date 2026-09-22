import React, { useState, useEffect } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { DifficultyLevel, SubjectId } from '../../types';
import { X, Code2 } from 'lucide-react';

interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubjectId?: SubjectId;
}

export const AddProblemModal: React.FC<AddProblemModalProps> = ({ 
  isOpen, 
  onClose,
  defaultSubjectId
}) => {
  const { addProblem, subjects } = usePlacement();

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('General');
  const [subjectId, setSubjectId] = useState<SubjectId>(defaultSubjectId || (subjects[0]?.id || ''));
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [status, setStatus] = useState<'SOLVED' | 'PENDING'>('SOLVED');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSubjectId(defaultSubjectId || subjects[0]?.id || '');
      setTitle('');
      setUrl('');
      setNotes('');
      setError('');
    }
  }, [isOpen, defaultSubjectId, subjects]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a problem title.');
      return;
    }
    if (!subjectId) {
      setError('Please select or define a subject first.');
      return;
    }

    addProblem({
      title: title.trim(),
      topic: topic.trim() || 'General',
      subjectId,
      difficulty,
      status,
      url: url.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setUrl('');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div 
        id="add-problem-modal"
        className="w-full max-w-lg rounded-2xl bg-[#16171c] border border-[#2c2f3c] shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="p-6 pb-4 border-b border-[#22242e] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#f95721] rounded-xs" />
            <h3 className="font-mono text-sm font-bold tracking-[0.2em] text-[#f4f3ef] uppercase">
              + LOG SDE PROBLEM
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c8a83] hover:text-[#f4f3ef] hover:bg-[#20222b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
              PROBLEM TITLE <span className="text-[#f95721]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lowest Common Ancestor in Binary Tree (LeetCode 236)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
                TOPIC / TAG
              </label>
              <input
                type="text"
                placeholder="e.g. Binary Trees / DP / Graphs"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] focus:outline-none focus:border-[#f95721]"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
                SUBJECT DOMAIN <span className="text-[#f95721]">*</span>
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value as SubjectId)}
                className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] focus:outline-none focus:border-[#f95721]"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
                DIFFICULTY
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['EASY', 'MEDIUM', 'HARD'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border ${
                      difficulty === d
                        ? 'bg-[#f95721] text-white border-[#f95721] font-semibold'
                        : 'bg-[#121318] text-[#8c8a83] border-[#252834] hover:text-[#f4f3ef]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
                STATUS
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['SOLVED', 'PENDING'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border ${
                      status === st
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700 font-semibold'
                        : 'bg-[#121318] text-[#8c8a83] border-[#252834] hover:text-[#f4f3ef]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
              PROBLEM LINK (LEETCODE / CODECHEF / GFG)
            </label>
            <input
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
              INTUITION NOTES / PATTERN SUMMARY
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 2-pointer approach. Time O(N), Space O(1)."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721] resize-none"
            />
          </div>

          <div className="pt-4 border-t border-[#22242e] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#181a20] hover:bg-[#20222a] text-[#8c8a83] hover:text-[#f4f3ef] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer border border-[#262832]"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={subjects.length === 0}
              className="px-5 py-2 rounded-xl bg-[#f95721] hover:bg-[#ff6836] disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_12px_rgba(249,87,33,0.3)] cursor-pointer"
            >
              RECORD PROBLEM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
