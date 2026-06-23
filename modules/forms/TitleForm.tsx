'use client';

import { TitleData } from '@/types/modules';
import { FormField, ColorField, SegmentedField } from '@/components/ui/FormField';

interface Props { data: TitleData; onChange: (data: TitleData) => void }

export function TitleForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <FormField label="標題（中文）" value={data.titleCn} onChange={(v) => onChange({ ...data, titleCn: v })} placeholder="主要標題" />
      <FormField label="Title (English)" value={data.titleEn} onChange={(v) => onChange({ ...data, titleEn: v })} placeholder="Section Heading" />
      <SegmentedField
        label="Alignment"
        value={data.alignment}
        options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]}
        onChange={(v) => onChange({ ...data, alignment: v as TitleData['alignment'] })}
      />
      <div className="h-px bg-slate-700/60" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Colors</p>
      <ColorField label="Title Color" value={data.titleColor} onChange={(v) => onChange({ ...data, titleColor: v })} />
      <ColorField label="Background Color" value={data.backgroundColor} onChange={(v) => onChange({ ...data, backgroundColor: v })} />
    </div>
  );
}
