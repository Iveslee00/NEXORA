'use client';

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Link2, Palette, X } from 'lucide-react';
import { formatImageSpec, ImageSpec } from '@/lib/assets/imageSpecs';
import {
  GRADIENT_DIRECTIONS,
  GRADIENT_PRESETS,
  colorSwatchStyle,
  createLinearGradient,
  isGradientValue,
} from '@/lib/styles/colorStyles';

interface Option { value: string; label: string }

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'url' | 'textarea' | 'select';
  options?: Option[];
  placeholder?: string;
  rows?: number;
}

export function FormField({ label, value, onChange, type = 'text', options = [], placeholder, rows = 3 }: FormFieldProps) {
  const inputClass =
    'w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder-slate-500';

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${inputClass} resize-none`}
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} cursor-pointer`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  );
}

interface ToggleFieldProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleField({ label, description, value, onChange }: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
          value ? 'bg-indigo-500' : 'bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out mt-0.5 ${
            value ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

interface SegmentedFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export function SegmentedField({ label, value, onChange, options }: SegmentedFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
      <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-md p-0.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors ${
              value === o.value
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Color field with native color picker + hex input ──────────────────────────
interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  defaultPreviewColor?: string;
}

export function GradientPickerPopover({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [colorTab, setColorTab] = useState<'solid' | 'gradient'>(isGradientValue(value) ? 'gradient' : 'solid');
  const [fromColor, setFromColor] = useState('#2563eb');
  const [toColor, setToColor] = useState('#7c3aed');
  const [direction, setDirection] = useState('135deg');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 12, width: 280, maxHeight: 460 });

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const margin = 12;
      const width = Math.min(280, window.innerWidth - margin * 2);
      const panelHeight = Math.min(460, window.innerHeight - margin * 2);
      const left = Math.min(Math.max(margin, rect.right - width), window.innerWidth - width - margin);
      const belowTop = rect.bottom + 8;
      const aboveTop = rect.top - panelHeight - 8;
      const top = belowTop + panelHeight <= window.innerHeight - margin
        ? belowTop
        : Math.max(margin, aboveTop);
      setPopoverPosition({ top, left, width, maxHeight: panelHeight });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  const applyCustomGradient = () => {
    onChange(createLinearGradient(fromColor, toColor, direction));
    setOpen(false);
  };

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="選擇顏色"
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs font-semibold transition-colors ${
          isGradientValue(value)
            ? 'border-indigo-400 bg-indigo-500/15 text-indigo-100'
            : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
        }`}
        title="選擇顏色"
      >
        <Palette size={13} />
      </button>
      {open && (
        <div
          className="fixed z-50 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-3 shadow-2xl shadow-black/40"
          style={popoverPosition}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-300">選擇顏色</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-slate-500 transition-colors hover:text-slate-200"
            >
              關閉
            </button>
          </div>
          <div className="mb-3 grid grid-cols-2 rounded-md border border-slate-700 bg-slate-800 p-0.5">
            {[
              { id: 'solid', label: '純色' },
              { id: 'gradient', label: '漸層' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setColorTab(tab.id as 'solid' | 'gradient')}
                className={`rounded px-2 py-1.5 text-xs font-semibold transition-colors ${
                  colorTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {colorTab === 'solid' ? (
            <div className="space-y-3">
              <label className="flex flex-col gap-1 text-[11px] text-slate-500">
                純色
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#6366f1'}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-8 w-full cursor-pointer rounded-md border border-slate-700 bg-slate-800"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-slate-500">
                HEX
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="#6366f1"
                  className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </label>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-1.5">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      onChange(preset.value);
                      setOpen(false);
                    }}
                    className={`h-8 rounded-md border px-1 text-[10px] font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 ${
                      value === preset.value ? 'border-white ring-1 ring-indigo-300' : 'border-slate-700'
                    }`}
                    style={{ background: preset.value }}
                    title={preset.value}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 border-t border-slate-800 pt-3">
                <p className="mb-2 text-xs font-semibold text-slate-400">自訂漸層</p>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex flex-col gap-1 text-[11px] text-slate-500">
                    起始色
                    <input
                      type="color"
                      value={fromColor}
                      onChange={(e) => setFromColor(e.target.value)}
                      className="h-8 w-full cursor-pointer rounded-md border border-slate-700 bg-slate-800"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[11px] text-slate-500">
                    結束色
                    <input
                      type="color"
                      value={toColor}
                      onChange={(e) => setToColor(e.target.value)}
                      className="h-8 w-full cursor-pointer rounded-md border border-slate-700 bg-slate-800"
                    />
                  </label>
                </div>
                <label className="mt-2 flex flex-col gap-1 text-[11px] text-slate-500">
                  方向
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  >
                    {GRADIENT_DIRECTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <div className="mt-3 flex flex-col gap-2">
                  <div
                    className="h-8 w-full rounded-md border border-slate-700"
                    style={{ background: createLinearGradient(fromColor, toColor, direction) }}
                  />
                  <button
                    type="button"
                    onClick={applyCustomGradient}
                    className="h-8 w-full rounded-md bg-indigo-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
                  >
                    套用自訂漸層
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function ColorField({ label, value, onChange, placeholder = '使用預設', defaultPreviewColor = '#1a1a2e' }: ColorFieldProps) {
  const isHex = /^#[0-9a-fA-F]{6}$/.test(value);
  const displayColor = isHex ? value : defaultPreviewColor;
  const isGradient = isGradientValue(value);
  const canUseNativePicker = !isGradient;
  const swatchValue = value || defaultPreviewColor;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2">
        {/* Color swatch — clicking opens native color picker */}
        <div className="relative flex-shrink-0">
          {canUseNativePicker && (
            <input
              type="color"
              value={displayColor}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-md"
            />
          )}
          <div
            className="w-8 h-8 rounded-md border border-slate-600 flex items-center justify-center overflow-hidden"
            style={colorSwatchStyle(swatchValue)}
          >
            {!value && (
              <span className="rounded bg-white/90 px-1 text-[9px] font-bold leading-4 text-slate-700">預</span>
            )}
          </div>
        </div>

        {/* Hex input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 transition-colors placeholder-slate-500 font-mono"
        />

        <GradientPickerPopover value={value} onChange={onChange} />

        {/* Reset to auto */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="flex-shrink-0 text-xs text-slate-500 hover:text-slate-300 transition-colors px-1"
            title="重設為自動"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

// ── Reusable two-color section ────────────────────────────────────────────────
interface ColorSectionProps {
  titleColor: string;
  textColor: string;
  onTitleColorChange: (v: string) => void;
  onTextColorChange: (v: string) => void;
  backgroundColor?: string;
  onBackgroundColorChange?: (v: string) => void;
  titleDefaultColor?: string;
  textDefaultColor?: string;
  titlePlaceholder?: string;
  textPlaceholder?: string;
  backgroundLabel?: string;
  titleLabel?: string;
  textLabel?: string;
}

export function ColorSection({
  titleColor,
  textColor,
  onTitleColorChange,
  onTextColorChange,
  backgroundColor,
  onBackgroundColorChange,
  titleDefaultColor = '#1a1a2e',
  textDefaultColor = '#4a4a6a',
  titlePlaceholder = '使用預設 #1a1a2e',
  textPlaceholder = '使用預設 #4a4a6a',
  backgroundLabel = '背景色',
  titleLabel = '標題色',
  textLabel = '內文字色',
}: ColorSectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">顏色設定</p>
      {onBackgroundColorChange !== undefined && (
        <ColorField label={backgroundLabel} value={backgroundColor ?? ''} onChange={onBackgroundColorChange} defaultPreviewColor="#ffffff" placeholder="使用預設 #ffffff" />
      )}
      <ColorField label={titleLabel} value={titleColor} onChange={onTitleColorChange} defaultPreviewColor={titleDefaultColor} placeholder={titlePlaceholder} />
      <ColorField label={textLabel} value={textColor} onChange={onTextColorChange} defaultPreviewColor={textDefaultColor} placeholder={textPlaceholder} />
    </div>
  );
}

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  spec?: ImageSpec;
}

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result ?? ''));
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

const readImageSize = (src: string) => new Promise<{ width: number; height: number }>((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
  image.onerror = () => reject(new Error('image-load-failed'));
  image.src = src;
});

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export function ImageField({ label, value, onChange, placeholder = 'https://…', spec }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isUploaded = value.startsWith('data:image/');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const specLabel = spec ? formatImageSpec(spec) : '';

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('請上傳圖片檔');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('圖片檔案過大，請壓縮至 8MB 以下');
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (spec) {
        const size = await readImageSize(dataUrl);
        if (size.width !== spec.width || size.height !== spec.height) {
          setError(`請上傳 ${specLabel} 圖檔`);
          return;
        }
      }
      setError('');
      onChange(dataUrl);
    } catch {
      setError('圖片讀取失敗，請重新上傳');
    } finally {
      setUploading(false);
    }
  };

  const uploadLabel = uploading ? '讀取中' : '上傳';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
        {spec && <span className="flex-shrink-0 text-xs text-slate-500">{specLabel}</span>}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label={`上傳 ${label}`}
          className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-white transition-colors ${uploading ? 'cursor-wait bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-500'}`}
        >
          <ImagePlus size={13} />
          {uploadLabel}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            void handleUpload(e.target.files?.[0]);
            e.currentTarget.value = '';
          }}
        />
        <div className="relative min-w-0 flex-1">
          <Link2 size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="url"
            value={isUploaded ? '已使用上傳圖片，匯出 ZIP 時會放入 images/' : value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isUploaded}
            placeholder={placeholder}
            className="w-full rounded-md border border-slate-700 bg-slate-800 py-2 pl-8 pr-8 text-sm text-slate-100 outline-none transition-colors placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 disabled:text-slate-400"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                setError('');
                onChange('');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
              aria-label={`清除 ${label}`}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
      {value && (
        <div className="overflow-hidden rounded-md border border-slate-700 bg-slate-950">
          <img
            src={value}
            alt=""
            className="block h-32 w-full object-contain p-2"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );
}
