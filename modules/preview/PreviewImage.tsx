'use client';

import { useEffect, useState } from 'react';
import { ImageSpec } from '@/lib/assets/imageSpecs';
import { isLocalImageRef, resolveLocalImageUrl, revokeResolvedLocalImageUrl } from '@/lib/assets/localImageStore';

interface ImagePlaceholderProps {
  label: string;
  spec: ImageSpec;
  tone?: 'light' | 'dark';
  state?: 'empty' | 'error';
  variant?: 'default' | 'product' | 'scene' | 'hero';
}

interface PreviewImageProps extends ImagePlaceholderProps {
  src?: string;
  alt?: string;
  objectFit?: React.CSSProperties['objectFit'];
}

export function ImagePlaceholder({ label, spec, tone = 'light', state = 'empty', variant = 'default' }: ImagePlaceholderProps) {
  const isDark = tone === 'dark';
  const isCompact = spec.height <= 80;
  const isProduct = variant === 'product';
  const isScene = variant === 'scene';
  const isHero = variant === 'hero';
  const background = isDark
    ? 'linear-gradient(135deg, #141827 0%, #20243a 100%)'
    : isProduct
      ? 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.94), rgba(224,242,254,0.82) 48%, rgba(219,234,254,0.74) 100%)'
      : isScene
        ? 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 42%, #fef3c7 100%)'
        : isHero
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 44%, #312e81 100%)'
          : 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)';
  const color = isHero || isDark ? '#dbeafe' : isProduct ? '#4f46e5' : isScene ? '#0f766e' : '#4f46e5';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isCompact ? '2px' : '8px',
        padding: isCompact ? '6px' : '16px',
        background,
        color,
        textAlign: 'center',
        boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.18)',
      }}
    >
      {!isCompact && variant !== 'default' && (
        <span
          style={{
            position: 'absolute',
            inset: isHero ? '12% 8%' : '12%',
            borderRadius: isProduct ? '50%' : isHero ? '26px' : '32px',
            background: isProduct
              ? 'rgba(255,255,255,0.54)'
              : isScene
                ? 'rgba(255,255,255,0.42)'
                : 'rgba(255,255,255,0.08)',
            filter: 'blur(2px)',
          }}
        />
      )}
      {!isCompact && variant !== 'default' && (
        <span
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: isProduct ? 96 : 120,
            minHeight: isProduct ? 96 : 68,
            borderRadius: isProduct ? '999px' : '18px',
            border: '1px solid rgba(255,255,255,0.42)',
            background: isHero ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.46)',
            fontSize: isProduct ? 13 : 12,
            fontWeight: 900,
            letterSpacing: '0.08em',
          }}
        >
          {isProduct ? '商品主圖' : isScene ? '情境圖' : 'KV 視覺'}
        </span>
      )}
      <span style={{ fontSize: isCompact ? '10px' : '12px', fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1 }}>
        {state === 'error' ? '圖片載入失敗' : label}
      </span>
      <span style={{ fontSize: isCompact ? '12px' : '22px', fontWeight: 800, lineHeight: 1 }}>
        {spec.width} x {spec.height}
      </span>
      {!isCompact && (
        <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.7 }}>
          {variant === 'default' ? '請上傳指定尺寸圖檔' : '設計稿預覽，可上傳圖片覆蓋'}
        </span>
      )}
    </div>
  );
}

export function PreviewImage({ src, alt = '', label, spec, tone = 'light', state = 'empty', objectFit = 'cover' }: PreviewImageProps) {
  const [failed, setFailed] = useState(false);
  const [resolvedSrc, setResolvedSrc] = useState(src ?? '');
  const hasImage = Boolean(src?.trim());
  const isLocal = isLocalImageRef(src);
  const canRenderImage = hasImage && !failed && (!isLocal || Boolean(resolvedSrc?.startsWith('blob:')));

  useEffect(() => {
    let alive = true;
    let objectUrl = '';

    setFailed(false);
    if (!src || !isLocalImageRef(src)) {
      setResolvedSrc(src ?? '');
      return () => undefined;
    }

    setResolvedSrc('');
    resolveLocalImageUrl(src)
      .then((value) => {
        objectUrl = value;
        if (alive) {
          if (value) {
            setResolvedSrc(value);
          } else {
            setFailed(true);
          }
        }
      })
      .catch(() => {
        if (alive) setFailed(true);
      });

    return () => {
      alive = false;
      revokeResolvedLocalImageUrl(objectUrl);
    };
  }, [src]);

  if (!canRenderImage) {
    return <ImagePlaceholder label={label} spec={spec} tone={tone} state={failed ? 'error' : state} />;
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit, display: 'block' }}
      onError={() => setFailed(true)}
    />
  );
}
