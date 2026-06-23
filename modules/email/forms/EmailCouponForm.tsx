'use client';
import { EmailCouponData } from '@/types/emailModules';
import { FormField, ColorField } from '@/components/ui/FormField';

interface Props { data: EmailCouponData; onChange: (d: EmailCouponData) => void }

export function EmailCouponForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <FormField label="標題" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="專屬折扣碼" />
      <FormField label="優惠碼" value={data.code} onChange={(v) => onChange({ ...data, code: v })} placeholder="SAVE300" />
      <FormField label="說明" value={data.description} onChange={(v) => onChange({ ...data, description: v })} type="textarea" rows={2} placeholder="滿 NT$1,000 折 NT$300" />
      <FormField label="有效期" value={data.validity} onChange={(v) => onChange({ ...data, validity: v })} placeholder="2024/12/31 前有效" />
      <div className="h-px bg-slate-700/60" />
      <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => onChange({ ...data, buttonText: v })} placeholder="立即使用" />
      <FormField label="按鈕連結" value={data.link} onChange={(v) => onChange({ ...data, link: v })} type="url" placeholder="#" />
      <div className="h-px bg-slate-700/60" />
      <ColorField label="強調色" value={data.accentColor} onChange={(v) => onChange({ ...data, accentColor: v })} placeholder="#6366f1" />
      <ColorField label="背景色" value={data.backgroundColor} onChange={(v) => onChange({ ...data, backgroundColor: v })} placeholder="#f0f4ff" />
      <ColorField label="文字色" value={data.textColor} onChange={(v) => onChange({ ...data, textColor: v })} />
    </div>
  );
}
