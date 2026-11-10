import './style.css';
import { effects, getEffect, type Effect } from './effects';
import { exportPng } from './export-png';
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
      <p class="intro-copy">エフェクトを選んで、お気に入りの瞬間をPNGに。</p>
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
          <div class="preview-heading"><span class="preview-label">プレビュー</span><h2 id="effect-name">${effects[0].name}</h2></div>
          <div class="preview-actions">
            <span class="playback-status"><span class="status-dot"></span><span id="playback-label">再生中</span></span>
            <button class="save-button" type="button" disabled aria-label="現在のフレームをPNGで保存"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v10m-4-4 4 4 4-4M3 12v5h14v-5"/></svg>PNGを保存</button>
          </div>
        </div>
        <div class="preview-stage"><canvas width="320" height="288"></canvas></div>
        <div class="preview-caption"><p id="effect-description">${effects[0].description}</p><span>320 × 288 <span class="unit">PX</span></span></div>
      </section>
    </div>
    <p class="message error-message" role="alert" hidden></p>
    <p class="save-status" role="status"></p>
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
const saveButton = app.querySelector<HTMLButtonElement>('.save-button')!;
const saveStatus = app.querySelector<HTMLParagraphElement>('[role="status"]')!;
let selected: Effect | undefined;
let exporting = false;

function showRenderError() {
  errorMessage.textContent = 'エフェクトを再生できませんでした。もう一度エフェクトを選ぶか、ページを再読み込みしてください。';
  errorMessage.hidden = false;
  playbackLabel.textContent = '再生エラー';
  playbackStatus.classList.add('is-error');
  saveButton.disabled = true;
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
    selected = effect;
    name.textContent = effect.name;
    description.textContent = effect.description;
    canvas.setAttribute('aria-label', `${effect.name} のアニメーション`);
    errorMessage.hidden = true;
    playbackLabel.textContent = '再生中';
    playbackStatus.classList.remove('is-error');
    saveButton.disabled = exporting;
    if (!exporting) saveStatus.textContent = '';
  } catch {
    showRenderError();
  }
}

inputs.forEach((input) => {
  input.addEventListener('change', () => { if (input.checked) selectEffect(input.value); });
});
selectEffect(effects[0].id);

saveButton.addEventListener('click', async () => {
  if (!selected || exporting) return;
  const captured = selected;
  exporting = true;
  saveButton.disabled = true;
  errorMessage.hidden = true;
  saveStatus.textContent = 'PNGを準備しています…';
  try {
    await exportPng(canvas, captured.id);
    saveStatus.textContent = 'PNGのダウンロードを開始しました。';
  } catch (error) {
    saveStatus.textContent = '';
    errorMessage.textContent = error instanceof Error ? error.message : 'PNGを保存できませんでした。もう一度お試しください。';
    errorMessage.hidden = false;
  } finally {
    exporting = false;
    saveButton.disabled = playbackStatus.classList.contains('is-error');
  }
});

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
