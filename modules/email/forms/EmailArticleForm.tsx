'use client';
import { EmailArticleData } from '@/types/emailModules';
import { FormField, ColorField, ColorSection } from '@/components/ui/FormField';

interface Props { data: EmailArticleData; onChange: (d: EmailArticleData) => void }

export function EmailArticleForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <FormField label="圖片 URL（選填）" value={data.image} onChange={(v) => onChange({ ...data, image: v })} type="url" placeholder="https://…" />
      <div className="h-px bg-slate-700/60" />
      <FormField label="分類標籤" value={data.eyebrow} onChange={(v) => onChange({ ...data, eyebrow: v })} placeholder="品牌故事" />
      <FormField label="標題" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="文章標題" />
      <FormField label="內文" value={data.content} onChange={(v) => onChange({ ...data, content: v })} type="textarea" rows={6} placeholder="文章內容…" />
      <div className="h-px bg-slate-700/60" />
      <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => onChange({ ...data, buttonText: v })} placeholder="閱讀更多" />
      <FormField label="按鈕連結" value={data.link} onChange={(v) => onChange({ ...data, link: v })} type="url" placeholder="#" />
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
