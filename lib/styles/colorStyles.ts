import type React from 'react';

export const GRADIENT_PRESETS = [
  { label: '藍紫', value: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' },
  { label: '桃橘', value: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)' },
  { label: '青綠', value: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)' },
  { label: '黑金', value: 'linear-gradient(135deg, #111827 0%, #d4af37 100%)' },
  { label: '紅金', value: 'linear-gradient(135deg, #b91c1c 0%, #facc15 100%)' },
  { label: '粉紫', value: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' },
  { label: '海洋', value: 'linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)' },
  { label: '春綠', value: 'linear-gradient(135deg, #84cc16 0%, #059669 100%)' },
  { label: '夕陽', value: 'linear-gradient(135deg, #fb7185 0%, #f97316 100%)' },
  { label: '精品', value: 'linear-gradient(135deg, #030712 0%, #64748b 100%)' },
  { label: '香檳', value: 'linear-gradient(135deg, #fef3c7 0%, #b45309 100%)' },
  { label: '冰藍', value: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)' },
  { label: '莓果', value: 'linear-gradient(135deg, #be123c 0%, #581c87 100%)' },
  { label: '科技', value: 'linear-gradient(135deg, #22d3ee 0%, #4338ca 100%)' },
  { label: '暖杏', value: 'linear-gradient(135deg, #fed7aa 0%, #ef4444 100%)' },
] as const;

export const GRADIENT_DIRECTIONS = [
  { label: '左到右', value: '90deg' },
  { label: '上到下', value: '180deg' },
  { label: '左上到右下', value: '135deg' },
  { label: '右上到左下', value: '225deg' },
] as const;

export const isGradientValue = (value = '') => value.includes('gradient(');

export const createLinearGradient = (from: string, to: string, direction = '135deg') => (
  `linear-gradient(${direction}, ${from} 0%, ${to} 100%)`
);

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
