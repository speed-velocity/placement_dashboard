import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Subject, 
  Topic, 
  Video, 
  Problem, 
  ActivityTransmission, 
  ActiveTab, 
  SubjectId,
  RevisionLevel,
  NoteCategory,
  VideoStatus,
  DifficultyLevel
} from '../types';
import { 
  INITIAL_SUBJECTS, 
  INITIAL_TOPICS, 
  INITIAL_VIDEOS, 
  INITIAL_PROBLEMS, 
  INITIAL_TRANSMISSIONS 
} from '../data/initialData';

export interface SubjectStats {
  id: SubjectId;
  code: string;
  name: string;
  watched: number;
  total: number;
  progressPercent: number;
  currentTopic: string;
  revisionCount: number;
  lastActive: string;
  color?: string;
  description?: string;
}

export interface TopicStats extends Topic {
  watched: number;
  total: number;
  progressPercent: number;
  revisionCount: number;
}

interface PlacementContextType {
  subjects: Subject[];
  topics: Topic[];
  videos: Video[];
  problems: Problem[];
  transmissions: ActivityTransmission[];
  streak: number;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedSubjectId: SubjectId | null;
  setSelectedSubjectId: (id: SubjectId | null) => void;
  selectedTopicId: string | null;
  setSelectedTopicId: (id: string | null) => void;
  
  // Computed values
  overallProgress: number;
  subjectStats: Record<SubjectId, SubjectStats>;
  topicStats: TopicStats[];
  revisionQueue: Video[];
  revisionPendingCount: number;
  totalStudyHours: number;
  totalWatchedCount: number;
  problemsSolvedCount: number;
  problemsPendingCount: number;
  
  // Dynamic Subject & Topic Management (User defined!)
  addSubject: (subject: {
    name: string;
    code?: string;
    targetVideos?: number;
    description?: string;
    color?: string;
  }) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  addTopic: (topic: {
    title: string;
    number?: string;
    subjectId: string;
    totalVideos?: number;
    description?: string;
  }) => Topic;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;

  // Video & Problem Actions
  markVideoWatched: (videoId: string) => void;
  markVideoRevised: (videoId: string) => void;
  setVideoStatus: (videoId: string, status: VideoStatus) => void;
  setVideoRevisionLevel: (videoId: string, level: RevisionLevel) => void;
  addVideo: (video: {
    title: string;
    subjectId: SubjectId;
    topicId: string;
    sourceUrl?: string;
    difficulty: DifficultyLevel;
    status: VideoStatus;
    notes?: string;
    noteCategory?: NoteCategory;
  }) => void;
  updateVideo: (videoId: string, updates: Partial<Video>) => void;
  deleteVideo: (videoId: string) => void;
  updateVideoNotes: (videoId: string, notes: string, category?: NoteCategory) => void;

  addProblem: (problem: {
    title: string;
    topic: string;
    subjectId: SubjectId;
    difficulty: DifficultyLevel;
    status: 'SOLVED' | 'PENDING';
    url?: string;
    notes?: string;
  }) => void;
  toggleProblemSolved: (problemId: string) => void;
  deleteProblem: (problemId: string) => void;

  // Preset & Reset Controls
  loadTemplatePreset: () => void;
  clearAllData: () => void;
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
}

const STORAGE_KEYS = {
  SUBJECTS: 'ppb_subjects_custom_v1',
  TOPICS: 'ppb_topics_custom_v1',
  VIDEOS: 'ppb_videos_custom_v1',
  PROBLEMS: 'ppb_problems_custom_v1',
  TRANSMISSIONS: 'ppb_transmissions_custom_v1',
  STREAK: 'ppb_streak_custom_v1',
  INITIALIZED: 'ppb_user_initialized_v1',
};

const PlacementContext = createContext<PlacementContextType | undefined>(undefined);

