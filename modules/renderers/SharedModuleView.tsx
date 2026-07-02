'use client';

import React from 'react';
import { useDevice } from '@/contexts/DeviceContext';
import { isLocalImageRef, resolveLocalImageUrl, revokeResolvedLocalImageUrl } from '@/lib/assets/localImageStore';
import { renderModuleExportHTML } from '@/lib/modules/moduleRegistry';
import type { ModuleViewProps } from './types';

const localImagePattern = /local-image:\/\/[a-zA-Z0-9_-]+/g;
const picturePattern = /<picture\b[^>]*>[\s\S]*?<\/picture>/g;
const mobileSourcePattern = /<source\b([^>]*\bmedia="[^"]*max-width:\s*767px[^"]*"[^>]*)>/i;
const srcsetPattern = /\bsrcset="([^"]+)"/i;
const imgSrcPattern = /(<img\b[^>]*\bsrc=")([^"]*)(")/i;

function getFirstSrcFromSrcset(srcset: string) {
  return srcset.split(',')[0]?.trim().split(/\s+/)[0] ?? '';
}

function normalizePreviewFaqHtml(html: string) {
  if (!html.includes('cb-faq')) return html;

  return html
    .replaceAll('<details class="cb-faq__item">', '<div class="cb-faq__item" data-nexora-faq-item="true">')
    .replaceAll('<summary class="cb-faq__question">', '<button type="button" class="cb-faq__question" data-nexora-faq-trigger="true" aria-expanded="false">')
    .replaceAll('<div class="cb-faq__answer"', '<div class="cb-faq__answer" hidden')
    .replaceAll('</summary>', '</button>')
    .replaceAll('</details>', '</div>');
}

export function forceMobilePictureSources(html: string) {
  return html.replace(picturePattern, (picture) => {
    const sourceMatch = picture.match(mobileSourcePattern);
    if (!sourceMatch) return picture;

    const srcset = sourceMatch[1].match(srcsetPattern)?.[1] ?? '';
    const mobileSrc = getFirstSrcFromSrcset(srcset);
    if (!mobileSrc || !imgSrcPattern.test(picture)) return picture;

    return picture.replace(imgSrcPattern, `$1${mobileSrc}$3 data-nexora-original-media="${sourceMatch[1].replace(/"/g, '&quot;')}" data-nexora-forced-mobile-src="${mobileSrc}"`);
  });
}

async function resolveLocalImageRefsInHtml(html: string) {
  const refs = Array.from(new Set(html.match(localImagePattern) ?? []));
  if (refs.length === 0) return { html, objectUrls: [] as string[] };

  const replacements = await Promise.all(
    refs.map(async (ref) => {
      if (!isLocalImageRef(ref)) return [ref, ref] as const;
      const resolved = await resolveLocalImageUrl(ref);
      return [ref, resolved || ref] as const;
    })
  );

  let resolvedHtml = html;
  const objectUrls: string[] = [];
  replacements.forEach(([ref, resolved]) => {
    if (resolved.startsWith('blob:')) objectUrls.push(resolved);
    resolvedHtml = resolvedHtml.split(ref).join(resolved);
  });

  return { html: resolvedHtml, objectUrls };
}

function initializePreviewFaq(root: HTMLElement) {
  const cleanups: Array<() => void> = [];

  root.querySelectorAll<HTMLElement>('[data-nexora-faq-item="true"]').forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('[data-nexora-faq-trigger="true"]');
    const answer = item.querySelector<HTMLElement>('.cb-faq__answer');
    if (!trigger || !answer) return;

    const onPointerDown = (event: PointerEvent) => {
      event.stopPropagation();
    };
    const onClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const nextOpen = !item.classList.contains('is-open');
      item.classList.toggle('is-open', nextOpen);
      answer.hidden = !nextOpen;
      trigger.setAttribute('aria-expanded', String(nextOpen));
    };

    answer.hidden = !item.classList.contains('is-open');
    trigger.addEventListener('pointerdown', onPointerDown);
    trigger.addEventListener('click', onClick);

    cleanups.push(() => {
      trigger.removeEventListener('pointerdown', onPointerDown);
      trigger.removeEventListener('click', onClick);
    });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

function initializePreviewCarousels(root: HTMLElement) {
  const cleanups: Array<() => void> = [];

  root.querySelectorAll<HTMLElement>('.cb-kv').forEach((carousel) => {
    const track = carousel.querySelector<HTMLElement>('.cb-kv__track');
    const slides = Array.from(carousel.querySelectorAll<HTMLElement>('.cb-kv__slide'));
    const dots = Array.from(carousel.querySelectorAll<HTMLButtonElement>('.cb-kv__dot'));
    const prev = carousel.querySelector<HTMLButtonElement>('.cb-kv__nav--prev');
    const next = carousel.querySelector<HTMLButtonElement>('.cb-kv__nav--next');
    if (!track || slides.length <= 1) return;

    let current = 0;
    const goTo = (index: number) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === current);
        dot.setAttribute('aria-current', dotIndex === current ? 'true' : 'false');
      });
    };
    const onPrev = () => goTo(current - 1);
    const onNext = () => goTo(current + 1);
    const dotHandlers = dots.map((dot, index) => {
      const handler = () => goTo(index);
      dot.addEventListener('click', handler);
      return () => dot.removeEventListener('click', handler);
    });

    prev?.addEventListener('click', onPrev);
    next?.addEventListener('click', onNext);
    goTo(0);

    cleanups.push(() => {
      prev?.removeEventListener('click', onPrev);
      next?.removeEventListener('click', onNext);
      dotHandlers.forEach((cleanup) => cleanup());
    });
  });

  root.querySelectorAll<HTMLElement>('.cb-carousel').forEach((carousel) => {
    const track = carousel.querySelector<HTMLElement>('.cb-carousel__track');
    const items = Array.from(carousel.querySelectorAll<HTMLElement>('.cb-carousel__item'));
    const prev = carousel.querySelector<HTMLButtonElement>('.cb-carousel__btn--prev');
    const next = carousel.querySelector<HTMLButtonElement>('.cb-carousel__btn--next');
    if (!track || items.length <= 1) return;

    let current = 0;
    const getVisibleCount = () => {
      const width = carousel.getBoundingClientRect().width || window.innerWidth;
      if (width < 640) return 1;
      if (width < 960) return 2;
      return 4;
    };
    const update = () => {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, items.length - visibleCount);
      current = Math.min(current, maxIndex);
      const itemWidth = items[0]?.getBoundingClientRect().width ?? 0;
      const gapValue = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || '0');
      const gap = Number.isFinite(gapValue) ? gapValue : 0;
      track.style.transform = `translateX(-${current * (itemWidth + gap)}px)`;
    };
    const onPrev = () => {
      current = Math.max(0, current - 1);
      update();
    };
    const onNext = () => {
      const maxIndex = Math.max(0, items.length - getVisibleCount());
      current = Math.min(maxIndex, current + 1);
      update();
    };

    prev?.addEventListener('click', onPrev);
    next?.addEventListener('click', onNext);
    window.addEventListener('resize', update);
    update();

    cleanups.push(() => {
      prev?.removeEventListener('click', onPrev);
      next?.removeEventListener('click', onNext);
      window.removeEventListener('resize', update);
    });
  });

  cleanups.push(initializePreviewFaq(root));

  return () => cleanups.forEach((cleanup) => cleanup());
}

