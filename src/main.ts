import './style.css';
import { categories, categoryLabels, effects, getEffect, getEffectsByCategory, searchEffects, type Effect } from './effects';
import { exportPng } from './export-png';
import { getPreviewLayout } from './preview';
import { createRenderer, type PlaybackState } from './renderer';
import { clampPan, getViewportScale, type Zoom } from './viewport';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');
const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const svg = (path: string, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const pauseIcon = '<path d="M9 5v14M15 5v14"/>';
const playIcon = '<path d="m9 5 11 7-11 7V5Z"/>';

app.innerHTML = `
  <header class="topbar"><div class="topbar-inner">
    <a class="brand" href="./" aria-label="Pixel FX Studio ホーム"><span class="brand-mark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 1h6v6h6v6h-6v6H9v-6H3V7h6ZM18 18h5v5h-5Z"/></svg></span><span>PIXEL FX<span class="brand-light">STUDIO</span></span></a>
    <div class="header-status"><span class="status-dot"></span>LOCAL WORKSPACE<span class="header-divider"></span><span>CREATIVE TOOLS / 01</span></div><span class="mobile-tag">STUDIO / 01</span>
  </div></header>
  <main>
    <div class="intro"><div><p class="eyebrow"><span></span>SMALL PIXELS. BIG ENERGY.</p><h1>その一瞬に、<span>ひらめきを。</span></h1><p class="intro-copy">選んで、動かして。最高のフレームを持ち帰ろう。</p></div><div class="catalog-stats"><div><strong>${effects.length}<span>+</span></strong><small>PIXEL EFFECTS</small></div><span class="stats-divider"></span><div><strong>${categories.length}</strong><small>CATEGORIES</small></div></div></div>
    <div class="workspace">
      <aside class="effects-panel" aria-labelledby="library-title">
        <div class="panel-heading"><div><span class="section-index">01 / EXPLORE</span><h2 id="library-title">エフェクトライブラリ</h2></div><span class="count">${effects.length}</span></div>
        <div class="catalog-filters"><label class="search-wrap" for="effect-search">${svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>')}<span class="sr-only">エフェクトを検索</span><input id="effect-search" type="search" placeholder="雪、炎、魔法…ひらめきを探す" autocomplete="off"></label><div class="category-wrap">${svg('<path d="M4 5h16M7 12h10m-7 7h4"/>')}<label class="sr-only" for="category-filter">カテゴリ</label><select id="category-filter"><option value="all">すべてのカテゴリ</option>${categories.map((category) => `<option value="${category}">${categoryLabels[category]} / ${category} (${getEffectsByCategory(category).length})</option>`).join('')}</select></div></div>
        <div class="catalog-summary"><span class="catalog-hint">${effects.length}種類のエフェクト</span><span>SELECT TO PREVIEW ${svg('<path d="m8 5 7 7-7 7"/>')}</span></div>
        <div class="effect-list" role="radiogroup" aria-label="エフェクト一覧">${effects.map((effect, index) => `<label class="effect-choice" title="${escape(effect.label)} / ${escape(effect.name)}"><input type="radio" name="effect" value="${effect.id}" ${index === 0 ? 'checked' : ''}><span class="thumbnail"><img src="/thumbnails/${effect.id.replaceAll('/', '--')}.png" alt="" width="240" height="160" loading="lazy" decoding="async"><span class="effect-category">${effect.category}</span><span class="choice-indicator" aria-hidden="true">${svg('<path d="m6 12 4 4 8-8"/>')}</span></span><span class="effect-label"><strong>${escape(effect.label)}</strong><small>${escape(effect.name)}</small></span></label>`).join('')}</div>
        <div class="catalog-empty" role="status" hidden>${svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4M8 10.5h5"/>')}<p>一致するエフェクトがありません。</p><button class="reset-filter" type="button">絞り込みをリセット</button></div>
        <div class="library-foot"><span class="tiny-grid" aria-hidden="true">▦</span>すべてのエフェクトが、あなたの素材に。</div>
      </aside>
      <section class="preview-panel" aria-labelledby="effect-name">
        <div class="preview-toolbar"><div class="preview-heading"><span class="section-index">02 / PLAYGROUND</span><h2 id="effect-name">${effects[0].label}</h2><span id="effect-english">${effects[0].name}</span></div><div class="playback-status"><span class="status-dot"></span><span id="playback-label">LIVE PREVIEW</span></div></div>
        <div class="preview-stage" tabindex="0" role="group" aria-label="プレビュー。Spaceで再生・停止、右矢印で1コマ進む、Homeで先頭に戻る。"><div class="stage-top"><span class="stage-category">ICE</span><span class="stage-fps">30 FPS</span></div><span class="stage-corner corner-tl" aria-hidden="true"></span><span class="stage-corner corner-tr" aria-hidden="true"></span><span class="stage-corner corner-bl" aria-hidden="true"></span><span class="stage-corner corner-br" aria-hidden="true"></span><canvas id="effect-preview" width="320" height="288" role="img"></canvas><div class="stage-bottom"><span>FRAME <b id="frame-number">000</b></span><span class="stage-scale">FIT · 100%</span></div></div>
        <div class="transport"><div class="transport-play"><button class="icon-button restart-button" type="button" aria-label="先頭に戻る" title="先頭に戻る" disabled>${svg('<path d="M4 10a8 8 0 1 1 1.8 7M4 4v6h6"/>')}</button><button class="playback-button" type="button" aria-controls="effect-preview" disabled>${svg(pauseIcon)}<span>一時停止</span></button><button class="icon-button step-button" type="button" aria-label="1コマ進む" title="1コマ進む" disabled>${svg('<path d="m5 5 10 7-10 7V5ZM19 5v14"/>')}</button></div><div class="zoom-control" role="group" aria-label="プレビューの表示倍率"><button type="button" data-zoom="fit" aria-pressed="true">Fit</button><button type="button" data-zoom="2" aria-pressed="false">2×</button><button type="button" data-zoom="4" aria-pressed="false">4×</button></div></div>
        <div class="preview-details"><div class="details-head"><span class="details-label">FRAME OUTPUT</span><span class="preview-dimensions">320 × 288 <small>PX</small></span></div><div class="export-row"><label class="output-background"><span>背景</span><select id="output-background" disabled><option value="solid">背景あり</option><option value="transparent">透過</option></select></label><span class="transition-background" hidden>星空背景</span><button class="save-button" type="button" disabled aria-label="現在のフレームをPNGで保存">${svg('<path d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5"/>')}<span>PNGを書き出す</span>${svg('<path d="M5 12h14m-5-5 5 5-5 5"/>', 'export-arrow')}</button></div><details class="effect-info"><summary>エフェクトについて <span id="effect-id">${effects[0].id}</span></summary><p id="effect-description">${escape(effects[0].description)}</p></details></div>
        <div class="preview-help"><span class="shortcut-hint"><kbd>Space</kbd> 再生 / 停止 <kbd>→</kbd> コマ送り</span><span class="zoom-hint">Fitでエフェクト全体を表示</span></div>
      </section>
    </div>
    <p class="message error-message" role="alert" hidden></p><p class="save-status" role="status"></p>
    <footer><span><span class="footer-mark">✳</span>MADE OF PIXELS. READY FOR IDEAS.</span><span>Powered by <a href="https://github.com/patch-gg/pixelfx" target="_blank" rel="noreferrer">pixelfx ${svg('<path d="M7 17 17 7M7 7h10v10"/>')}</a></span></footer>
  </main>
`;

const canvas = app.querySelector<HTMLCanvasElement>('canvas')!;
const stage = app.querySelector<HTMLDivElement>('.preview-stage')!;
const errorMessage = app.querySelector<HTMLParagraphElement>('[role="alert"]')!;
const name = app.querySelector<HTMLHeadingElement>('#effect-name')!;
const english = app.querySelector<HTMLSpanElement>('#effect-english')!;
const description = app.querySelector<HTMLParagraphElement>('#effect-description')!;
const playbackLabel = app.querySelector<HTMLSpanElement>('#playback-label')!;
const playbackStatus = app.querySelector<HTMLDivElement>('.playback-status')!;
const playbackButton = app.querySelector<HTMLButtonElement>('.playback-button')!;
const restartButton = app.querySelector<HTMLButtonElement>('.restart-button')!;
const stepButton = app.querySelector<HTMLButtonElement>('.step-button')!;
const frameNumber = app.querySelector<HTMLElement>('#frame-number')!;
const stageCategory = app.querySelector<HTMLSpanElement>('.stage-category')!;
const stageFps = app.querySelector<HTMLSpanElement>('.stage-fps')!;
const stageScale = app.querySelector<HTMLSpanElement>('.stage-scale')!;
const zoomHint = app.querySelector<HTMLSpanElement>('.zoom-hint')!;
const zoomButtons = [...app.querySelectorAll<HTMLButtonElement>('[data-zoom]')];
const inputs = [...app.querySelectorAll<HTMLInputElement>('input[name="effect"]')];
const categoryFilter = app.querySelector<HTMLSelectElement>('#category-filter')!;
const searchInput = app.querySelector<HTMLInputElement>('#effect-search')!;
const effectList = app.querySelector<HTMLDivElement>('.effect-list')!;
const catalogCount = app.querySelector<HTMLSpanElement>('.count')!;
const catalogHint = app.querySelector<HTMLSpanElement>('.catalog-hint')!;
const catalogEmpty = app.querySelector<HTMLDivElement>('.catalog-empty')!;
const previewDimensions = app.querySelector<HTMLSpanElement>('.preview-dimensions')!;
const saveButton = app.querySelector<HTMLButtonElement>('.save-button')!;
const outputBackground = app.querySelector<HTMLLabelElement>('.output-background')!;
const backgroundSelect = app.querySelector<HTMLSelectElement>('#output-background')!;
const transitionBackground = app.querySelector<HTMLSpanElement>('.transition-background')!;
const saveStatus = app.querySelector<HTMLParagraphElement>('.save-status')!;
let selected: Effect | undefined;
let exporting = false;
let zoom: Zoom = 'fit';
let pan = { x: 0, y: 0 };
let drag: { id: number; x: number; y: number; startX: number; startY: number } | undefined;
let displayedPaused: boolean | undefined;

function showRenderError() {
  errorMessage.textContent = 'エフェクトを再生できませんでした。もう一度エフェクトを選ぶか、ページを再読み込みしてください。';
  errorMessage.hidden = false;
  playbackLabel.textContent = '再生エラー';
  playbackStatus.classList.add('is-error');
  playbackStatus.classList.remove('is-paused');
  [playbackButton, restartButton, stepButton, saveButton].forEach((button) => { button.disabled = true; });
  backgroundSelect.disabled = true;
}
function updatePlaybackUi(state: PlaybackState) {
  if (displayedPaused !== state.paused || playbackStatus.classList.contains('is-error')) {
    displayedPaused = state.paused;
    playbackLabel.textContent = state.paused ? 'PAUSED' : 'LIVE PREVIEW';
    playbackStatus.classList.toggle('is-paused', state.paused);
    playbackStatus.classList.remove('is-error');
    playbackButton.querySelector('span')!.textContent = state.paused ? '再生する' : '一時停止';
    playbackButton.querySelector('svg')!.innerHTML = state.paused ? playIcon : pauseIcon;
    [playbackButton, restartButton, stepButton].forEach((button) => { button.disabled = false; });
  }
  const frame = String(state.frame).padStart(3, '0');
  if (frameNumber.textContent !== frame) frameNumber.textContent = frame;
}
let renderer: ReturnType<typeof createRenderer> | undefined;
try { renderer = createRenderer(canvas, showRenderError, updatePlaybackUi); }
catch { showRenderError(); inputs.forEach((input) => { input.disabled = true; }); }

function applyViewport() {
  if (!selected) return;
  const { bounds } = getPreviewLayout(selected);
  const scale = getViewportScale(zoom, stage.clientWidth, stage.clientHeight, bounds.x1 - bounds.x0, bounds.y1 - bounds.y0);
  pan.x = zoom === 'fit' ? 0 : clampPan(pan.x, canvas.width * scale, stage.clientWidth);
  pan.y = zoom === 'fit' ? 0 : clampPan(pan.y, canvas.height * scale, stage.clientHeight);
  canvas.style.width = `${canvas.width * scale}px`;
  canvas.style.height = `${canvas.height * scale}px`;
  canvas.style.transform = `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))`;
  stageScale.textContent = `${zoom === 'fit' ? 'FIT · ' : ''}${Math.round(scale * 100)}%`;
  stage.classList.toggle('is-zoomed', zoom !== 'fit');
  zoomHint.textContent = zoom === 'fit' ? 'Fitでエフェクト全体を表示' : 'ドラッグで移動 · ダブルクリックでFit';
}
function setZoom(value: Zoom) {
  zoom = value;
  pan = { x: 0, y: 0 };
  zoomButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.zoom === zoom)));
  applyViewport();
}
function updateBackgroundUi(effect: Effect) {
  const transition = effect.category === 'TRANSITIONS';
  backgroundSelect.disabled = transition || playbackStatus.classList.contains('is-error');
  backgroundSelect.value = renderer?.isTransparent ? 'transparent' : 'solid';
  outputBackground.hidden = transition;
  transitionBackground.hidden = !transition;
  stage.classList.toggle('is-transparent', renderer?.isTransparent === true);
}
function selectEffect(id: string) {
  const effect = getEffect(id);
  if (!effect || !renderer) return;
  try {
    renderer.select(effect);
    selected = effect;
    updateBackgroundUi(effect);
    name.textContent = effect.label;
    english.textContent = effect.name;
    description.textContent = effect.description;
    app!.querySelector('#effect-id')!.textContent = effect.id;
    stageCategory.textContent = `${categoryLabels[effect.category]} / ${effect.category}`;
    stageFps.textContent = `${effect.module.meta.fps} FPS`;
    canvas.setAttribute('aria-label', `${effect.label} / ${effect.name} のアニメーション`);
    previewDimensions.innerHTML = `${canvas.width} × ${canvas.height} <small>PX</small>`;
    pan = { x: 0, y: 0 };
    applyViewport();
    errorMessage.hidden = true;
    saveButton.disabled = exporting;
    if (!exporting) saveStatus.textContent = '';
  } catch { showRenderError(); }
}
inputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) { selectEffect(input.value); revealChoice(input); }
  });
  input.addEventListener('focus', () => revealChoice(input));
});
selectEffect(effects[0].id);
backgroundSelect.addEventListener('change', () => {
  if (!selected || !renderer || backgroundSelect.disabled) return;
  renderer.setTransparent(backgroundSelect.value === 'transparent');
  updateBackgroundUi(selected);
});

