'use client';
import { EmailKvData } from '@/types/emailModules';
import { FormField, ColorField } from '@/components/ui/FormField';

interface Props { data: EmailKvData; onChange: (d: EmailKvData) => void }

export function EmailKvForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <FormField label="圖片 URL" value={data.image} onChange={(v) => onChange({ ...data, image: v })} type="url" placeholder="https://…" />
      <FormField label="連結網址" value={data.link} onChange={(v) => onChange({ ...data, link: v })} type="url" placeholder="#" />
      <FormField label="Alt 文字" value={data.altText} onChange={(v) => onChange({ ...data, altText: v })} placeholder="圖片說明" />
      <div className="h-px bg-slate-700/60" />
      <ColorField label="背景色" value={data.backgroundColor} onChange={(v) => onChange({ ...data, backgroundColor: v })} />
    </div>
  );
}
