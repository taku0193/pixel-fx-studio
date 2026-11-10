import './style.css';
import { effects, getEffect, type Effect } from './effects';
import { exportPng } from './export-png';
import { createRenderer } from './renderer';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');

const icons: Record<Effect['category'], string> = {
  ICE: '<path d="M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7M8 4l4 4 4-4M8 20l4-4 4 4M3.5 11.5 9 10 7.5 4.5M16.5 19.5 15 14l5.5-1.5M3.5 12.5 9 14l-1.5 5.5M16.5 4.5 15 10l5.5 1.5"/>',
  FIRE: '<path d="M13 2c1 6-4 7-3 11 1-2 3-3 4-4 4 4 6 7 4 10-3 5-11 4-13-1C3 12 8 9 7 5c3 1 4 3 4 4 2-2 2-5 2-7Z"/>',
  LIGHTNING: '<path d="m14 2-9 12h6l-1 8 9-12h-6l1-8Z"/>',
  WATER: '<path d="M12 2s-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13Z M8 15a4 4 0 0 0 4 4"/>',
  EXPLOSIONS: '<path d="M12 2v5m0 10v5M2 12h5m10 0h5M5 5l4 4m6 6 4 4M5 19l4-4m6-6 4-4"/><circle cx="12" cy="12" r="2"/>',
  ARCANE: '<path d="m12 2 9 10-9 10L3 12 12 2Zm0 5 4 5-4 5-4-5 4-5Z"/>',
  HOLY: '<ellipse cx="12" cy="8" rx="9" ry="4"/><path d="M5 15v3m7-2v6m7-7v3"/>',
  SHADOW: '<circle cx="12" cy="12" r="4"/><path d="M20 7a10 10 0 0 0-15 1m-1 9a10 10 0 0 0 15-1M7 4a10 10 0 0 0 1 15m9 1a10 10 0 0 0-1-15"/>',
  NATURE: '<path d="M20 3C8 2 2 7 5 15c8 7 15 0 15-12ZM4 21 16 8M8 17v-6m0 6h6"/>',
  WEATHER: '<path d="M6 14a4 4 0 0 1 0-8 6 6 0 0 1 11-1 4.5 4.5 0 1 1 1 9H6Zm1 4-1 3m7-3-1 3m7-3-1 3"/>',
  'SCI-FI': '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z"/><circle cx="12" cy="12" r="4"/><path d="M12 8v8m-4-4h8"/>',
  PICKUPS: '<path d="m7 3-5 6 10 13L22 9l-5-6H7Zm-5 6h20M7 3l5 19 5-19"/>',
  CRITTERS: '<path d="M12 8C4-2 0 6 5 12c-6 5-1 13 7 3 8 10 13 2 7-3 5-6 1-14-7-4Zm0 0v10m0-10-3-5m3 5 3-5"/>',
};

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
          <legend>エフェクト <span class="count">${String(effects.length).padStart(2, '0')}</span></legend>
          <p class="catalog-hint">スクロールして、ほかのエフェクトへ。</p>
          <div class="effect-list" aria-label="エフェクト一覧">
            ${effects.map((effect, index) => `
              <label class="effect-choice ${effect.category.toLowerCase()}">
                <input type="radio" name="effect" value="${effect.id}" ${index === 0 ? 'checked' : ''}>
                <span class="effect-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[effect.category]}</svg></span>
                <span class="effect-label"><small>${effect.category}</small><strong>${effect.name}</strong></span>
                <span class="choice-indicator" aria-hidden="true"></span>
              </label>
            `).join('')}
          </div>
        </fieldset>
        <p class="selection-note">一時停止で、瞬間をじっくり。<br>気に入ったフレームを保存できます。</p>
      </aside>
      <section class="preview-panel" aria-labelledby="effect-name">
        <div class="preview-toolbar">
          <div class="preview-heading"><span class="preview-label">プレビュー</span><h2 id="effect-name">${effects[0].name}</h2></div>
          <div class="preview-actions">
            <span class="playback-status"><span class="status-dot"></span><span id="playback-label" aria-live="polite">再生中</span></span>
            <button class="playback-button" type="button" disabled aria-controls="effect-preview"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4v12M13 4v12"/></svg><span>一時停止</span></button>
            <button class="save-button" type="button" disabled aria-label="現在のフレームをPNGで保存"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v10m-4-4 4 4 4-4M3 12v5h14v-5"/></svg>PNGを保存</button>
          </div>
        </div>
        <div class="preview-stage"><canvas id="effect-preview" width="320" height="288"></canvas></div>
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
const playbackButton = app.querySelector<HTMLButtonElement>('.playback-button')!;
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
  playbackStatus.classList.remove('is-paused');
  playbackButton.disabled = true;
  saveButton.disabled = true;
}

let renderer: ReturnType<typeof createRenderer> | undefined;
try {
  renderer = createRenderer(canvas, showRenderError);
} catch {
  showRenderError();
  inputs.forEach((input) => { input.disabled = true; });
}

function updatePlaybackUi() {
  const paused = renderer!.isPaused;
  playbackLabel.textContent = paused ? '一時停止中' : '再生中';
  playbackStatus.classList.toggle('is-paused', paused);
  playbackStatus.classList.remove('is-error');
  playbackButton.querySelector('span')!.textContent = paused ? '再生' : '一時停止';
  playbackButton.querySelector('path')!.setAttribute('d', paused ? 'M7 4 15 10 7 16Z' : 'M7 4v12M13 4v12');
  playbackButton.disabled = false;
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
    updatePlaybackUi();
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

playbackButton.addEventListener('click', () => {
  if (!renderer || playbackButton.disabled) return;
  if (renderer.isPaused) renderer.resume();
  else renderer.pause();
  updatePlaybackUi();
});

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
