import React from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { SubjectCardMiniGraphic } from '../visualizations/SubjectCardMiniGraphic';
import { SubjectId } from '../../types';
import { Plus, ChevronRight, BookOpen } from 'lucide-react';

interface CoreSubjectCardsProps {
  onOpenAddSubject?: () => void;
}

export const CoreSubjectCards: React.FC<CoreSubjectCardsProps> = ({ onOpenAddSubject }) => {
  const { subjects, subjectStats, setActiveTab, setSelectedSubjectId } = usePlacement();

  const handleCardClick = (id: SubjectId) => {
    setSelectedSubjectId(id);
    setActiveTab('SUBJECT_DETAIL');
  };

  return (
    <section id="core-subject-cards" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#f95721] rounded-xs" />
          <h3 className="font-mono text-xs font-semibold tracking-[0.2em] text-[#f4f3ef] uppercase">
            ACTIVE SUBJECT TRACKS // {subjects.length < 10 ? `0${subjects.length}` : subjects.length} MODULES
          </h3>
        </div>
        
        {onOpenAddSubject && (
          <button
            onClick={onOpenAddSubject}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#1a1b22] hover:bg-[#232530] text-[#f95721] hover:text-[#ff6b3d] font-mono text-[10px] uppercase tracking-wider border border-[#2b2e3b] transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>+ DEFINE NEW SUBJECT</span>
          </button>
        )}
      </div>

      {subjects.length === 0 ? (
        <div 
          onClick={onOpenAddSubject}
          className="p-8 rounded-2xl bg-[#16171c] border border-dashed border-[#2b2e3a] hover:border-[#f95721]/50 text-center cursor-pointer transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#1e2029] border border-[#2b2d3a] flex items-center justify-center mx-auto mb-3 group-hover:border-[#f95721] transition-colors">
            <Plus className="w-6 h-6 text-[#f95721]" />
          </div>
          <h4 className="font-sans text-base font-bold text-[#f4f3ef] group-hover:text-[#f95721] transition-colors">
            No Subjects Defined Yet
          </h4>
          <p className="font-mono text-xs text-[#8c8a83] max-w-md mx-auto mt-1">
            Build your custom placement roadmap by defining your preparation subjects (e.g. DSA, Core CS, System Design, etc.). Click to add your first track!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {subjects.map((sub) => {
            const stats = subjectStats[sub.id] || {
              id: sub.id,
              code: sub.code,
              name: sub.name,
              watched: 0,
              total: sub.targetVideos || 25,
              progressPercent: 0,
              currentTopic: 'INITIALIZE',
              revisionCount: 0,
              lastActive: 'TODAY',
              color: sub.color || '#f95721',
            };

            return (
              <div
                key={sub.id}
                id={`subject-card-${sub.id}`}
                onClick={() => handleCardClick(sub.id)}
                className="
                  group relative p-5 rounded-2xl bg-[#16171c] border border-[#262832]
                  hover:border-[#f95721]/50 hover:bg-[#191b22] hover:-translate-y-0.5
                  transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.3)]
                  flex flex-col justify-between space-y-4
                "
              >
                {/* Card Header: Subject Code + Mini Graphic */}
                <div className="flex items-start justify-between">
                  <div className="pr-2">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#8c8a83] uppercase block truncate">
                      {stats.code}
                    </span>
                    <h4 className="font-sans text-base font-bold text-[#f4f3ef] group-hover:text-[#f95721] transition-colors mt-0.5 line-clamp-1">
                      {stats.name}
                    </h4>
                  </div>

                  {/* Dynamic Graphic */}
                  <div className="bg-[#121318] p-1.5 rounded-lg border border-[#22242e] group-hover:border-[#323544] transition-colors shrink-0">
                    <SubjectCardMiniGraphic subjectId={sub.id} progressPercent={stats.progressPercent} color={sub.color} />
                  </div>
                </div>

                {/* Card Body: Watched, Progress, Current Topic, Revision */}
                <div className="space-y-3 pt-2 border-t border-[#20222a]">
                  {/* Watched & Progress */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-[#131418] border border-[#1e2027]">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#737582] block">
                        WATCHED
                      </span>
                      <span className="font-mono text-sm font-semibold text-[#f4f3ef]">
                        {stats.watched} <span className="text-[#5f6170] text-xs font-normal">/ {stats.total}</span>
                      </span>
                    </div>

                    <div className="p-2 rounded bg-[#131418] border border-[#1e2027]">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#737582] block">
                        PROGRESS
                      </span>
                      <span className="font-mono text-sm font-bold text-[#f95721]">
                        {stats.progressPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Current Topic */}
                  <div className="p-2 rounded bg-[#131418] border border-[#1e2027]">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#737582] block">
                      CURRENT TOPIC
                    </span>
                    <span className="font-mono text-xs font-medium text-[#e2e0d8] truncate block">
                      {stats.currentTopic}
                    </span>
                  </div>

                  {/* Footer metadata */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#787a89] pt-1">
                    <span>REV: {stats.revisionCount} ITEMS</span>
                    <div className="flex items-center space-x-1 group-hover:text-[#f95721] transition-colors">
                      <span>EXPLORE</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Add Track Card */}
          {onOpenAddSubject && (
            <div
              onClick={onOpenAddSubject}
              className="
                p-5 rounded-2xl bg-[#131418]/60 border border-dashed border-[#232530]
                hover:border-[#f95721]/50 hover:bg-[#16171d] hover:-translate-y-0.5
                transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center min-h-[190px]
                group
              "
            >
              <div className="w-10 h-10 rounded-xl bg-[#1a1b22] border border-[#272a38] flex items-center justify-center mb-2 group-hover:border-[#f95721] transition-colors">
                <Plus className="w-5 h-5 text-[#8c8a83] group-hover:text-[#f95721] transition-colors" />
              </div>
              <span className="font-mono text-xs font-semibold text-[#f4f3ef] uppercase group-hover:text-[#f95721] transition-colors">
                + ADD SUBJECT
              </span>
              <span className="font-mono text-[10px] text-[#6b6d7a] mt-1">
                Define custom syllabus module
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
