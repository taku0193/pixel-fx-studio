import './style.css';
import { effects, getEffect } from './effects';
import { createRenderer } from './renderer';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');

const icons = [
  '<path d="M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7M8 4l4 4 4-4M8 20l4-4 4 4M3.5 11.5 9 10 7.5 4.5M16.5 19.5 15 14l5.5-1.5M3.5 12.5 9 14l-1.5 5.5M16.5 4.5 15 10l5.5 1.5"/>',
  '<path d="M13 2c1 6-4 7-3 11 1-2 3-3 4-4 4 4 6 7 4 10-3 5-11 4-13-1C3 12 8 9 7 5c3 1 4 3 4 4 2-2 2-5 2-7Z"/>',
  '<path d="m14 2-9 12h6l-1 8 9-12h-6l1-8Z"/>',
];

app.innerHTML = `
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="./" aria-label="Pixel FX Studio ホーム">
        <svg class="brand-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 0h6v6h6v6h-6v6H9v-6H3V6h6ZM18 18h6v6h-6Z"/></svg>
        <span>Pixel FX <span class="brand-light">Studio</span></span>
      </a>
      <span class="topbar-note">小さなエフェクトの作業室</span>
    </div>
  </header>
  <main>
    <div class="intro">
      <p class="eyebrow">PIXEL ART, IN MOTION</p>
      <h1>ピクセルに、動きを。</h1>
      <p class="intro-copy">エフェクトを選んで、お気に入りの瞬間を見つけよう。</p>
    </div>
    <div class="workspace">
      <aside class="effects-panel">
        <fieldset>
          <legend>エフェクト <span class="count">03</span></legend>
          <div class="effect-list">
            ${effects.map((effect, index) => `
              <label class="effect-choice ${effect.category.toLowerCase()}">
                <input type="radio" name="effect" value="${effect.id}" ${index === 0 ? 'checked' : ''}>
                <span class="effect-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[index]}</svg></span>
                <span class="effect-label"><small>${effect.category}</small><strong>${effect.name}</strong></span>
                <span class="choice-indicator" aria-hidden="true"></span>
              </label>
            `).join('')}
          </div>
        </fieldset>
        <p class="selection-note">選ぶだけで、すぐに再生。<br>エフェクトは自動で繰り返します。</p>
      </aside>
      <section class="preview-panel" aria-labelledby="effect-name">
        <div class="preview-toolbar">
          <div class="preview-heading"><span class="preview-label">プレビュー</span><h2 id="effect-name"></h2></div>
          <span class="playback-status"><span class="status-dot"></span><span id="playback-label">再生中</span></span>
        </div>
        <div class="preview-stage"><canvas width="320" height="288"></canvas></div>
        <div class="preview-caption"><p id="effect-description"></p><span>320 × 288 <span class="unit">PX</span></span></div>
      </section>
    </div>
    <p class="message error-message" role="alert" hidden></p>
    <footer><span>ひとつずつのピクセルから、ひとつの表現へ。</span><span>Effects by <a href="https://github.com/patch-gg/pixelfx" target="_blank" rel="noreferrer">pixelfx ↗</a></span></footer>
  </main>
`;

const canvas = app.querySelector<HTMLCanvasElement>('canvas')!;
const errorMessage = app.querySelector<HTMLParagraphElement>('[role="alert"]')!;
const name = app.querySelector<HTMLHeadingElement>('#effect-name')!;
const description = app.querySelector<HTMLParagraphElement>('#effect-description')!;
const playbackLabel = app.querySelector<HTMLSpanElement>('#playback-label')!;
const playbackStatus = app.querySelector<HTMLSpanElement>('.playback-status')!;
const inputs = [...app.querySelectorAll<HTMLInputElement>('input[name="effect"]')];

function showRenderError() {
  errorMessage.textContent = 'エフェクトを再生できませんでした。もう一度エフェクトを選ぶか、ページを再読み込みしてください。';
  errorMessage.hidden = false;
  playbackLabel.textContent = '再生エラー';
  playbackStatus.classList.add('is-error');
}

let renderer: ReturnType<typeof createRenderer> | undefined;
try {
  renderer = createRenderer(canvas, showRenderError);
} catch {
  showRenderError();
  inputs.forEach((input) => { input.disabled = true; });
}

function selectEffect(id: string) {
  const effect = getEffect(id);
  if (!effect || !renderer) return;
  try {
    renderer.select(effect);
    name.textContent = effect.name;
    description.textContent = effect.description;
    canvas.setAttribute('aria-label', `${effect.name} のアニメーション`);
    errorMessage.hidden = true;
    playbackLabel.textContent = '再生中';
    playbackStatus.classList.remove('is-error');
  } catch {
    showRenderError();
  }
}

inputs.forEach((input) => {
  input.addEventListener('change', () => { if (input.checked) selectEffect(input.value); });
});
selectEffect(effects[0].id);

// Keep native radio keyboard behavior and clear the animation on page/HMR teardown.
function dispose() { renderer?.dispose(); }
function onPageHide(event: PageTransitionEvent) {
  if (!event.persisted) dispose();
}
window.addEventListener('pagehide', onPageHide);
if (import.meta.hot) import.meta.hot.dispose(() => {
  dispose();
  window.removeEventListener('pagehide', onPageHide);
});
