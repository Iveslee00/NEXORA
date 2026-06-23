import { HeroCarouselData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateHeroCarouselHTML(data: HeroCarouselData): string {
  const bgOverride = data.backgroundColor ? ` style="background-color: ${escapeHtml(data.backgroundColor)}"` : '';
  const heightClass = `cb-kv--${data.height ?? 'medium'}`;

  const slides = data.slides
    .map((s) => {
      const overlay = s.overlayOpacity ? `rgba(0,0,0,${(s.overlayOpacity / 100).toFixed(2)})` : null;
      const titleStyle = s.titleColor ? ` style="color: ${escapeHtml(s.titleColor)}"` : '';
      const textStyle = s.textColor ? ` style="color: ${escapeHtml(s.textColor)}"` : '';
      const textBgStyle = s.textBgColor ? ` style="background-color: ${escapeHtml(s.textBgColor)}"` : '';
      const align = s.alignment ?? 'left';

      const title = s.title ? `          <h2 class="cb-kv__title"${titleStyle}>${escapeHtml(s.title)}</h2>` : '';
      const subtitle = s.subtitle ? `          <p class="cb-kv__subtitle"${textStyle}>${escapeHtml(s.subtitle)}</p>` : '';
      const btn = s.buttonText
        ? `          <a href="${escapeHtml(s.buttonLink || '#')}" class="cb-btn cb-kv__btn">${escapeHtml(s.buttonText)}</a>`
        : '';
      const overlayEl = overlay ? `\n        <div class="cb-kv__overlay" style="background: ${overlay}"></div>` : '';
      const imgEl = s.image ? `\n        <img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.title || '')}" class="cb-kv__bg">` : '';

      return `    <div class="cb-kv__slide">
      <div class="cb-kv__text cb-kv__text--${align}"${textBgStyle}>
${title}
${subtitle}
${btn}
      </div>
      <div class="cb-kv__img">${imgEl}${overlayEl}
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
  document.querySelectorAll('.cb-kv').forEach(function(kv) {
    var track = kv.querySelector('.cb-kv__track');
    var slides = kv.querySelectorAll('.cb-kv__slide');
    var dots = kv.querySelectorAll('.cb-kv__dot');
    var total = slides.length;
    if (total < 2) return;
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
})();
</script>`;
}
