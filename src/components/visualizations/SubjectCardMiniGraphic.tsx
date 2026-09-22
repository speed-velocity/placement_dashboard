import React from 'react';
import { SubjectId } from '../../types';

interface SubjectCardMiniGraphicProps {
  subjectId: SubjectId;
  progressPercent: number;
  color?: string;
}

export const SubjectCardMiniGraphic: React.FC<SubjectCardMiniGraphicProps> = ({
  subjectId,
  progressPercent,
  color = '#f95721',
}) => {
  const normId = subjectId.toLowerCase();

  // DSA: Dotted matrix / network graph
  if (normId === 'dsa' || normId.includes('dsa') || normId.includes('algo')) {
    return (
      <div className="w-24 h-12 flex items-center justify-center relative">
        <svg width="90" height="42" viewBox="0 0 90 42" className="overflow-visible">
          <line x1="5" y1="21" x2="85" y2="21" stroke="#252730" strokeWidth="1" strokeDasharray="2 3" />
          <path d="M 12 28 L 30 12 L 52 26 L 76 10" fill="none" stroke="#2c2e39" strokeWidth="1.2" />
          <path
            d="M 12 28 L 30 12 L 52 26"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="40"
            strokeDashoffset={progressPercent > 50 ? '0' : '20'}
          />
          <circle cx="12" cy="28" r="3" fill={color} />
          <circle cx="30" cy="12" r="3.5" fill={color} />
          <circle cx="52" cy="26" r="3" fill={progressPercent >= 60 ? color : '#323440'} />
          <circle cx="76" cy="10" r="3" fill={progressPercent >= 80 ? color : '#272932'} />
          <circle cx="30" cy="32" r="1.8" fill="#3a3d4c" />
          <circle cx="68" cy="30" r="1.8" fill="#3a3d4c" />
        </svg>
      </div>
    );
  }

  // OOPS: Stacked modular blocks
  if (normId === 'oops' || normId.includes('oop') || normId.includes('object')) {
    return (
      <div className="w-24 h-12 flex items-center justify-center relative">
        <svg width="90" height="42" viewBox="0 0 90 42" className="overflow-visible">
          <rect x="8" y="24" width="74" height="12" rx="2" fill="#1b1d24" stroke="#2c2e39" strokeWidth="1" />
          <rect x="8" y="24" width="56" height="12" rx="2" fill="rgba(249,87,33,0.18)" stroke={color} strokeWidth="1" />
          <rect x="14" y="10" width="30" height="10" rx="2" fill="#1b1d24" stroke={color} strokeWidth="1" />
          <rect x="48" y="10" width="30" height="10" rx="2" fill="#1b1d24" stroke="#323542" strokeWidth="1" />
          <line x1="29" y1="20" x2="29" y2="24" stroke={color} strokeWidth="1.2" />
          <line x1="63" y1="20" x2="63" y2="24" stroke="#323542" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  // DBMS: Relational table node
  if (normId === 'dbms' || normId.includes('sql') || normId.includes('database')) {
    return (
      <div className="w-24 h-12 flex items-center justify-center relative">
        <svg width="90" height="42" viewBox="0 0 90 42" className="overflow-visible">
          <rect x="6" y="8" width="32" height="26" rx="2" fill="#181a20" stroke="#2c2e39" strokeWidth="1" />
          <line x1="6" y1="16" x2="38" y2="16" stroke={color} strokeWidth="1" />
          <circle cx="12" cy="22" r="1.5" fill={color} />
          <circle cx="12" cy="28" r="1.5" fill="#434656" />
          <path d="M 38 22 C 46 22, 46 16, 52 16" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
          <rect x="52" y="8" width="32" height="26" rx="2" fill="#181a20" stroke="#2c2e39" strokeWidth="1" />
          <line x1="52" y1="16" x2="84" y2="16" stroke="#383b4a" strokeWidth="1" />
          <circle cx="58" cy="22" r="1.5" fill={color} />
          <circle cx="58" cy="28" r="1.5" fill="#434656" />
        </svg>
      </div>
    );
  }

  // Generic technical instrumentation graphic (custom user-defined subjects)
  const filledBars = Math.min(6, Math.max(1, Math.round((progressPercent / 100) * 6)));

  return (
    <div className="w-24 h-12 flex items-center justify-center relative">
      <svg width="90" height="42" viewBox="0 0 90 42" className="overflow-visible">
        {/* Subtle grid line */}
        <line x1="8" y1="34" x2="82" y2="34" stroke="#252730" strokeWidth="1" strokeDasharray="2 2" />
        
        {/* Metric spectrum bars */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 12 + i * 12;
          const barHeight = 8 + (i % 3) * 6 + ((i * 3) % 7);
          const isFilled = i < filledBars;
          return (
            <g key={i}>
              <rect
                x={x}
                y={32 - barHeight}
                width="6"
                height={barHeight}
                rx="1.5"
                fill={isFilled ? color : '#1e2029'}
                stroke={isFilled ? color : '#2c2e3a'}
                strokeWidth="1"
                opacity={isFilled ? 0.9 : 0.4}
              />
              <circle
                cx={x + 3}
                cy={10}
                r="1.5"
                fill={isFilled ? color : '#2e313f'}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
