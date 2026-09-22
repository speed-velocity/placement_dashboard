import React, { useState, useEffect } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { Topic, SubjectId } from '../../types';
import { X, Check, Trash2 } from 'lucide-react';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubjectId?: SubjectId;
  topicToEdit?: Topic | null;
}

export const TopicModal: React.FC<TopicModalProps> = ({
  isOpen,
  onClose,
  defaultSubjectId,
  topicToEdit,
}) => {
  const { addTopic, updateTopic, deleteTopic, subjects, topics } = usePlacement();

  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('01');
  const [subjectId, setSubjectId] = useState<SubjectId>(defaultSubjectId || (subjects[0]?.id || ''));
  const [totalVideos, setTotalVideos] = useState<number>(10);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (topicToEdit) {
      setTitle(topicToEdit.title);
      setNumber(topicToEdit.number);
      setSubjectId(topicToEdit.subjectId);
      setTotalVideos(topicToEdit.totalVideos || 10);
      setDescription(topicToEdit.description || '');
    } else {
      const currentSubjectTopics = topics.filter(t => t.subjectId === (defaultSubjectId || subjects[0]?.id));
      const nextNum = currentSubjectTopics.length + 1;
      const formattedNum = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
      setTitle('');
      setNumber(formattedNum);
      setSubjectId(defaultSubjectId || subjects[0]?.id || '');
      setTotalVideos(8);
      setDescription('');
    }
    setError('');
  }, [topicToEdit, isOpen, defaultSubjectId, subjects, topics]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a topic title (e.g. Arrays, Binary Trees, SQL Joins)');
      return;
    }
    if (!subjectId) {
      setError('Please select or define a subject first.');
      return;
    }

    if (topicToEdit) {
      updateTopic(topicToEdit.id, {
        title: title.trim(),
        number: number.trim() || '01',
        subjectId,
        totalVideos: Number(totalVideos) || 5,
        description: description.trim() || undefined,
      });
    } else {
      addTopic({
        title: title.trim(),
        number: number.trim() || '01',
        subjectId,
        totalVideos: Number(totalVideos) || 5,
        description: description.trim() || undefined,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (topicToEdit) {
      if (window.confirm(`Delete topic "${topicToEdit.title}"?`)) {
        deleteTopic(topicToEdit.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        id="topic-definition-modal"
        className="w-full max-w-lg rounded-2xl bg-[#16171c] border border-[#2c2f3c] shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#22242e] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#f95721] rounded-xs" />
            <h3 className="font-mono text-sm font-bold tracking-[0.2em] text-[#f4f3ef] uppercase">
              {topicToEdit ? 'EDIT SYLLABUS TOPIC' : '+ DEFINE NEW SYLLABUS TOPIC'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c8a83] hover:text-[#f4f3ef] hover:bg-[#20222b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Subject selector */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
              TARGET SUBJECT TRACK <span className="text-[#f95721]">*</span>
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] focus:outline-none focus:border-[#f95721]"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} — {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Title */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
              TOPIC TITLE <span className="text-[#f95721]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Binary Trees, Dynamic Programming, Indexing & B+ Trees"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Topic Number */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
                TOPIC # / SEQUENCE
              </label>
              <input
                type="text"
                placeholder="e.g. 01, 08"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] focus:outline-none focus:border-[#f95721]"
              />
            </div>

            {/* Total Videos */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
                ESTIMATED VIDEOS / SUBTOPICS
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={totalVideos}
                onChange={(e) => setTotalVideos(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] focus:outline-none focus:border-[#f95721]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
              NOTES / SCOPE SUMMARY (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="e.g. Traversals, Views, Path sum, LCA, Diameter"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[#22242e] flex items-center justify-between">
            {topicToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>DELETE</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#181a20] hover:bg-[#20222a] text-[#8c8a83] hover:text-[#f4f3ef] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer border border-[#262832]"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#f95721] hover:bg-[#ff6836] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_12px_rgba(249,87,33,0.3)] cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{topicToEdit ? 'SAVE TOPIC' : 'ADD TOPIC'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
