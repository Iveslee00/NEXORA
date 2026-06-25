import type React from 'react';

export const GRADIENT_PRESETS = [
  { label: '藍紫', value: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' },
  { label: '桃橘', value: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)' },
  { label: '青綠', value: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)' },
] as const;

export const isGradientValue = (value = '') => value.includes('gradient(');

export const colorSwatchStyle = (value: string): React.CSSProperties => (
  value ? { background: value } : { background: 'transparent' }
);

export const backgroundStyle = (value?: string): React.CSSProperties => (
  value ? { background: value } : {}
);

export const textColorStyle = (value?: string): React.CSSProperties => {
  if (!value) return {};
  if (!isGradientValue(value)) return { color: value };
  return {
    background: value,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  };
};
