import { HeroCarouselData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';
import { getKvImageSpecs } from '@/lib/assets/imageSpecs';
import { renderImagePlaceholder } from '@/modules/definitions/imagePlaceholder';

export function generateHeroCarouselHTML(data: HeroCarouselData): string {
  const bgOverride = data.backgroundColor ? ` style="background: ${escapeHtml(data.backgroundColor)}"` : '';
  const heightClass = `cb-kv--${data.height ?? 'medium'}`;

  const slides = data.slides
    .map((s) => {
      const showText = s.showText !== false;
      const imageSpecs = getKvImageSpecs(data.height, showText);
      const titleStyle = ` style="color: ${escapeHtml(s.titleColor || '#ffffff')}"`;
      const textStyle = ` style="color: ${escapeHtml(s.textColor || '#ffffff')}"`;
      const textBgStyle = '';
      const align = s.alignment ?? 'left';
      const imgEl = s.image
        ? `\n        <picture class="cb-kv__picture">${s.mobileImage ? `\n          <source media="(max-width: 767px)" srcset="${escapeHtml(s.mobileImage)}">` : ''}\n          <img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.title || '')}" class="cb-kv__bg">\n        </picture>`
        : renderImagePlaceholder(showText ? 'KV 輪播 PC 圖片區' : 'KV 輪播 PC 滿版', imageSpecs.desktop, 'dark');

      const title = showText && s.title ? `          <h2 class="cb-kv__title"${titleStyle}>${escapeHtml(s.title)}</h2>` : '';
      const subtitle = showText && s.subtitle ? `          <p class="cb-kv__subtitle"${textStyle}>${escapeHtml(s.subtitle)}</p>` : '';
      const btn = showText && s.buttonText
        ? `          <a href="${escapeHtml(s.buttonLink || '#')}" class="cb-btn cb-kv__btn">${escapeHtml(s.buttonText)}</a>`
        : '';
      const imageContent = imgEl;
      const linkedImageContent = !showText && s.buttonLink && s.buttonLink !== '#'
        ? `<a href="${escapeHtml(s.buttonLink)}" class="cb-kv__link">${imageContent}\n        </a>`
        : imageContent;

      return `    <div class="cb-kv__slide${showText ? '' : ' cb-kv__slide--image-only'}">
${showText ? `      <div class="cb-kv__text cb-kv__text--${align}"${textBgStyle}>
${title}
${subtitle}
${btn}
      </div>` : ''}
      <div class="cb-kv__img">${linkedImageContent}
      </div>
    </div>`;
    })
    .join('\n');

  const dotsHTML = data.slides.length > 1
    ? `  <div class="cb-kv__dots">
${data.slides.map((_, i) => `    <button class="cb-kv__dot${i === 0 ? ' cb-kv__dot--active' : ''}" data-idx="${i}" aria-label="Slide ${i + 1}"></button>`).join('\n')}
  </div>`
    : '';

  const navHTML = data.slides.length > 1
    ? `  <button class="cb-kv__nav cb-kv__nav--prev" aria-label="Previous">&#8592;</button>
  <button class="cb-kv__nav cb-kv__nav--next" aria-label="Next">&#8594;</button>`
    : '';

  return `<section class="cb-kv ${heightClass}"${bgOverride}>
  <div class="cb-kv__track">
${slides}
  </div>
${navHTML}
${dotsHTML}
</section>`;
}

export function generateHeroCarouselScript(): string {
  return `<script>
(function() {
  function initNexoraKvCarousels() {
  document.querySelectorAll('.cb-kv').forEach(function(kv) {
    if (kv.getAttribute('data-cb-kv-ready') === 'true') return;
    kv.setAttribute('data-cb-kv-ready', 'true');
    var track = kv.querySelector('.cb-kv__track');
    var slides = kv.querySelectorAll('.cb-kv__slide');
    var dots = kv.querySelectorAll('.cb-kv__dot');
    var total = slides.length;
    if (!track || total < 2) return;
    var cur = 0;
    var timer = null;
    function goTo(idx) {
      cur = (idx + total) % total;
      track.style.transform = 'translateX(-' + (cur * 100) + '%)';
      dots.forEach(function(d, i) { d.classList.toggle('cb-kv__dot--active', i === cur); });
    }
    function startAuto() { timer = setInterval(function() { goTo(cur + 1); }, 4000); }
    function stopAuto() { clearInterval(timer); }
    kv.addEventListener('mouseenter', stopAuto);
    kv.addEventListener('mouseleave', startAuto);
    var prev = kv.querySelector('.cb-kv__nav--prev');
    var next = kv.querySelector('.cb-kv__nav--next');
    if (prev) prev.addEventListener('click', function() { stopAuto(); goTo(cur - 1); startAuto(); });
    if (next) next.addEventListener('click', function() { stopAuto(); goTo(cur + 1); startAuto(); });
    dots.forEach(function(d, i) { d.addEventListener('click', function() { stopAuto(); goTo(i); startAuto(); }); });
    startAuto();
  });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNexoraKvCarousels);
  } else {
    initNexoraKvCarousels();
  }
})();
</script>`;
}
