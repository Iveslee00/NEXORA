'use client';

import { useState } from 'react';
import { ImagePlus, Link2, X } from 'lucide-react';
import { formatImageSpec, ImageSpec } from '@/lib/assets/imageSpecs';

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
}

export function ColorField({ label, value, onChange, placeholder = 'Auto' }: ColorFieldProps) {
  const displayColor = value || '#ffffff';

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2">
        {/* Color swatch — clicking opens native color picker */}
        <div className="relative flex-shrink-0">
          <input
            type="color"
            value={displayColor}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-md"
          />
          <div
            className="w-8 h-8 rounded-md border border-slate-600 flex items-center justify-center overflow-hidden"
            style={{ background: value || 'transparent' }}
          >
            {!value && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-500">
                <line x1="0" y1="0" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </div>
        </div>

        {/* Hex input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 transition-colors placeholder-slate-500 font-mono"
        />

        {/* Reset to auto */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="flex-shrink-0 text-xs text-slate-500 hover:text-slate-300 transition-colors px-1"
            title="Reset to auto"
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
}

export function ColorSection({ titleColor, textColor, onTitleColorChange, onTextColorChange, backgroundColor, onBackgroundColorChange }: ColorSectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Colors</p>
      {onBackgroundColorChange !== undefined && (
        <ColorField label="Background" value={backgroundColor ?? ''} onChange={onBackgroundColorChange} />
      )}
      <ColorField label="Title Color" value={titleColor} onChange={onTitleColorChange} />
      <ColorField label="Body / Text Color" value={textColor} onChange={onTextColorChange} />
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

export function ImageField({ label, value, onChange, placeholder = 'https://…', spec }: ImageFieldProps) {
  const isUploaded = value.startsWith('data:image/');
  const [error, setError] = useState('');
  const specLabel = spec ? formatImageSpec(spec) : '';

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
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
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
        {spec && <span className="flex-shrink-0 text-xs text-slate-500">{specLabel}</span>}
      </div>
      <div className="flex gap-2">
        <label className="inline-flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500">
          <ImagePlus size={13} />
          上傳
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              void handleUpload(e.target.files?.[0]);
              e.currentTarget.value = '';
            }}
          />
        </label>
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
            className="block max-h-32 w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );
}
