'use client';

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
