import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  ExternalLink, 
  Check, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit2, 
  Sparkles,
  Layers
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddSubject?: () => void;
  onOpenEditSubject?: (subjectId: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenAddSubject,
  onOpenEditSubject
}) => {
  const { 
    subjects,
    deleteSubject,
    loadTemplatePreset,
    clearAllData,
    exportDataJson,
    importDataJson
  } = usePlacement();

  const [importJson, setImportJson] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const exportJsonString = exportDataJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(exportJsonString);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-progress-bar-custom-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      setImportError('');
      const ok = importDataJson(importJson);
      if (!ok) {
        throw new Error('Invalid JSON format or corrupt structure');
      }
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setImportError(err.message || 'Failed to parse JSON');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div 
        id="settings-modal"
        className="w-full max-w-xl rounded-2xl bg-[#16171c] border border-[#2c2f3c] shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="p-6 pb-4 border-b border-[#22242e] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#f95721] rounded-xs" />
            <h3 className="font-mono text-sm font-bold tracking-[0.2em] text-[#f4f3ef] uppercase">
              SETTINGS // SDE PREPARATION COCKPIT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c8a83] hover:text-[#f4f3ef] hover:bg-[#20222b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* User-Defined Subjects Manager */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-mono text-xs font-semibold tracking-wider text-[#f4f3ef] uppercase">
                  ACTIVE SUBJECT TRACKS ({subjects.length})
                </h4>
                <p className="font-mono text-[10px] text-[#7d808e]">
                  Manage, rename, or reconfigure your custom placement subjects.
                </p>
              </div>
              {onOpenAddSubject && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddSubject();
                  }}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#f95721] hover:bg-[#ff6836] text-white font-mono text-[10px] uppercase font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>ADD TRACK</span>
                </button>
              )}
            </div>

            {subjects.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#121318] border border-dashed border-[#262834] text-center">
                <p className="font-mono text-xs text-[#7b7e8d]">
                  No subjects defined. Click "Add Track" above to create one.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {subjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl bg-[#121318] border border-[#21232d] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color || '#f95721' }} />
                      <div>
                        <span className="font-mono text-xs font-semibold text-[#f4f3ef]">
                          {sub.code} — {sub.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#6d6f7f] block">
                          Target: {sub.targetVideos || 25} videos {sub.description ? `• ${sub.description}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {onOpenEditSubject && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenEditSubject(sub.id);
                          }}
                          className="p-1.5 rounded-lg text-[#8c8a83] hover:text-[#f4f3ef] hover:bg-[#20222a] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete subject "${sub.name}"?`)) {
                            deleteSubject(sub.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-[#8c8a83] hover:text-red-400 hover:bg-[#20222a] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Presets Section */}
          <div className="pt-4 border-t border-[#22242e] space-y-3">
            <h4 className="font-mono text-xs font-semibold tracking-wider text-[#f4f3ef] uppercase">
              TEMPLATE PRESETS & BLANK SLATE
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (window.confirm('Load standard 4-Core curriculum template (DSA, OOPS, DBMS, System Design)? This will load preconfigured tracks.')) {
                    loadTemplatePreset();
                    onClose();
                  }
                }}
                className="p-3 rounded-xl bg-[#1a1c24] hover:bg-[#222530] border border-[#2b2e3c] text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-1.5 text-[#f95721] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-mono text-xs font-bold uppercase">LOAD 4-CORE PRESET</span>
                </div>
                <p className="font-mono text-[10px] text-[#8c8a83]">
                  Loads standard SDE curriculum with 4 core tracks, topics, and initial videos.
                </p>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Clear all subjects, videos, and logs to start completely blank?')) {
                    clearAllData();
                    onClose();
                  }
                }}
                className="p-3 rounded-xl bg-[#1c1414] hover:bg-[#291717] border border-red-900/40 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-1.5 text-red-400 mb-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="font-mono text-xs font-bold uppercase">START 100% BLANK</span>
                </div>
                <p className="font-mono text-[10px] text-[#8c8a83]">
                  Wipes all data so you can define every track, topic, and lecture from scratch.
                </p>
              </button>
            </div>
          </div>

          {/* Backup & Export / Import JSON */}
          <div className="pt-4 border-t border-[#22242e] space-y-3">
            <h4 className="font-mono text-xs font-semibold tracking-wider text-[#f4f3ef] uppercase">
              DATA BACKUP & PORTABILITY
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1e2029] hover:bg-[#272935] text-[#f4f3ef] font-mono text-xs uppercase tracking-wider border border-[#2e313f] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#f95721]" />
                <span>DOWNLOAD BACKUP (.JSON)</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1e2029] hover:bg-[#272935] text-[#f4f3ef] font-mono text-xs uppercase tracking-wider border border-[#2e313f] transition-colors cursor-pointer"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5 text-[#f95721]" />}
                <span>{copySuccess ? 'COPIED TO CLIPBOARD' : 'COPY JSON'}</span>
              </button>
            </div>

            {/* Import JSON */}
            <div className="mt-3 space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8c8a83] block">
                RESTORE FROM BACKUP JSON
              </label>
              <textarea
                rows={3}
                placeholder="Paste exported backup JSON here..."
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121318] border border-[#252834] text-xs font-mono text-[#f4f3ef] placeholder-[#666877] focus:outline-none focus:border-[#f95721] resize-none"
              />
              {importError && (
                <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs font-mono">
                  {importError}
                </div>
              )}
              {importSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs font-mono">
                  Data restored successfully!
                </div>
              )}
              <button
                type="button"
                onClick={handleImport}
                disabled={!importJson.trim()}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#20222c] hover:bg-[#292c39] disabled:opacity-40 text-[#f4f3ef] font-mono text-xs uppercase tracking-wider border border-[#2e3140] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#f95721]" />
                <span>RESTORE BACKUP</span>
              </button>
            </div>
          </div>

          {/* Storage & Local Persistence Status */}
          <div className="p-4 rounded-xl bg-[#121318] border border-[#22242e] flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#8c8a83] block">
                LOCAL STORAGE PERSISTENCE
              </span>
              <span className="font-sans text-xs font-bold text-[#f4f3ef]">
                Private Ground-Truth Client Storage
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>SYNCHRONIZED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
