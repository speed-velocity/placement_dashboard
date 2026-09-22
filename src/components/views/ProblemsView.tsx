import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { Problem, DifficultyLevel } from '../../types';
import { 
  Code2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Trash2, 
  Search,
  Filter
} from 'lucide-react';

interface ProblemsViewProps {
  onOpenAddProblem: () => void;
}

export const ProblemsView: React.FC<ProblemsViewProps> = ({ onOpenAddProblem }) => {
  const { problems, subjects, toggleProblemSolved, deleteProblem, problemsSolvedCount, problemsPendingCount } = usePlacement();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SOLVED' | 'PENDING'>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | DifficultyLevel>('ALL');
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');

  const filteredProblems = problems.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (difficultyFilter !== 'ALL' && p.difficulty !== difficultyFilter) return false;
    if (subjectFilter !== 'ALL' && p.subjectId !== subjectFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const easyCount = problems.filter(p => p.difficulty === 'EASY' && p.status === 'SOLVED').length;
  const medCount = problems.filter(p => p.difficulty === 'MEDIUM' && p.status === 'SOLVED').length;
  const hardCount = problems.filter(p => p.difficulty === 'HARD' && p.status === 'SOLVED').length;

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
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#f95721] font-bold tracking-[0.25em] uppercase">
              TECHNICAL REPERTOIRE
            </span>
            <h2 className="font-sans text-3xl font-extrabold text-[#f4f3ef] tracking-tight mt-1">
              PROBLEM STATUS
            </h2>
            <p className="font-mono text-xs text-[#797c8d] mt-1">
              Precision algorithmic problem solving registry. Manual verified entries only.
            </p>
          </div>

          <button
            onClick={onOpenAddProblem}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#f95721] hover:bg-[#ff6938] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_14px_rgba(249,87,33,0.35)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ ADD DSA PROBLEM</span>
          </button>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-[#20222a]">
          <div className="p-3 rounded-xl bg-[#121318] border border-[#202229]">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#797c8d] block">
              SOLVED
            </span>
            <span className="font-mono text-xl font-bold text-emerald-400">
              {problemsSolvedCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#121318] border border-[#202229]">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#797c8d] block">
              PENDING
            </span>
            <span className="font-mono text-xl font-bold text-[#e8a338]">
              {problemsPendingCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#121318] border border-[#202229]">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#797c8d] block">
              EASY
            </span>
            <span className="font-mono text-xl font-bold text-[#f4f3ef]">
              {easyCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#121318] border border-[#202229]">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#797c8d] block">
              MEDIUM
            </span>
            <span className="font-mono text-xl font-bold text-[#f4f3ef]">
              {medCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#121318] border border-[#202229]">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#797c8d] block">
              HARD
            </span>
            <span className="font-mono text-xl font-bold text-[#f95721]">
              {hardCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#16171c] border border-[#262832] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666877]" />
          <input
            type="text"
            placeholder="Search problems or patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121318] border border-[#232530] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Subjects */}
          {subjects.length > 0 && (
            <>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7d8d]">
                SUBJ:
              </span>
              <button
                onClick={() => setSubjectFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                  subjectFilter === 'ALL'
                    ? 'bg-[#282a36] text-[#f4f3ef] border-[#f95721]'
                    : 'bg-[#121318] text-[#767887] border-[#22242e] hover:text-[#e0ded6]'
                }`}
              >
                ALL
              </button>
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSubjectFilter(sub.id)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                    subjectFilter === sub.id
                      ? 'bg-[#282a36] text-[#f4f3ef] border-[#f95721]'
                      : 'bg-[#121318] text-[#767887] border-[#22242e] hover:text-[#e0ded6]'
                  }`}
                >
                  {sub.name.slice(0, 7).toUpperCase()}
                </button>
              ))}
            </>
          )}

          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7d8d]">
            STATUS:
          </span>
          {(['ALL', 'SOLVED', 'PENDING'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                statusFilter === st
                  ? 'bg-[#f95721] text-white border-[#f95721] font-semibold'
                  : 'bg-[#121318] text-[#8c8a83] border-[#22242e] hover:text-[#f4f3ef]'
              }`}
            >
              {st}
            </button>
          ))}

          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7d8d] ml-2">
            DIFF:
          </span>
          {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                difficultyFilter === diff
                  ? 'bg-[#282a36] text-[#f4f3ef] border-[#f95721]'
                  : 'bg-[#121318] text-[#767887] border-[#22242e] hover:text-[#e0ded6]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#16171c] border border-dashed border-[#262832]">
            <p className="font-mono text-sm text-[#8c8a83]">
              No problems match your current filter criteria.
            </p>
            <button
              onClick={onOpenAddProblem}
              className="mt-3 px-4 py-2 rounded-lg bg-[#1e2029] hover:bg-[#252834] text-[#f4f3ef] font-mono text-xs uppercase tracking-wider border border-[#2e3140] cursor-pointer"
            >
              + Add New Problem Now
            </button>
          </div>
        ) : (
          filteredProblems.map((prob) => (
            <div
              key={prob.id}
              id={`problem-row-${prob.id}`}
              className="p-5 rounded-2xl bg-[#16171c] border border-[#262832] hover:border-[#353846] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded border font-semibold ${getDifficultyBadge(prob.difficulty)}`}>
                    {prob.difficulty}
                  </span>

                  <span className="font-mono text-[10px] text-[#8c8a83] bg-[#121318] px-2 py-0.5 rounded border border-[#20222a]">
                    {prob.topic}
                  </span>

                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded border font-semibold ${
                      prob.status === 'SOLVED'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                        : 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                    }`}
                  >
                    {prob.status}
                  </span>

                  <span className="font-mono text-[10px] text-[#717382]">
                    ADDED: {prob.dateAdded}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <h3 className="font-sans text-base font-bold text-[#f4f3ef]">
                    {prob.title}
                  </h3>
                  {prob.url && (
                    <a
                      href={prob.url}
                      target="_blank"
                      rel="noreferrer"
                      title="Open problem link"
                      className="text-[#8c8a83] hover:text-[#f95721] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {prob.notes && (
                  <div className="text-xs font-sans text-[#a7a59d] bg-[#121317] p-2 rounded-xl border border-[#202229]">
                    <span className="font-mono text-[9px] text-[#f95721] font-semibold mr-1.5">
                      KEY TAKEAWAY:
                    </span>
                    <span>{prob.notes}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => toggleProblemSolved(prob.id)}
                  className={`
                    px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-all cursor-pointer
                    ${
                      prob.status === 'SOLVED'
                        ? 'bg-[#18231e] text-emerald-400 border border-emerald-800/40 hover:bg-emerald-950/60'
                        : 'bg-[#f95721] hover:bg-[#ff6938] text-white shadow-[0_0_12px_rgba(249,87,33,0.35)]'
                    }
                  `}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{prob.status === 'SOLVED' ? 'SOLVED ✓' : 'MARK SOLVED'}</span>
                </button>

                <button
                  onClick={() => deleteProblem(prob.id)}
                  title="Delete problem"
                  className="p-2 rounded-xl text-[#676977] hover:text-red-400 hover:bg-[#201518] border border-transparent hover:border-red-900/30 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