export function SharedModuleView({ module, modules = [], mode = 'preview' }: ModuleViewProps) {
  const { isMobile } = useDevice();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const exportHtml = React.useMemo(() => renderModuleExportHTML(module, { modules }), [module, modules]);
  const previewHtml = React.useMemo(() => {
    const deviceHtml = isMobile ? forceMobilePictureSources(exportHtml) : exportHtml;
    return mode === 'builder' ? normalizePreviewFaqHtml(deviceHtml) : deviceHtml;
  }, [exportHtml, isMobile, mode]);
  const [html, setHtml] = React.useState(previewHtml);

  React.useEffect(() => {
    let alive = true;
    let objectUrls: string[] = [];

    setHtml(previewHtml);

    resolveLocalImageRefsInHtml(previewHtml)
      .then((result) => {
        objectUrls = result.objectUrls;
        if (alive) setHtml(result.html);
      })
      .catch(() => {
        if (alive) setHtml(previewHtml);
      });

    return () => {
      alive = false;
      objectUrls.forEach(revokeResolvedLocalImageUrl);
    };
  }, [previewHtml]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cleanup: (() => void) | undefined;
    const frame = window.requestAnimationFrame(() => {
      cleanup = initializePreviewCarousels(root);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      cleanup?.();
    };
  }, [html]);

  const getInteractivePreviewTarget = React.useCallback((target: HTMLElement | null) => (
    target?.closest('summary, button, input, textarea, select, [role="button"]') ?? null
  ), []);

  const handlePreviewPointerDownCapture = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== 'builder') return;
    const target = event.target as HTMLElement | null;
    const interactive = getInteractivePreviewTarget(target);
    if (interactive || target?.closest('a')) {
      event.stopPropagation();
    }
  }, [getInteractivePreviewTarget, mode]);

  const handlePreviewClickCapture = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'builder') return;
    const target = event.target as HTMLElement | null;
    const interactive = getInteractivePreviewTarget(target);
    if (interactive) {
      event.stopPropagation();
      return;
    }

    const link = target?.closest('a');
    if (link) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, [getInteractivePreviewTarget, mode]);

  return (
    <div
      ref={rootRef}
      className="cb-page"
      data-nexora-module-view={module.type}
      data-nexora-render-mode={mode}
      style={{ background: 'transparent' }}
      onPointerDownCapture={handlePreviewPointerDownCapture}
      onClickCapture={handlePreviewClickCapture}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
