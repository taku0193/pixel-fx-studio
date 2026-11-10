import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');
app.innerHTML = `
  <main>
    <h1>Pixel FX Studio</h1>
    <section class="card">
      <p>Codex が pixelfx を接続するためのスターターです。</p>
      <p>最初の目標: <strong>3種類のエフェクト切替 → Canvas再生 → PNG保存</strong></p>
      <small>README.md と CODEX_START.md を参照してください。</small>
    </section>
  </main>
`;
