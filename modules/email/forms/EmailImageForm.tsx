'use client';
import { EmailImageData } from '@/types/emailModules';

interface Props { data: EmailImageData; onChange: (d: EmailImageData) => void; }

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
        <input type="color" value={value || '#ffffff'} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-7 h-7 rounded border border-slate-600" style={{ background: value || '#ffffff' }} />
      </div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500" />
    </div>
  </div>
);

export function EmailImageForm({ data, onChange }: Props) {
  const set = <K extends keyof EmailImageData>(k: K, v: EmailImageData[K]) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-3">
      <F label="圖片網址" value={data.image} onChange={(v) => set('image', v)} placeholder="https://..." />
      <F label="點擊連結" value={data.link} onChange={(v) => set('link', v)} placeholder="https://..." />
      <F label="Alt 文字" value={data.altText} onChange={(v) => set('altText', v)} placeholder="圖片說明" />
      <ColorField label="背景色" value={data.backgroundColor || '#ffffff'} onChange={(v) => set('backgroundColor', v)} />
    </div>
  );
}
