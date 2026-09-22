export type SubjectId = string;

export type VideoStatus = 'UNWATCHED' | 'WATCHED' | 'REVISION' | 'MASTERED';

export type RevisionLevel = 0 | 1 | 2 | 3 | 'MASTERED';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type NoteCategory = 
  | 'KEY CONCEPT' 
  | 'CODE PATTERN' 
  | 'IMPORTANT' 
  | 'MISTAKE' 
  | 'INTERVIEW INSIGHT' 
  | 'PERSONAL EXPLANATION';

export interface VideoNote {
  id: string;
  category: NoteCategory;
  content: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  title: string;
  subjectId: SubjectId;
  topicId: string;
  sourceUrl?: string;
  difficulty: DifficultyLevel;
  status: VideoStatus;
  watchedDate?: string;
  revisionLevel: RevisionLevel;
  notes?: string;
  noteCategory?: NoteCategory;
  durationMinutes?: number;
}

export interface Topic {
  id: string;
  number: string;
  title: string;
  subjectId: SubjectId;
  totalVideos: number;
  description?: string;
}

export interface Subject {
  id: SubjectId;
  code: string;
  name: string;
  targetVideos?: number;
  currentTopic?: string;
  lastActive?: string;
  description?: string;
  color?: string;
}

export interface Problem {
  id: string;
  title: string;
  topic: string;
  subjectId: SubjectId;
  difficulty: DifficultyLevel;
  status: 'SOLVED' | 'PENDING';
  dateAdded: string;
  dateSolved?: string;
  url?: string;
  notes?: string;
}

export interface ActivityTransmission {
  id: string;
  date: string;
  videoTitle: string;
  subjectCode: string;
  topicTitle: string;
  action: 'WATCHED' | 'REVISED' | 'MASTERED';
}

export interface TelemetrySummary {
  totalVideosWatched: number;
  totalStudyHours: number;
  currentStreak: number;
  revisionPending: number;
  problemsSolved: number;
}

export type ActiveTab = 
  | 'OVERVIEW' 
  | 'SUBJECT_DETAIL'
  | 'REVISION' 
  | 'WATCH LOG' 
  | 'PROBLEMS' 
  | 'NOTES' 
  | 'TELEMETRY';

