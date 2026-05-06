'use client';

import { useState, useRef, useCallback } from 'react';
import { CROInputs } from '@/types';

interface Props {
  onSubmit: (inputs: CROInputs) => void;
  loading: boolean;
}

interface UploadedFile {
  filename: string;
  text: string;
  status: 'extracting' | 'done' | 'error';
  error?: string;
}

interface FieldState {
  files: UploadedFile[];
  dragging: boolean;
}

const FIELDS: {
  key: keyof Omit<CROInputs, 'journeyUrls'>;
  label: string;
  sublabel: string;
  accent: string;
  border: string;
  dragBg: string;
}[] = [
  {
    key: 'business',
    label: 'Business Context',
    sublabel: 'Goals & strategy',
    accent: 'text-purple-400',
    border: 'border-purple-700/50 hover:border-purple-500',
    dragBg: 'bg-purple-900/20 border-purple-500',
  },
  {
    key: 'user',
    label: 'User Context',
    sublabel: 'ICP, personas & intent',
    accent: 'text-purple-400',
    border: 'border-purple-700/50 hover:border-purple-500',
    dragBg: 'bg-purple-900/20 border-purple-500',
  },
  {
    key: 'experience',
    label: 'Experience Context',
    sublabel: 'Pages, journey, funnel & expected behaviour',
    accent: 'text-purple-400',
    border: 'border-purple-700/50 hover:border-purple-500',
    dragBg: 'bg-purple-900/20 border-purple-500',
  },
  {
    key: 'evidence',
    label: 'Evidence',
    sublabel: 'High strength — quant data, qual research, user feedback',
    accent: 'text-emerald-400',
    border: 'border-emerald-700/50 hover:border-emerald-500',
    dragBg: 'bg-emerald-900/20 border-emerald-500',
  },
  {
    key: 'supportingInput',
    label: 'Supporting Input',
    sublabel: 'Lower strength — heuristics, competitor analysis',
    accent: 'text-amber-400',
    border: 'border-amber-700/50 hover:border-amber-500',
    dragBg: 'bg-amber-900/20 border-amber-500',
  },
];

async function extractFile(file: File): Promise<{ text: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/extract-text', { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Extraction failed');
  return data;
}

function FileChip({
  file,
  onRemove,
}: {
  file: UploadedFile;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2">
        {file.status === 'extracting' ? (
          <svg className="animate-spin w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : file.status === 'error' ? (
          <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}

        <span className="text-xs text-slate-300 flex-1 truncate font-medium">{file.filename}</span>

        {file.status === 'done' && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-slate-500 hover:text-slate-300 transition-colors text-xs"
          >
            {expanded ? 'Hide' : 'Preview'}
          </button>
        )}
        {file.status === 'error' && (
          <span className="text-xs text-red-400">{file.error}</span>
        )}

        <button
          onClick={onRemove}
          className="text-slate-600 hover:text-red-400 transition-colors shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {expanded && file.text && (
        <div className="border-t border-slate-700/50 px-3 py-2 max-h-32 overflow-y-auto">
          <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{file.text.slice(0, 800)}{file.text.length > 800 ? '…' : ''}</p>
        </div>
      )}
    </div>
  );
}

