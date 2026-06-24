'use client';

import { TitleData } from '@/types/modules';
import { FormField, ColorField, SegmentedField } from '@/components/ui/FormField';

interface Props { data: TitleData; onChange: (data: TitleData) => void }

export function TitleForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <FormField label="標題（中文）" value={data.titleCn} onChange={(v) => onChange({ ...data, titleCn: v })} placeholder="主要標題" />
      <FormField label="副標文字" value={data.titleEn} onChange={(v) => onChange({ ...data, titleEn: v })} placeholder="Campaign Sale" />
      <SegmentedField
        label="對齊"
        value={data.alignment}
        options={[{ value: 'left', label: '左' }, { value: 'center', label: '中' }, { value: 'right', label: '右' }]}
        onChange={(v) => onChange({ ...data, alignment: v as TitleData['alignment'] })}
      />
      <div className="h-px bg-slate-700/60" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">顏色設定</p>
      <ColorField label="標題色" value={data.titleColor} onChange={(v) => onChange({ ...data, titleColor: v })} />
      <ColorField label="背景色" value={data.backgroundColor} onChange={(v) => onChange({ ...data, backgroundColor: v })} />
    </div>
  );
}
