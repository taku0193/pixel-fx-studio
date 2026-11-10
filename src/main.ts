import './style.css';
import { effects } from './effects';
import { createRenderer } from './renderer';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');
app.innerHTML = `
  <main>
    <h1>Pixel FX Studio</h1>
    <section class="card">
      <h2>Frost nova</h2>
      <canvas width="320" height="288" aria-label="Frost nova のプレビュー"></canvas>
      <p role="alert"></p>
    </section>
  </main>
`;

const canvas = app.querySelector<HTMLCanvasElement>('canvas')!;
const renderer = createRenderer(canvas, () => {
  app.querySelector('[role="alert"]')!.textContent = 'エフェクトの再生に失敗しました。ページを再読み込みしてください。';
});
renderer.select(effects[0]);
if (import.meta.hot) import.meta.hot.dispose(() => renderer.dispose());