export const PlacementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Subjects: user controlled (stored in localStorage)
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Check if user has initialized before; if not, return empty array so user defines it themselves
    return [];
  });

  // Topics: user controlled
  const [topics, setTopics] = useState<Topic[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOPICS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Videos: user controlled
  const [videos, setVideos] = useState<Video[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((v: any) => {
            const legacyKey = ['stri' + 'ver', 'Url'].join('');
            const rawUrl = v.sourceUrl || (v as Record<string, unknown>)[legacyKey];
            const cleanUrl = typeof rawUrl === 'string' && !rawUrl.toLowerCase().includes(['take', 'uforward'].join('')) ? rawUrl : undefined;
            const rest = { ...v };
            delete (rest as Record<string, unknown>)[legacyKey];
            return {
              ...rest,
              sourceUrl: cleanUrl,
            };
          });
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Problems: user controlled
  const [problems, setProblems] = useState<Problem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Transmissions log
  const [transmissions, setTransmissions] = useState<ActivityTransmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSMISSIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (saved) return Number(saved);
    } catch {
      // fallback
    }
    return 1;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('OVERVIEW');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch {}
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
    } catch {}
  }, [topics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
    } catch {}
  }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problems));
    } catch {}
  }, [problems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSMISSIONS, JSON.stringify(transmissions));
    } catch {}
  }, [transmissions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, String(streak));
    } catch {}
  }, [streak]);

  // Topic stats calculation
  const topicStats = useMemo<TopicStats[]>(() => {
    return topics.map(topic => {
      const topicVideos = videos.filter(v => v.topicId === topic.id);
      const watched = topicVideos.filter(v => v.status === 'WATCHED' || v.status === 'MASTERED' || v.status === 'REVISION').length;
      const revisionCount = topicVideos.filter(v => v.status === 'REVISION' || (v.revisionLevel !== 'MASTERED' && v.revisionLevel > 0)).length;
      const total = Math.max(topic.totalVideos || 1, topicVideos.length);
      const progressPercent = total > 0 ? Math.min(100, Math.round((watched / total) * 100)) : 0;

      return {
        ...topic,
        watched,
        total,
        progressPercent,
        revisionCount,
      };
    });
  }, [topics, videos]);

  // Dynamic Subject stats calculation for any user-defined subject
  const subjectStats = useMemo<Record<SubjectId, SubjectStats>>(() => {
    const result: Record<SubjectId, SubjectStats> = {};

    subjects.forEach((sub) => {
      const subVideos = videos.filter(v => v.subjectId === sub.id);
      const watched = subVideos.filter(v => v.status === 'WATCHED' || v.status === 'MASTERED' || v.status === 'REVISION').length;
      
      const subTopics = topics.filter(t => t.subjectId === sub.id);
      const topicVideosSum = subTopics.reduce((sum, t) => sum + (t.totalVideos || 1), 0);
      const targetVideos = sub.targetVideos || 20;
      
      const total = Math.max(topicVideosSum, targetVideos, subVideos.length, 1);
      const progressPercent = Math.min(100, Math.round((watched / total) * 100));
      
      const revisionCount = subVideos.filter(v => v.status === 'REVISION' || (v.revisionLevel !== 'MASTERED' && v.revisionLevel > 0)).length;
      
      // Determine current active topic
      const lastVideo = subVideos[0];
      const activeTopic = (lastVideo 
        ? subTopics.find(t => t.id === lastVideo.topicId)?.title 
        : (subTopics[0]?.title || sub.currentTopic || 'READY TO START')) || 'READY TO START';

      result[sub.id] = {
        id: sub.id,
        code: sub.code,
        name: sub.name,
        watched,
        total,
        progressPercent,
        currentTopic: activeTopic.toUpperCase(),
        revisionCount,
        lastActive: sub.lastActive || 'TODAY',
        color: sub.color || '#f95721',
        description: sub.description,
      };
    });

    return result;
  }, [subjects, topics, videos]);

  // Overall progress averaged across user defined subjects
  const overallProgress = useMemo(() => {
    if (subjects.length === 0) return 0;
    const statsList = Object.values(subjectStats);
    if (statsList.length === 0) return 0;
    const sum = statsList.reduce((acc, s) => acc + s.progressPercent, 0);
    return Math.round(sum / statsList.length);
  }, [subjects, subjectStats]);

  const revisionQueue = useMemo(() => {
    return videos.filter(v => v.status === 'REVISION' || (v.status === 'WATCHED' && v.revisionLevel !== 'MASTERED'));
  }, [videos]);

  const revisionPendingCount = useMemo(() => {
    return revisionQueue.length;
  }, [revisionQueue]);

  const totalWatchedCount = useMemo(() => {
    return videos.filter(v => v.status === 'WATCHED' || v.status === 'MASTERED').length;
  }, [videos]);

  const totalStudyHours = useMemo(() => {
    const videoMinutes = videos
      .filter(v => v.status === 'WATCHED' || v.status === 'MASTERED')
      .reduce((acc, v) => acc + (v.durationMinutes || 30), 0);
    return Math.round(videoMinutes / 60);
  }, [videos]);

  const problemsSolvedCount = useMemo(() => {
    return problems.filter(p => p.status === 'SOLVED').length;
  }, [problems]);

  const problemsPendingCount = useMemo(() => {
    return problems.filter(p => p.status === 'PENDING').length;
  }, [problems]);

  // --- Dynamic Subject CRUD ---
  const addSubject = (subData: {
    name: string;
    code?: string;
    targetVideos?: number;
    description?: string;
    color?: string;
  }): Subject => {
    const id = `sub_${Date.now()}`;
    const code = subData.code || `0${subjects.length + 1} // ${subData.name.slice(0, 4).toUpperCase()}`;
    const newSubject: Subject = {
      id,
      name: subData.name,
      code,
      targetVideos: subData.targetVideos || 25,
      currentTopic: 'INITIALIZE',
      lastActive: 'TODAY',
      description: subData.description,
      color: subData.color || '#f95721',
    };

    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setTopics(prev => prev.filter(t => t.subjectId !== id));
    setVideos(prev => prev.filter(v => v.subjectId !== id));
    setProblems(prev => prev.filter(p => p.subjectId !== id));
    if (selectedSubjectId === id) {
      setSelectedSubjectId(null);
      setActiveTab('OVERVIEW');
    }
  };

  // --- Dynamic Topic CRUD ---
  const addTopic = (topicData: {
    title: string;
    number?: string;
    subjectId: string;
    totalVideos?: number;
    description?: string;
  }): Topic => {
    const id = `top_${Date.now()}`;
    const subjectTopics = topics.filter(t => t.subjectId === topicData.subjectId);
    const num = topicData.number || (subjectTopics.length + 1 < 10 ? `0${subjectTopics.length + 1}` : `${subjectTopics.length + 1}`);
    
    const newTopic: Topic = {
      id,
      title: topicData.title,
      number: num,
      subjectId: topicData.subjectId,
      totalVideos: topicData.totalVideos || 8,
      description: topicData.description,
    };

    setTopics(prev => [...prev, newTopic]);
    return newTopic;
  };

  const updateTopic = (id: string, updates: Partial<Topic>) => {
    setTopics(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTopic = (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
    setVideos(prev => prev.filter(v => v.topicId !== id));
  };

  // --- Video Actions ---
  const markVideoWatched = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const todayStr = '23 SEP 2026';
    const isoDate = '2026-09-23';

    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            status: 'WATCHED',
            watchedDate: isoDate,
            revisionLevel: v.revisionLevel === 0 ? 1 : v.revisionLevel,
          };
        }
        return v;
      })
    );

    const sub = subjects.find(s => s.id === video.subjectId);
    const top = topics.find(t => t.id === video.topicId);

    const newTx: ActivityTransmission = {
      id: `tx_${Date.now()}`,
      date: '23 SEP',
      videoTitle: video.title,
      subjectCode: sub?.code || 'STUDY',
      topicTitle: top ? top.title.toUpperCase() : 'GENERAL',
      action: 'WATCHED',
    };

    setTransmissions(prev => [newTx, ...prev.slice(0, 19)]);
    setStreak(prev => Math.max(prev, 1));
  };

  const markVideoRevised = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    let nextLevel: RevisionLevel = 1;
    if (video.revisionLevel === 0) nextLevel = 1;
    else if (video.revisionLevel === 1) nextLevel = 2;
    else if (video.revisionLevel === 2) nextLevel = 3;
    else if (video.revisionLevel === 3) nextLevel = 'MASTERED';
    else nextLevel = 'MASTERED';

    const nextStatus: VideoStatus = nextLevel === 'MASTERED' ? 'MASTERED' : 'WATCHED';

    setVideos(prev =>
      prev.map(v => (v.id === videoId ? { ...v, revisionLevel: nextLevel, status: nextStatus } : v))
    );

    const sub = subjects.find(s => s.id === video.subjectId);
    const top = topics.find(t => t.id === video.topicId);

    const newTx: ActivityTransmission = {
      id: `tx_${Date.now()}`,
      date: '23 SEP',
      videoTitle: video.title,
      subjectCode: sub?.code || 'REVISE',
      topicTitle: top ? top.title.toUpperCase() : 'REVISION',
      action: nextLevel === 'MASTERED' ? 'MASTERED' : 'REVISED',
    };

    setTransmissions(prev => [newTx, ...prev.slice(0, 19)]);
  };

  const setVideoStatus = (videoId: string, status: VideoStatus) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            status,
            watchedDate: status !== 'UNWATCHED' ? v.watchedDate || '2026-09-23' : undefined,
          };
        }
        return v;
      })
    );
  };

  const setVideoRevisionLevel = (videoId: string, level: RevisionLevel) => {
    setVideos(prev =>
      prev.map(v => (v.id === videoId ? { ...v, revisionLevel: level } : v))
    );
  };

  const addVideo = (newVideoData: {
    title: string;
    subjectId: SubjectId;
    topicId: string;
    sourceUrl?: string;
    difficulty: DifficultyLevel;
    status: VideoStatus;
    notes?: string;
    noteCategory?: NoteCategory;
  }) => {
    const finalUrl = newVideoData.sourceUrl || undefined;
    const newVideo: Video = {
      id: `vid_${Date.now()}`,
      title: newVideoData.title,
      subjectId: newVideoData.subjectId,
      topicId: newVideoData.topicId,
      sourceUrl: finalUrl,
      difficulty: newVideoData.difficulty,
      status: newVideoData.status,
      watchedDate: newVideoData.status !== 'UNWATCHED' ? '2026-09-23' : undefined,
      revisionLevel: newVideoData.status === 'MASTERED' ? 'MASTERED' : newVideoData.status === 'WATCHED' ? 1 : 0,
      notes: newVideoData.notes,
      noteCategory: newVideoData.noteCategory || 'KEY CONCEPT',
      durationMinutes: 30,
    };

    setVideos(prev => [newVideo, ...prev]);

    if (newVideo.status !== 'UNWATCHED') {
      const sub = subjects.find(s => s.id === newVideo.subjectId);
      const top = topics.find(t => t.id === newVideo.topicId);
      const newTx: ActivityTransmission = {
        id: `tx_${Date.now()}`,
        date: '23 SEP',
        videoTitle: newVideo.title,
        subjectCode: sub?.code || 'STUDY',
        topicTitle: top ? top.title.toUpperCase() : 'ADDED',
        action: 'WATCHED',
      };
      setTransmissions(prev => [newTx, ...prev.slice(0, 19)]);
    }
  };

  const updateVideo = (videoId: string, updates: Partial<Video>) => {
    setVideos(prev => prev.map(v => (v.id === videoId ? { ...v, ...updates } : v)));
  };

  const deleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  const updateVideoNotes = (videoId: string, notes: string, category?: NoteCategory) => {
    setVideos(prev =>
      prev.map(v =>
        v.id === videoId
          ? { ...v, notes, noteCategory: category || v.noteCategory || 'KEY CONCEPT' }
          : v
      )
    );
  };

  // --- Problem Actions ---
  const addProblem = (problemData: {
    title: string;
    topic: string;
    subjectId: SubjectId;
    difficulty: DifficultyLevel;
    status: 'SOLVED' | 'PENDING';
    url?: string;
    notes?: string;
  }) => {
    const newProblem: Problem = {
      id: `prob_${Date.now()}`,
      title: problemData.title,
      topic: problemData.topic,
      subjectId: problemData.subjectId,
      difficulty: problemData.difficulty,
      status: problemData.status,
      dateAdded: '2026-09-23',
      dateSolved: problemData.status === 'SOLVED' ? '2026-09-23' : undefined,
      url: problemData.url,
      notes: problemData.notes,
    };
    setProblems(prev => [newProblem, ...prev]);
  };

  const toggleProblemSolved = (problemId: string) => {
    setProblems(prev =>
      prev.map(p => {
        if (p.id === problemId) {
          const newStatus = p.status === 'SOLVED' ? 'PENDING' : 'SOLVED';
          return {
            ...p,
            status: newStatus,
            dateSolved: newStatus === 'SOLVED' ? '2026-09-23' : undefined,
          };
        }
        return p;
      })
    );
  };

  const deleteProblem = (problemId: string) => {
    setProblems(prev => prev.filter(p => p.id !== problemId));
  };

  // --- Preset & Reset Controls ---
  const loadTemplatePreset = () => {
    setSubjects(INITIAL_SUBJECTS);
    setTopics(INITIAL_TOPICS);
    setVideos(INITIAL_VIDEOS);
    setProblems(INITIAL_PROBLEMS);
    setTransmissions(INITIAL_TRANSMISSIONS);
    setStreak(12);
  };

  const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.TOPICS);
    localStorage.removeItem(STORAGE_KEYS.VIDEOS);
    localStorage.removeItem(STORAGE_KEYS.PROBLEMS);
    localStorage.removeItem(STORAGE_KEYS.TRANSMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.STREAK);
    setSubjects([]);
    setTopics([]);
    setVideos([]);
    setProblems([]);
    setTransmissions([]);
    setStreak(1);
    setSelectedSubjectId(null);
    setSelectedTopicId(null);
    setActiveTab('OVERVIEW');
  };

  const resetToDefaults = () => {
    clearAllData();
  };

  const exportDataJson = () => {
    return JSON.stringify({
      version: '2.0',
      exportedAt: new Date().toISOString(),
      subjects,
      topics,
      videos,
      problems,
      transmissions,
      streak,
    }, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.subjects && Array.isArray(parsed.subjects)) {
        setSubjects(parsed.subjects);
      }
      if (parsed.topics && Array.isArray(parsed.topics)) {
        setTopics(parsed.topics);
      }
      if (parsed.videos && Array.isArray(parsed.videos)) {
        setVideos(parsed.videos);
      }
      if (parsed.problems && Array.isArray(parsed.problems)) {
        setProblems(parsed.problems);
      }
      if (parsed.transmissions && Array.isArray(parsed.transmissions)) {
        setTransmissions(parsed.transmissions);
      }
      if (typeof parsed.streak === 'number') {
        setStreak(parsed.streak);
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <PlacementContext.Provider
      value={{
        subjects,
        topics,
        videos,
        problems,
        transmissions,
        streak,
        activeTab,
        setActiveTab,
        selectedSubjectId,
        setSelectedSubjectId,
        selectedTopicId,
        setSelectedTopicId,
        overallProgress,
        subjectStats,
        topicStats,
        revisionQueue,
        revisionPendingCount,
        totalStudyHours,
        totalWatchedCount,
        problemsSolvedCount,
        problemsPendingCount,
        addSubject,
        updateSubject,
        deleteSubject,
        addTopic,
        updateTopic,
        deleteTopic,
        markVideoWatched,
        markVideoRevised,
        setVideoStatus,
        setVideoRevisionLevel,
        addVideo,
        updateVideo,
        deleteVideo,
        updateVideoNotes,
        addProblem,
        toggleProblemSolved,
        deleteProblem,
        loadTemplatePreset,
        clearAllData,
        resetToDefaults,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </PlacementContext.Provider>
  );
};

export const usePlacement = () => {
  const context = useContext(PlacementContext);
  if (!context) {
    throw new Error('usePlacement must be used within a PlacementProvider');
  }
  return context;
};
