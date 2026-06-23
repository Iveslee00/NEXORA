'use client';
import { EmailTitleData } from '@/types/emailModules';

interface Props { data: EmailTitleData; onChange: (d: EmailTitleData) => void; }

const F = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="space-y-1">
    <p className="text-xs text-slate-500">{label}</p>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500" />
  </div>
);

const ColorField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1">
    <p className="text-xs text-slate-500">{label}</p>
    <div className="flex items-center gap-2">
      <div className="relative flex-shrink-0">
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-7 h-7 rounded border border-slate-600" style={{ background: value || '#000000' }} />
      </div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500" />
    </div>
  </div>
);

export function EmailTitleForm({ data, onChange }: Props) {
  const set = <K extends keyof EmailTitleData>(k: K, v: EmailTitleData[K]) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-3">
      <F label="中文標題" value={data.titleZh} onChange={(v) => set('titleZh', v)} placeholder="活動主標題" />
      <F label="英文副標題" value={data.titleEn} onChange={(v) => set('titleEn', v)} placeholder="CAMPAIGN TITLE" />
      <div className="space-y-1">
        <p className="text-xs text-slate-500">對齊</p>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map((a) => (
            <button key={a} onClick={() => set('alignment', a)} className={`flex-1 py-1.5 text-xs rounded border transition-colors ${data.alignment === a ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'}`}>
              {a === 'left' ? '靠左' : a === 'center' ? '置中' : '靠右'}
            </button>
          ))}
        </div>
      </div>
      <ColorField label="中文標題色" value={data.titleColor || '#1a1a2e'} onChange={(v) => set('titleColor', v)} />
      <ColorField label="英文副標題色" value={data.subtitleColor || '#9090b0'} onChange={(v) => set('subtitleColor', v)} />
      <ColorField label="背景色" value={data.backgroundColor || '#ffffff'} onChange={(v) => set('backgroundColor', v)} />
    </div>
  );
}
