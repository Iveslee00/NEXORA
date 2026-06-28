'use client';

import { useEffect, useState } from 'react';
import { ImageSpec } from '@/lib/assets/imageSpecs';
import { isLocalImageRef, resolveLocalImageUrl, revokeResolvedLocalImageUrl } from '@/lib/assets/localImageStore';

interface ImagePlaceholderProps {
  label: string;
  spec: ImageSpec;
  tone?: 'light' | 'dark';
  state?: 'empty' | 'error';
}

interface PreviewImageProps extends ImagePlaceholderProps {
  src?: string;
  alt?: string;
  objectFit?: React.CSSProperties['objectFit'];
}

export function ImagePlaceholder({ label, spec, tone = 'light', state = 'empty' }: ImagePlaceholderProps) {
  const isDark = tone === 'dark';
  const isCompact = spec.height <= 80;

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
        background: isDark
          ? 'linear-gradient(135deg, #141827 0%, #20243a 100%)'
          : 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)',
        color: isDark ? '#c7d2fe' : '#4f46e5',
        textAlign: 'center',
        boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.18)',
      }}
    >
      <span style={{ fontSize: isCompact ? '10px' : '12px', fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1 }}>
        {state === 'error' ? '圖片載入失敗' : label}
      </span>
      <span style={{ fontSize: isCompact ? '12px' : '22px', fontWeight: 800, lineHeight: 1 }}>
        {spec.width} x {spec.height}
      </span>
      {!isCompact && (
        <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.7 }}>
          請上傳指定尺寸圖檔
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
