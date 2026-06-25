'use client';

import { AnchorNavData, PageModule } from '@/types/modules';
import { ColorField } from '@/components/ui/FormField';
import { getAnchorTargets } from '@/lib/modules/anchors';

interface Props {
  data: AnchorNavData;
  moduleId: string;
  modules: PageModule[];
  onChange: (data: AnchorNavData) => void;
}

export function AnchorNavForm({ data, moduleId, modules, onChange }: Props) {
  const targets = getAnchorTargets(modules, moduleId);
  const hidden = new Set(data.hiddenTargetIds ?? []);

  const toggleTarget = (targetId: string) => {
    const next = new Set(hidden);
    if (next.has(targetId)) next.delete(targetId);
    else next.add(targetId);
    onChange({ ...data, hiddenTargetIds: Array.from(next) });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-3">
        <p className="text-xs font-semibold text-slate-300">導覽按鈕</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          會依頁面順序列出已填「錨點名稱」的模組。取消勾選可隱藏該按鈕。
        </p>
      </div>

      {targets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 p-4 text-center">
          <p className="text-sm font-medium text-slate-400">尚無可用錨點</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">請先到其他模組填寫「錨點名稱」。</p>
        </div>
      ) : (
        <div className="space-y-2">
          {targets.map((target) => (
            <label key={target.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5">
              <span className="min-w-0 truncate text-sm text-slate-200">{target.label}</span>
              <input
                type="checkbox"
                checked={!hidden.has(target.id)}
                onChange={() => toggleTarget(target.id)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
              />
            </label>
          ))}
        </div>
      )}

      <div className="h-px bg-slate-700/60" />
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">顏色設定</p>
        <ColorField label="背景色" value={data.backgroundColor} onChange={(v) => onChange({ ...data, backgroundColor: v })} />
        <ColorField label="按鈕色" value={data.buttonColor ?? ''} onChange={(v) => onChange({ ...data, buttonColor: v })} />
        <ColorField label="文字色" value={data.textColor} onChange={(v) => onChange({ ...data, textColor: v })} />
      </div>
    </div>
  );
}
