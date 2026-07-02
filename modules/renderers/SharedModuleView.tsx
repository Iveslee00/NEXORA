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

export function expandFaqDetailsForNonExport(html: string) {
  if (!html.includes('cb-faq__item')) return html;

  return html
    .replace(/<details class="cb-faq__item">/g, '<div class="cb-faq__item cb-faq__item--expanded" data-nexora-static-faq="true">')
    .replace(/<summary class="cb-faq__question">/g, '<div class="cb-faq__question cb-faq__question--static">')
    .replace(/<\/summary>/g, '</div>')
    .replace(/<\/details>/g, '</div>');
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
    const updateMobileControlPosition = () => {
      const activeSlide = slides[current] ?? slides[0];
      const media = activeSlide?.querySelector<HTMLElement>('.cb-kv__img');
      const mediaHeight = media?.getBoundingClientRect().height || 0;
      if (mediaHeight > 0) {
        carousel.style.setProperty('--cb-kv-mobile-media-height', `${mediaHeight}px`);
      }
    };
    const goTo = (index: number) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('cb-kv__dot--active', dotIndex === current);
        dot.setAttribute('aria-current', dotIndex === current ? 'true' : 'false');
      });
      updateMobileControlPosition();
    };
    const onPrev = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      goTo(current - 1);
    };
    const onNext = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      goTo(current + 1);
    };
    const stopControlPointer = (event: Event) => {
      event.stopPropagation();
    };
    const dotHandlers = dots.map((dot, index) => {
      const handler = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        goTo(index);
      };
      dot.addEventListener('click', handler);
      dot.addEventListener('pointerdown', stopControlPointer);
      return () => {
        dot.removeEventListener('click', handler);
        dot.removeEventListener('pointerdown', stopControlPointer);
      };
    });
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateMobileControlPosition) : null;

    prev?.addEventListener('click', onPrev);
    next?.addEventListener('click', onNext);
    prev?.addEventListener('pointerdown', stopControlPointer);
    next?.addEventListener('pointerdown', stopControlPointer);
    observer?.observe(carousel);
    slides.forEach((slide) => {
      const media = slide.querySelector<HTMLElement>('.cb-kv__img');
      if (media) observer?.observe(media);
    });
    goTo(0);

    cleanups.push(() => {
      prev?.removeEventListener('click', onPrev);
      next?.removeEventListener('click', onNext);
      prev?.removeEventListener('pointerdown', stopControlPointer);
      next?.removeEventListener('pointerdown', stopControlPointer);
      dotHandlers.forEach((cleanup) => cleanup());
      observer?.disconnect();
      carousel.style.removeProperty('--cb-kv-mobile-media-height');
    });
  });

  root.querySelectorAll<HTMLElement>('.cb-carousel').forEach((carousel) => {
    if (carousel.getAttribute('data-cb-carousel-ready') === 'true') return;
    carousel.setAttribute('data-cb-carousel-ready', 'true');
    const outer = carousel.querySelector<HTMLElement>('.cb-carousel__track-outer');
    const track = carousel.querySelector<HTMLElement>('.cb-carousel__track');
    const items = Array.from(carousel.querySelectorAll<HTMLElement>('.cb-carousel__item'));
    const prev = carousel.querySelector<HTMLButtonElement>('.cb-carousel__btn--prev');
    const next = carousel.querySelector<HTMLButtonElement>('.cb-carousel__btn--next');
    if (!outer || !track || items.length <= 1) return;

    let current = 0;
    const getVisibleCount = () => {
      const width = outer.getBoundingClientRect().width || carousel.getBoundingClientRect().width || window.innerWidth;
      if (width < 768) return 2;
      if (width < 1024) return 3;
      return 4;
    };
    const update = () => {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, items.length - visibleCount);
      current = Math.min(current, maxIndex);
      const gapValue = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || '0');
      const gap = Number.isFinite(gapValue) ? gapValue : 0;
      const outerWidth = outer.getBoundingClientRect().width || carousel.getBoundingClientRect().width || 0;
      const itemWidth = (outerWidth - Math.max(0, visibleCount - 1) * gap) / visibleCount;
      if (!Number.isFinite(itemWidth) || itemWidth <= 0) return;
      items.forEach((it) => {
        it.style.flex = '0 0 ' + itemWidth + 'px';
      });
      track.style.transform = `translateX(-${current * (itemWidth + gap)}px)`;
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current >= maxIndex;
    };
    const onPrev = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      current = Math.max(0, current - 1);
      update();
    };
    const onNext = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      const maxIndex = Math.max(0, items.length - getVisibleCount());
      current = Math.min(maxIndex, current + 1);
      update();
    };
    const stopControlPointer = (event: Event) => {
      event.stopPropagation();
    };
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;

    prev?.addEventListener('click', onPrev);
    next?.addEventListener('click', onNext);
    prev?.addEventListener('pointerdown', stopControlPointer);
    next?.addEventListener('pointerdown', stopControlPointer);
    window.addEventListener('resize', update);
    observer?.observe(outer);
    observer?.observe(carousel);
    update();

    cleanups.push(() => {
      prev?.removeEventListener('click', onPrev);
      next?.removeEventListener('click', onNext);
      prev?.removeEventListener('pointerdown', stopControlPointer);
      next?.removeEventListener('pointerdown', stopControlPointer);
      window.removeEventListener('resize', update);
      observer?.disconnect();
      items.forEach((it) => {
        it.style.flex = '';
      });
      track.style.transform = '';
      carousel.removeAttribute('data-cb-carousel-ready');
    });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

export function SharedModuleView({ module, modules = [], mode = 'preview' }: ModuleViewProps) {
  const { isMobile } = useDevice();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const exportHtml = React.useMemo(() => renderModuleExportHTML(module, { modules }), [module, modules]);
  const previewHtml = React.useMemo(() => {
    const responsiveHtml = isMobile ? forceMobilePictureSources(exportHtml) : exportHtml;
    return mode === 'export' ? responsiveHtml : expandFaqDetailsForNonExport(responsiveHtml);
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
    target?.closest('button, input, textarea, select, [role="button"]') ?? null
  ), []);

  const getCarouselControlTarget = React.useCallback((target: HTMLElement | null) => (
    target?.closest('.cb-kv__nav, .cb-kv__dot, .cb-carousel__btn') ?? null
  ), []);

  const handlePreviewPointerDownCapture = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== 'builder') return;
    const target = event.target as HTMLElement | null;
    if (getCarouselControlTarget(target)) return;
    const interactive = getInteractivePreviewTarget(target);
    if (interactive || target?.closest('a')) {
      event.stopPropagation();
    }
  }, [getCarouselControlTarget, getInteractivePreviewTarget, mode]);

  const handlePreviewClickCapture = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'builder') return;
    const target = event.target as HTMLElement | null;
    if (getCarouselControlTarget(target)) return;
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
  }, [getCarouselControlTarget, getInteractivePreviewTarget, mode]);

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