function UploadZone({
  fieldKey,
  label,
  sublabel,
  accent,
  border,
  dragBg,
  state,
  onChange,
}: {
  fieldKey: string;
  label: string;
  sublabel: string;
  accent: string;
  border: string;
  dragBg: string;
  state: FieldState;
  onChange: (updater: (prev: FieldState) => FieldState) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (incoming: FileList | File[]) => {
      const arr = Array.from(incoming);

      // Add placeholders
      onChange((prev) => ({
        ...prev,
        dragging: false,
        files: [
          ...prev.files,
          ...arr.map((f) => ({ filename: f.name, text: '', status: 'extracting' as const })),
        ],
      }));

      // Extract each file
      for (const file of arr) {
        try {
          const { text } = await extractFile(file);
          onChange((prev) => ({
            ...prev,
            files: prev.files.map((f) =>
              f.filename === file.name && f.status === 'extracting'
                ? { ...f, text, status: 'done' }
                : f
            ),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed';
          onChange((prev) => ({
            ...prev,
            files: prev.files.map((f) =>
              f.filename === file.name && f.status === 'extracting'
                ? { ...f, status: 'error', error: message }
                : f
            ),
          }));
        }
      }
    },
    [onChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = (i: number) => {
    onChange((prev) => ({ ...prev, files: prev.files.filter((_, idx) => idx !== i) }));
  };

  const isDragging = state.dragging;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
        <span className="ml-2 text-xs text-slate-500 font-normal">{sublabel}</span>
      </label>

      {/* File chips */}
      {state.files.length > 0 && (
        <div className="space-y-1.5 mb-2">
          {state.files.map((f, i) => (
            <FileChip key={`${f.filename}-${i}`} file={f} onRemove={() => removeFile(i)} />
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer ${
          isDragging ? `${dragBg} scale-[1.01]` : `border-slate-700/60 bg-slate-900/40 ${border}`
        }`}
        onDragEnter={(e) => { e.preventDefault(); onChange((p) => ({ ...p, dragging: true })); }}
        onDragOver={(e) => { e.preventDefault(); onChange((p) => ({ ...p, dragging: true })); }}
        onDragLeave={() => onChange((p) => ({ ...p, dragging: false }))}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.csv"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          key={fieldKey}
        />
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center pointer-events-none">
          <svg className={`w-7 h-7 mb-2 ${accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-slate-400">
            <span className={`font-semibold ${accent}`}>Click to upload</span> or drag & drop
          </p>
          <p className="text-xs text-slate-600 mt-1">PDF, DOCX, TXT, MD, CSV</p>
        </div>
      </div>
    </div>
  );
}

const emptyField = (): FieldState => ({ files: [], dragging: false });

export default function InputForm({ onSubmit, loading }: Props) {
  const [fields, setFields] = useState<Record<string, FieldState>>({
    business: emptyField(),
    user: emptyField(),
    experience: emptyField(),
    evidence: emptyField(),
    supportingInput: emptyField(),
  });
  const [journeyUrls, setJourneyUrls] = useState<string[]>(['']);

  function updateField(key: string) {
    return (updater: (prev: FieldState) => FieldState) => {
      setFields((prev) => ({ ...prev, [key]: updater(prev[key]) }));
    };
  }

  function addUrl() { setJourneyUrls((p) => [...p, '']); }
  function removeUrl(i: number) { setJourneyUrls((p) => p.filter((_, idx) => idx !== i)); }
  function updateUrl(i: number, v: string) { setJourneyUrls((p) => p.map((u, idx) => idx === i ? v : u)); }

  function handlePasteMultiple(e: React.ClipboardEvent<HTMLInputElement>, i: number) {
    const lines = e.clipboardData.getData('text').split(/[\n\r]+/).map((l) => l.trim()).filter(Boolean);
    if (lines.length > 1) {
      e.preventDefault();
      setJourneyUrls((p) => { const u = [...p]; u.splice(i, 1, ...lines); return u; });
    }
  }

  function buildInputs(): CROInputs {
    const get = (key: string) =>
      fields[key].files
        .filter((f) => f.status === 'done')
        .map((f) => `[${f.filename}]\n${f.text}`)
        .join('\n\n');

    return {
      business: get('business'),
      user: get('user'),
      experience: get('experience'),
      evidence: get('evidence'),
      supportingInput: get('supportingInput'),
      journeyUrls: journeyUrls.filter((u) => u.trim()),
    };
  }

  const anyExtracting = Object.values(fields).some((f) => f.files.some((u) => u.status === 'extracting'));
  const validUrls = journeyUrls.filter((u) => u.trim());
  const hasContent =
    Object.values(fields).some((f) => f.files.some((u) => u.status === 'done')) ||
    validUrls.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-purple-200 mb-1">New CRO Analysis</h2>
        <p className="text-sm text-slate-400">
          Upload your research docs to each input. The AI engine processes everything through all 5 stages.
          Supported formats: PDF, DOCX, TXT, MD, CSV.
        </p>
      </div>

      {/* Context fields */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Context</span>
          <div className="flex-1 h-px bg-purple-800/30" />
        </div>
        <div className="space-y-5">
          {FIELDS.slice(0, 2).map(({ key, label, sublabel, accent, border, dragBg }) => (
            <UploadZone key={key} fieldKey={key} label={label} sublabel={sublabel} accent={accent} border={border} dragBg={dragBg} state={fields[key]} onChange={updateField(key)} />
          ))}

          {/* Experience + Journey URLs */}
          <div>
            <UploadZone
              fieldKey="experience"
              label={FIELDS[2].label}
              sublabel={FIELDS[2].sublabel}
              accent={FIELDS[2].accent}
              border={FIELDS[2].border}
              dragBg={FIELDS[2].dragBg}
              state={fields.experience}
              onChange={updateField('experience')}
            />

            {/* Journey URL scanner */}
            <div className="mt-3 bg-slate-900/40 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm font-semibold text-teal-300">Journey URL Scanner</span>
                <span className="text-xs text-slate-500">— one URL per step, in funnel order</span>
              </div>
              <div className="space-y-2">
                {journeyUrls.map((url, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-700/60 text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <input
                      type="url"
                      className="flex-1 bg-slate-800/60 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder={`https://yoursite.com/${i === 0 ? '' : i === 1 ? 'pricing' : 'step-' + (i + 1)}`}
                      value={url}
                      onChange={(e) => updateUrl(i, e.target.value)}
                      onPaste={(e) => handlePasteMultiple(e, i)}
                    />
                    {journeyUrls.length > 1 && (
                      <button onClick={() => removeUrl(i)} className="text-slate-600 hover:text-red-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={addUrl} className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add step
                </button>
                {validUrls.length > 0 && (
                  <span className="text-xs text-slate-500">{validUrls.length} page{validUrls.length !== 1 ? 's' : ''} will be scanned</span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-2">Paste multiple URLs at once to fill steps automatically. Only public pages can be scanned.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data fields */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Data</span>
          <div className="flex-1 h-px bg-slate-700/40" />
        </div>
        <div className="space-y-5">
          {FIELDS.slice(3).map(({ key, label, sublabel, accent, border, dragBg }) => (
            <UploadZone key={key} fieldKey={key} label={label} sublabel={sublabel} accent={accent} border={border} dragBg={dragBg} state={fields[key]} onChange={updateField(key)} />
          ))}
        </div>
      </div>

      <button
        onClick={() => onSubmit(buildInputs())}
        disabled={loading || anyExtracting || !hasContent}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {validUrls.length > 0 ? 'Scanning pages & running engine…' : 'Running CRO Engine…'}
          </span>
        ) : anyExtracting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Extracting documents…
          </span>
        ) : (
          'Run CRO Engine'
        )}
      </button>
    </div>
  );
}
