'use client';

import { ArticleImageData } from '@/types/modules';
import { FormField, ColorSection, SegmentedField } from '@/components/ui/FormField';

interface Props { data: ArticleImageData; onChange: (data: ArticleImageData) => void }

export function ArticleImageForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <FormField label="圖片 URL" value={data.image} onChange={(v) => onChange({ ...data, image: v })} type="url" placeholder="https://…" />
      <SegmentedField
        label="圖片位置"
        value={data.imagePosition}
        options={[{ value: 'top', label: '上方' }, { value: 'left', label: '左側' }, { value: 'right', label: '右側' }]}
        onChange={(v) => onChange({ ...data, imagePosition: v as ArticleImageData['imagePosition'] })}
      />
      <div className="h-px bg-slate-700/60" />
      <FormField label="Eyebrow / Category" value={data.eyebrow} onChange={(v) => onChange({ ...data, eyebrow: v })} placeholder="分類、標籤…" />
      <FormField label="標題" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="文章標題" />
      <FormField label="副標題 / 摘要" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} type="textarea" rows={2} placeholder="文章副標題或摘要" />
      <FormField label="內文" value={data.content} onChange={(v) => onChange({ ...data, content: v })} type="textarea" rows={7} placeholder="在此輸入文章內容…" />
      <div className="h-px bg-slate-700/60" />
      <FormField label="作者" value={data.author} onChange={(v) => onChange({ ...data, author: v })} placeholder="作者姓名" />
      <FormField label="日期" value={data.date} onChange={(v) => onChange({ ...data, date: v })} placeholder="2024-01-01" />
      <SegmentedField
        label="Alignment"
        value={data.alignment}
        options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }]}
        onChange={(v) => onChange({ ...data, alignment: v as ArticleImageData['alignment'] })}
      />
      <div className="h-px bg-slate-700/60" />
      <ColorSection
        backgroundColor={data.backgroundColor}
        onBackgroundColorChange={(v) => onChange({ ...data, backgroundColor: v })}
        titleColor={data.titleColor}
        textColor={data.textColor}
        onTitleColorChange={(v) => onChange({ ...data, titleColor: v })}
        onTextColorChange={(v) => onChange({ ...data, textColor: v })}
      />
    </div>
  );
}