function revealChoice(input: HTMLInputElement) {
  const label = input.closest<HTMLLabelElement>('label')!;
  if (label.hidden) return;
  const viewport = effectList.getBoundingClientRect();
  const card = label.getBoundingClientRect();
  if (card.top < viewport.top + 3) effectList.scrollTop -= viewport.top + 3 - card.top;
  else if (card.bottom > viewport.bottom - 6) effectList.scrollTop += card.bottom - viewport.bottom + 6;
}
function updateCatalog() {
  const visible = searchEffects(searchInput.value, categoryFilter.value);
  const visibleIds = new Set<string>(visible.map((effect) => effect.id));
  inputs.forEach((input) => { input.closest<HTMLLabelElement>('label')!.hidden = !visibleIds.has(input.value); });
  catalogCount.textContent = String(visible.length);
  catalogHint.textContent = `${visible.length}種類のエフェクト${visible.length !== effects.length ? ` / ${effects.length}` : ''}`;
  catalogEmpty.hidden = visible.length > 0;
  effectList.hidden = visible.length === 0;
  if (selected && !visibleIds.has(selected.id) && visible[0]) {
    inputs.find((input) => input.value === visible[0].id)!.checked = true;
    selectEffect(visible[0].id);
  }
  effectList.scrollTop = 0;
  const activeInput = inputs.find((input) => input.checked);
  if (activeInput) revealChoice(activeInput);
}
categoryFilter.addEventListener('change', updateCatalog);
searchInput.addEventListener('input', updateCatalog);
app.querySelector('.reset-filter')!.addEventListener('click', () => {
  searchInput.value = '';
  categoryFilter.value = 'all';
  updateCatalog();
  searchInput.focus();
});
function togglePlayback() {
  if (!renderer || playbackButton.disabled) return;
  if (renderer.isPaused) renderer.resume(); else renderer.pause();
}
playbackButton.addEventListener('click', togglePlayback);
restartButton.addEventListener('click', () => {
  try { renderer?.restart(); } catch { showRenderError(); }
});
stepButton.addEventListener('click', () => renderer?.step());
zoomButtons.forEach((button) => button.addEventListener('click', () => setZoom(button.dataset.zoom as Zoom)));
stage.addEventListener('keydown', (event) => {
  if (event.code === 'Space') { event.preventDefault(); togglePlayback(); }
  if (event.code === 'ArrowRight') { event.preventDefault(); renderer?.step(); }
  if (event.code === 'Home') {
    event.preventDefault();
    try { renderer?.restart(); } catch { showRenderError(); }
  }
});
stage.addEventListener('pointerdown', (event) => {
  if (zoom === 'fit' || event.button !== 0) return;
  stage.focus({ preventScroll: true });
  drag = { id: event.pointerId, x: pan.x, y: pan.y, startX: event.clientX, startY: event.clientY };
  stage.setPointerCapture(event.pointerId);
  stage.classList.add('is-dragging');
});
stage.addEventListener('pointermove', (event) => {
  if (!drag || drag.id !== event.pointerId) return;
  pan = { x: drag.x + event.clientX - drag.startX, y: drag.y + event.clientY - drag.startY };
  applyViewport();
});
function finishDrag() { drag = undefined; stage.classList.remove('is-dragging'); }
stage.addEventListener('lostpointercapture', finishDrag);
stage.addEventListener('pointercancel', finishDrag);
stage.addEventListener('pointerup', finishDrag);
stage.addEventListener('dblclick', () => setZoom('fit'));
const resizeObserver = new ResizeObserver(applyViewport);
resizeObserver.observe(stage);

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
function dispose() { renderer?.dispose(); resizeObserver.disconnect(); }
function onPageHide(event: PageTransitionEvent) { if (!event.persisted) dispose(); }
window.addEventListener('pagehide', onPageHide);
if (import.meta.hot) import.meta.hot.dispose(() => {
  dispose();
  window.removeEventListener('pagehide', onPageHide);
});
