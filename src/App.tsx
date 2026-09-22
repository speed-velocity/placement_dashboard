import React, { useState } from 'react';
import { PlacementProvider, usePlacement } from './context/PlacementContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { OverviewView } from './components/views/OverviewView';
import { SubjectDetailView } from './components/views/SubjectDetailView';
import { WatchLogView } from './components/views/WatchLogView';
import { RevisionView } from './components/views/RevisionView';
import { ProblemsView } from './components/views/ProblemsView';
import { NotesView } from './components/views/NotesView';
import { TelemetryView } from './components/views/TelemetryView';
import { AddVideoModal } from './components/modals/AddVideoModal';
import { AddProblemModal } from './components/modals/AddProblemModal';
import { NoteModal } from './components/modals/NoteModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { SubjectModal } from './components/modals/SubjectModal';
import { TopicModal } from './components/modals/TopicModal';
import { SubjectId, Topic, Subject } from './types';

function MainLayout() {
  const { 
    activeTab, 
    selectedSubjectId, 
    subjects, 
    topics 
  } = usePlacement();
  
  const [mobileOpen, setMobileOpen] = useState(false);

  // Modal States
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [addVideoDefaults, setAddVideoDefaults] = useState<{ topicId?: string; subjectId?: SubjectId }>({});
  const [isAddProblemOpen, setIsAddProblemOpen] = useState(false);
  const [activeNoteVideoId, setActiveNoteVideoId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dynamic Subject & Topic Modals
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [topicModalSubjectId, setTopicModalSubjectId] = useState<string>('');
  const [topicToEdit, setTopicToEdit] = useState<Topic | null>(null);

  const handleOpenAddVideoWithTopic = (topicId: string, subjectId: SubjectId) => {
    setAddVideoDefaults({ topicId, subjectId });
    setIsAddVideoOpen(true);
  };

  const handleOpenGeneralAddVideo = () => {
    const activeSub = selectedSubjectId || subjects[0]?.id || '';
    setAddVideoDefaults({
      subjectId: activeSub,
    });
    setIsAddVideoOpen(true);
  };

  const handleOpenNotes = (videoId: string) => {
    setActiveNoteVideoId(videoId);
  };

  const handleOpenAddSubject = () => {
    setSubjectToEdit(null);
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (subjectId: string) => {
    const found = subjects.find(s => s.id === subjectId) || null;
    setSubjectToEdit(found);
    setIsSubjectModalOpen(true);
  };

  const handleOpenAddTopic = (subjectId: string) => {
    setTopicModalSubjectId(subjectId);
    setTopicToEdit(null);
    setIsTopicModalOpen(true);
  };

  const handleOpenEditTopic = (topic: Topic) => {
    setTopicModalSubjectId(topic.subjectId);
    setTopicToEdit(topic);
    setIsTopicModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] ambient-glow-top-left text-[#f4f3ef] font-sans antialiased flex flex-col">
      {/* Sidebar navigation */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        onOpenAddSubject={handleOpenAddSubject}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <TopHeader
          onOpenAddVideo={handleOpenGeneralAddVideo}
          onOpenSettings={() => setIsSettingsOpen(true)}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Active Tab View Switching */}
          {activeTab === 'OVERVIEW' && (
            <OverviewView 
              onOpenAddSubject={handleOpenAddSubject}
            />
          )}

          {activeTab === 'SUBJECT_DETAIL' && selectedSubjectId && (
            <SubjectDetailView
              subjectId={selectedSubjectId}
              onOpenAddVideoWithTopic={handleOpenAddVideoWithTopic}
              onOpenNotes={handleOpenNotes}
              onOpenEditSubject={handleOpenEditSubject}
              onOpenAddTopic={handleOpenAddTopic}
              onOpenEditTopic={handleOpenEditTopic}
            />
          )}

          {activeTab === 'WATCH LOG' && (
            <WatchLogView
              onOpenAddVideo={handleOpenGeneralAddVideo}
              onOpenNotes={handleOpenNotes}
            />
          )}

          {activeTab === 'REVISION' && (
            <RevisionView onOpenNotes={handleOpenNotes} />
          )}

          {activeTab === 'PROBLEMS' && (
            <ProblemsView onOpenAddProblem={() => setIsAddProblemOpen(true)} />
          )}

          {activeTab === 'NOTES' && (
            <NotesView onOpenNotes={handleOpenNotes} />
          )}

          {activeTab === 'TELEMETRY' && <TelemetryView />}
        </main>
      </div>

      {/* Global Modals */}
      <AddVideoModal
        isOpen={isAddVideoOpen}
        onClose={() => setIsAddVideoOpen(false)}
        defaultTopicId={addVideoDefaults.topicId}
        defaultSubjectId={addVideoDefaults.subjectId}
        onOpenAddSubject={handleOpenAddSubject}
      />

      <AddProblemModal
        isOpen={isAddProblemOpen}
        onClose={() => setIsAddProblemOpen(false)}
        defaultSubjectId={addVideoDefaults.subjectId}
      />

      <NoteModal
        isOpen={Boolean(activeNoteVideoId)}
        videoId={activeNoteVideoId}
        onClose={() => setActiveNoteVideoId(null)}
      />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => {
          setIsSubjectModalOpen(false);
          setSubjectToEdit(null);
        }}
        subjectToEdit={subjectToEdit}
      />

      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => {
          setIsTopicModalOpen(false);
          setTopicToEdit(null);
        }}
        defaultSubjectId={topicModalSubjectId}
        topicToEdit={topicToEdit}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenAddSubject={handleOpenAddSubject}
        onOpenEditSubject={handleOpenEditSubject}
      />
    </div>
  );
}

export default function App() {
  return (
    <PlacementProvider>
      <MainLayout />
    </PlacementProvider>
  );
}
