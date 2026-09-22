import React, { useState, useEffect } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { SubjectId, DifficultyLevel, VideoStatus, NoteCategory } from '../../types';
import { X, Plus, Video as VideoIcon } from 'lucide-react';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopicId?: string;
  defaultSubjectId?: SubjectId;
  onOpenAddSubject?: () => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  defaultTopicId,
  defaultSubjectId,
  onOpenAddSubject,
}) => {
  const { addVideo, addTopic, topics, subjects } = usePlacement();

  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [subjectId, setSubjectId] = useState<SubjectId>(defaultSubjectId || (subjects[0]?.id || ''));
  const [topicId, setTopicId] = useState<string>('');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [status, setStatus] = useState<VideoStatus>('UNWATCHED');
  const [notes, setNotes] = useState('');
  const [noteCategory, setNoteCategory] = useState<NoteCategory>('KEY CONCEPT');
  const [error, setError] = useState('');

  // Synchronize on open or change in props
  useEffect(() => {
    if (isOpen) {
      const activeSub = defaultSubjectId || subjects[0]?.id || '';
      setSubjectId(activeSub);
      
      const subTopics = topics.filter(t => t.subjectId === activeSub);
      if (defaultTopicId && subTopics.some(t => t.id === defaultTopicId)) {
        setTopicId(defaultTopicId);
        setIsCreatingTopic(false);
      } else if (subTopics.length > 0) {
        setTopicId(subTopics[0].id);
        setIsCreatingTopic(false);
      } else {
        setTopicId('');
        setIsCreatingTopic(true);
      }
      setError('');
    }
  }, [isOpen, defaultSubjectId, defaultTopicId, subjects, topics]);

  if (!isOpen) return null;

  const filteredTopics = topics.filter(t => t.subjectId === subjectId);

  const handleSubjectChange = (newSub: SubjectId) => {
    setSubjectId(newSub);
    const subTopics = topics.filter(t => t.subjectId === newSub);
    if (subTopics.length > 0) {
      setTopicId(subTopics[0].id);
      setIsCreatingTopic(false);
    } else {
      setTopicId('');
      setIsCreatingTopic(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a valid lecture or video title.');
      return;
    }
    if (!subjectId) {
      setError('Please define or select a subject track first.');
      return;
    }

    let finalTopicId = topicId;

    if (isCreatingTopic) {
      if (!newTopicTitle.trim()) {
        setError('Please provide a topic title or select an existing topic.');
        return;
      }
      const created = addTopic({
        title: newTopicTitle.trim(),
        subjectId,
      });
      finalTopicId = created.id;
    } else if (!finalTopicId) {
      if (filteredTopics.length > 0) {
        finalTopicId = filteredTopics[0].id;
      } else {
        const created = addTopic({
          title: 'General Module',
          subjectId,
        });
        finalTopicId = created.id;
      }
    }

    addVideo({
      title: title.trim(),
      subjectId,
      topicId: finalTopicId,
      sourceUrl: youtubeUrl.trim() || undefined,
      difficulty,
      status,
      notes: notes.trim() || undefined,
      noteCategory: notes.trim() ? noteCategory : undefined,
    });

    // Reset and close
    setTitle('');
    setYoutubeUrl('');
    setNotes('');
    setNewTopicTitle('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div 
        id="add-video-modal"
        className="w-full max-w-xl rounded-2xl bg-[#16171c] border border-[#2c2f3c] shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#22242e] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#f95721] rounded-xs" />
            <h3 className="font-mono text-sm font-bold tracking-[0.2em] text-[#f4f3ef] uppercase">
              + LOG LECTURE // VIDEO RECORD
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c8a83] hover:text-[#f4f3ef] hover:bg-[#20222b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          {subjects.length === 0 && (
            <div className="p-3.5 rounded-xl bg-[#221f1a] border border-[#f95721]/40 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-[#f95721] font-semibold">
                  NO SUBJECT TRACKS DEFINED
                </p>
                <p className="font-mono text-[10px] text-[#8c8a83] mt-0.5">
                  Define your subjects first (e.g. DSA, System Design) before logging lectures.
                </p>
              </div>
              {onOpenAddSubject && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAddSubject();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#f95721] text-white font-mono text-[10px] uppercase tracking-wider font-semibold cursor-pointer"
                >
                  + DEFINE SUBJECT
                </button>
              )}
            </div>
          )}

          {/* VIDEO TITLE */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
              VIDEO / LECTURE TITLE <span className="text-[#f95721]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lowest Common Ancestor in Binary Tree"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
            />
          </div>

          {/* YOUTUBE / LECTURE URL */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
              LECTURE / YOUTUBE URL (OPTIONAL)
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/... or lecture link"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
            />
          </div>

          {/* SUBJECT & TOPIC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
                SUBJECT TRACK <span className="text-[#f95721]">*</span>
              </label>
              <select
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value as SubjectId)}
                className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] focus:outline-none focus:border-[#f95721]"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83]">
                  TOPIC MODULE <span className="text-[#f95721]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingTopic(!isCreatingTopic)}
                  className="font-mono text-[9px] uppercase tracking-wider text-[#f95721] hover:underline cursor-pointer"
                >
                  {isCreatingTopic ? 'Select Existing' : '+ New Topic'}
                </button>
              </div>

              {isCreatingTopic || filteredTopics.length === 0 ? (
                <input
                  type="text"
                  placeholder="e.g. Dynamic Programming, Trees"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
                />
              ) : (
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] focus:outline-none focus:border-[#f95721]"
                >
                  {filteredTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.number} // {t.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* DIFFICULTY & STATUS */}
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
                INITIAL STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VideoStatus)}
                className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] focus:outline-none focus:border-[#f95721]"
              >
                <option value="UNWATCHED">UNWATCHED</option>
                <option value="WATCHED">WATCHED (NOW)</option>
                <option value="REVISION">IN REVISION QUEUE</option>
                <option value="MASTERED">MASTERED</option>
              </select>
            </div>
          </div>

          {/* NOTES & CATEGORY */}
          <div className="space-y-2 pt-2 border-t border-[#22242e]">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83]">
                KEY NOTES / REVISION HOOK (OPTIONAL)
              </label>
              <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value as NoteCategory)}
                className="px-2 py-0.5 rounded bg-[#121318] border border-[#252834] text-[10px] font-mono text-[#f95721] focus:outline-none"
              >
                <option value="KEY CONCEPT">KEY CONCEPT</option>
                <option value="CODE PATTERN">CODE PATTERN</option>
                <option value="IMPORTANT">IMPORTANT</option>
                <option value="MISTAKE">MISTAKE TO AVOID</option>
                <option value="INTERVIEW INSIGHT">INTERVIEW INSIGHT</option>
                <option value="PERSONAL EXPLANATION">PERSONAL EXPLANATION</option>
              </select>
            </div>

            <textarea
              rows={3}
              placeholder="e.g. Use postorder traversal. If node === p or q return node. If left && right return current node..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721] resize-none"
            />
          </div>

          {/* Modal Actions */}
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
              SAVE TO SDE LOG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
