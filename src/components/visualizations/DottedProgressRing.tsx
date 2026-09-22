import React from 'react';

interface DottedProgressRingProps {
  percentage: number;
  size?: number;
  totalSegments?: number;
  strokeWidth?: number;
}

export const DottedProgressRing: React.FC<DottedProgressRingProps> = ({
  percentage,
  size = 240,
  totalSegments = 54,
}) => {
  const radius = size / 2 - 24;
  const center = size / 2;
  const activeSegments = Math.round((percentage / 100) * totalSegments);

  const dots = Array.from({ length: totalSegments }, (_, i) => {
    // Start from top (-90 degrees)
    const angle = (i / totalSegments) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const x = center + radius * Math.cos(rad);
    const y = center + radius * Math.sin(rad);
    const isActive = i < activeSegments;

    return {
      id: i,
      x,
      y,
      isActive,
      angle,
    };
  });

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Subtle background radar ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1e2027"
          strokeWidth="1"
          strokeDasharray="2 4"
        />

        {/* Inner faint concentric reference circle */}
        <circle
          cx={center}
          cy={center}
          r={radius - 18}
          fill="none"
          stroke="#191a20"
          strokeWidth="1"
        />

        {/* Outer tick marks at cardinal directions */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = ((deg - 90) * Math.PI) / 180;
          const x1 = center + (radius + 8) * Math.cos(rad);
          const y1 = center + (radius + 8) * Math.sin(rad);
          const x2 = center + (radius + 14) * Math.cos(rad);
          const y2 = center + (radius + 14) * Math.sin(rad);
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#3a3c48"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Segmented Markers / Dotted Elements */}
        {dots.map((dot) => (
          <circle
            key={dot.id}
            cx={dot.x}
            cy={dot.y}
            r={dot.isActive ? 2.8 : 2}
            fill={dot.isActive ? '#f95721' : '#272932'}
            className="transition-all duration-300"
            style={{
              filter: dot.isActive ? 'drop-shadow(0 0 4px rgba(249, 87, 33, 0.45))' : 'none',
            }}
          />
        ))}

        {/* Central target crosshair dots */}
        <circle cx={center - 32} cy={center} r={1.2} fill="#3a3c48" />
        <circle cx={center + 32} cy={center} r={1.2} fill="#3a3c48" />
      </svg>

      {/* Center percentage and label display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#8c8a83] uppercase mb-1">
          PLACEMENT
        </span>
        <div className="flex items-baseline justify-center">
          <span className="text-5xl font-extrabold tracking-tight text-[#f4f3ef] font-sans">
            {percentage}
          </span>
          <span className="text-xl font-mono font-medium text-[#f95721] ml-1">
            %
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#8c8a83] uppercase mt-1">
          READY INDEX
        </span>
      </div>
    </div>
  );
};
