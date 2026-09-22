import React, { useState, useEffect } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { Subject } from '../../types';
import { X, Plus, Trash2, Check } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectToEdit?: Subject | null;
}

const PRESET_COLORS = [
  { name: 'Terminal Orange', value: '#f95721' },
  { name: 'Emerald Logic', value: '#10b981' },
  { name: 'Amber Warning', value: '#f59e0b' },
  { name: 'Cyan Network', value: '#06b6d4' },
  { name: 'Purple Core', value: '#8b5cf6' },
  { name: 'Rose Kernel', value: '#f43f5e' },
];

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  subjectToEdit,
}) => {
  const { addSubject, updateSubject, deleteSubject, subjects } = usePlacement();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [targetVideos, setTargetVideos] = useState<number>(30);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#f95721');
  const [error, setError] = useState('');

  useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.name);
      setCode(subjectToEdit.code);
      setTargetVideos(subjectToEdit.targetVideos || 30);
      setDescription(subjectToEdit.description || '');
      setColor(subjectToEdit.color || '#f95721');
    } else {
      const nextIndex = subjects.length + 1;
      const formattedNum = nextIndex < 10 ? `0${nextIndex}` : `${nextIndex}`;
      setName('');
      setCode(`${formattedNum} // `);
      setTargetVideos(25);
      setDescription('');
      setColor(PRESET_COLORS[(nextIndex - 1) % PRESET_COLORS.length].value);
    }
    setError('');
  }, [subjectToEdit, isOpen, subjects.length]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a subject title (e.g. Data Structures & Algorithms)');
      return;
    }

    if (subjectToEdit) {
      updateSubject(subjectToEdit.id, {
        name: name.trim(),
        code: code.trim() || `0${subjects.findIndex(s => s.id === subjectToEdit.id) + 1} // ${name.trim().toUpperCase().slice(0, 4)}`,
        targetVideos: Number(targetVideos) || 20,
        description: description.trim() || undefined,
        color,
      });
    } else {
      addSubject({
        name: name.trim(),
        code: code.trim() || `0${subjects.length + 1} // ${name.trim().toUpperCase().slice(0, 4)}`,
        targetVideos: Number(targetVideos) || 25,
        description: description.trim() || undefined,
        color,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (subjectToEdit) {
      if (window.confirm(`Delete subject "${subjectToEdit.name}" and all its associated modules?`)) {
        deleteSubject(subjectToEdit.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        id="subject-definition-modal"
        className="w-full max-w-lg rounded-2xl bg-[#16171c] border border-[#2c2f3c] shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#22242e] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: color }} />
            <h3 className="font-mono text-sm font-bold tracking-[0.2em] text-[#f4f3ef] uppercase">
              {subjectToEdit ? 'EDIT SUBJECT MODULE' : '+ DEFINE NEW SUBJECT TRACK'}
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

          {/* Subject Name */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
              SUBJECT / PREPARATION TRACK NAME <span className="text-[#f95721]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Data Structures & Algorithms, Operating Systems, Aptitude..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!subjectToEdit && code.endsWith('// ')) {
                  const abbreviation = e.target.value.trim().toUpperCase().slice(0, 5);
                  setCode(`0${subjects.length + 1} // ${abbreviation}`);
                }
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Subject Code */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
                SYSTEM CODE / TAG
              </label>
              <input
                type="text"
                placeholder="e.g. 01 // DSA"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
              />
            </div>

            {/* Target Videos / Lessons Count */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
                TOTAL TARGET VIDEOS
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={targetVideos}
                onChange={(e) => setTargetVideos(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] focus:outline-none focus:border-[#f95721]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-1">
              SYLLABUS / PREP FOCUS (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="e.g. Standard SDE Sheet, LeetCode 75, Core Campus Syllabus"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
            />
          </div>

          {/* Color Accent Selection */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block mb-2">
              INSTRUMENTATION ACCENT COLOR
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
                    color === c.value
                      ? 'border-white text-[#f4f3ef] bg-[#222430]'
                      : 'border-[#262833] text-[#8c8a83] bg-[#121318] hover:border-[#383a48]'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.value }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[#22242e] flex items-center justify-between">
            {subjectToEdit ? (
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
                <span>{subjectToEdit ? 'SAVE CHANGES' : 'CREATE TRACK'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
