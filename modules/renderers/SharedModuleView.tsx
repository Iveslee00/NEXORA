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

export function SharedModuleView({ module, modules = [], mode = 'preview' }: ModuleViewProps) {
  const { isMobile } = useDevice();
  const exportHtml = React.useMemo(() => renderModuleExportHTML(module, { modules }), [module, modules]);
  const previewHtml = React.useMemo(() => (isMobile ? forceMobilePictureSources(exportHtml) : exportHtml), [exportHtml, isMobile]);
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

  return (
    <div
      className="cb-page"
      data-nexora-module-view={module.type}
      data-nexora-render-mode={mode}
      style={{ background: 'transparent' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
