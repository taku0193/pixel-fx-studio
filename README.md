<div align="center">

<img src="docs/assets/readme-hero.svg" alt="Pixel FX Studio — Small pixels. Big energy. 244 effects / 21 categories / Frame to PNG" width="1200">

### その一瞬に、ひらめきを。

<p>244種類のピクセルエフェクトから、アイデアに合う光を見つける。<br>動きを止めて、お気に入りのフレームを、そのままPNGに。</p>

**Vite · TypeScript · pixelfx · Canvas 2D**

[はじめる](#quick-start) · [操作方法](#controls) · [244種類](docs/EFFECT_CATALOG.md) · [開発ガイド](#development)

</div>

<br>

![魔法のポータルを表示したPixel FX Studio。左にサムネイルギャラリー、右にプレビューとPNG書き出し。](docs/assets/studio-desktop.png)

<p align="center"><sub>選んで、動かして。最高のフレームを持ち帰ろう。</sub></p>

## Made for the moment

| 見つける | 瞬間をつかむ |
| --- | --- |
| **244 effects / 21 categories**<br>炎、氷、魔法から連続攻撃まで。実際の描画を使ったサムネイルで、見た目から選べます。 | **Frame by frame**<br>一時停止、コマ送り、リスタート。フレーム番号を見ながら、欲しい瞬間を探せます。 |
| **日本語でも、英語でも。**<br>`雪`、`クラゲ`、`portal`。名前・タグ・カテゴリを組み合わせて検索できます。 | **Fit / 2× / 4×**<br>全体を眺めて、ピクセルまで近づく。拡大中はドラッグで表示位置を動かせます。 |
| **Desktop to mobile**<br>PCはギャラリーとプレビューを並べて。スマホは再生・保存を先に、ギャラリーをその下に。 | **The frame, as PNG.**<br>表示倍率に左右されず、元のピクセルサイズで保存。グリッドや操作部は画像に入りません。 |

ローカルで動く、小さな素材探しの作業室です。再生・保存にはバックエンドや外部APIを使いません。

<details>
<summary><strong>スマートフォンでの表示を見る</strong></summary>

<p align="center"><img src="docs/assets/studio-mobile.png" alt="スマートフォン表示。プレビューと操作部を上に、3列のギャラリーを下に配置。" width="360"></p>

</details>

## Quick start

Node.js **22.12以降の22系、24系、または26以降**とnpmを用意します。

```bash
git clone https://github.com/taku0193/pixel-fx-studio.git
cd pixel-fx-studio
npm ci
npm run dev
```

**[localhost:5173](http://localhost:5173/)** を開いて、エフェクトを選んでください。

> このリポジトリは非公開です。cloneにはアクセス権のあるGitHubアカウントが必要です。すでに取得済みなら、プロジェクトフォルダで `npm ci` から実行できます。

<details>
<summary>5173が使用中の場合</summary>

```bash
npm run dev -- --host 127.0.0.1 --port 5180
```

[127.0.0.1:5180](http://127.0.0.1:5180/) を開きます。

</details>

## Workflow

**01 — Explore**<br>
ギャラリーからひとつ選ぶ。日本語名・英語名・ID・説明・タグで検索し、カテゴリで絞り込めます。大文字・小文字・全角英字は区別せず、空白で区切った語をすべて含む項目を表示します。

**02 — Find your frame**<br>
プレビューで再生し、気になった瞬間に一時停止。コマ送りで微調整し、必要なら先頭へ。Fitで全体を、2×・4×で細部を確認できます。

**03 — Take it with you**<br>
**PNGを書き出す**を押すと、表示中のCanvasを保存します。一時停止中も保存でき、表示倍率やドラッグ位置は保存画像に影響しません。

## Controls

| 操作 | ボタン・マウス | キーボード |
| --- | --- | --- |
| エフェクト選択 | サムネイルを選択 | 一覧へTab移動 → 矢印キー |
| 再生 / 一時停止 | **再生する / 一時停止** | `Space` |
| 1コマ進む | **1コマ進む** | `→` |
| 先頭に戻る | **先頭に戻る** | `Home` |
| 表示倍率 | **Fit / 2× / 4×** | ボタンへTab移動 → `Enter` |
| 拡大中の移動 | ステージ上でドラッグ | — |
| Fitに戻す | ステージをダブルクリック | **Fit**へTab移動 → `Enter` |
| PNG保存 | **PNGを書き出す** | ボタンへTab移動 → `Enter` |

再生・コマ送り・先頭へ戻るショートカットは、**プレビューにフォーカスしているとき**に使えます。

<details>
<summary>選択・検索・停止の動作</summary>

- 停止中に別のエフェクトを選んでも、停止状態を維持します。停止時間は再開後の経過時間に加算しません。
- コマ送りは停止して1フレーム進めます。リスタートは再生・停止の状態を保ち、フレーム番号を0に戻します。
- カテゴリや検索を変えて現在の効果が対象外になると、最初の検索結果へ切り替わります。
- 0件の場合は、その前のプレビューを維持します。**絞り込みをリセット**で全244種類に戻せます。
- 単発エフェクトは終了後に再生成し、自動で繰り返します。

</details>

## Effects

**炎 · 水 · 氷 · 雷 · 爆発 · 魔法 · 回復 · 闇 · 状態異常 · 自然 · 天候 · SF · 剣撃 · 飛び道具 · 衝撃 · 復活 · 連続攻撃 · UI演出 · アイテム · 生き物 · 画面切り替え**

全244種類に日本語名と公式の英語名を併記しています。

**[→ 全244種類の名前・ID・サイズ・再生時間を見る](docs/EFFECT_CATALOG.md)**

| 出力例 | PNGサイズ |
| --- | --- |
| 通常のエフェクト | 320 × 288 px |
| Nuke | 400 × 320 px |
| Rocket launcher | 480 × 288 px |

大型の効果ではCanvasを必要なサイズに拡張し、通常の効果に戻すと320×288に戻します。保存サイズはプレビュー下部に表示します。ファイル名の例は `pixelfx-moves-rocket-launcher.png` です。

連続攻撃12種類は、公式の `createAct` / `actBounds` でキャラクター・予備動作・対象を含めて再生。画面切り替え10種類には公式の星空背景を、それ以外には暗色背景を表示します。

## Development

```bash
npm test                  # Vitest
npm run build             # 型検査 + 本番ビルド → dist/
npm run preview           # ビルドを localhost:4173 で確認
```

**530 tests passing · 6 test files · TypeScript + Vite build verified**<br>
2026-11-11に再実行して確認。Node.js 26.13.0 / npm 11.20.0で開発しています。

<details>
<summary><strong>検証内容と対応状況</strong></summary>

- 全244種類の実描画・時間変化・表示範囲を自動テストで確認。
- 日本語検索、停止・再開・コマ送り・リスタート、ズームの計算、PNG保存を検証。
- 2026-11-10の本番ブラウザ検証で、全244種類・21カテゴリと244枚のサムネイルを確認。
- 全21カテゴリの代表23枚と、新UIの通常・大型・連続攻撃・画面切り替え4枚のPNGを保存・デコードし、Canvasとの一致を確認。
- 幅320〜1440pxの10サイズで、横のはみ出しとキーボード選択を確認。
- Safari / Firefox固有の動作は未検証です。

詳しい結果は [テスト計画](docs/TEST_PLAN.md) と [作業ログ](docs/WORK_LOG.md) に記録しています。

</details>

<details>
<summary><strong>サムネイルを再生成する</strong></summary>

```bash
npm run thumbnails
```

`public/thumbnails/` の244枚は、公式エンジンの代表フレームから生成した240×160 PNGです。実行時は静的画像を遅延読み込みし、プレビュー用のCanvasを増やしません。

この開発用スクリプトにはNode.js **22.18以降の22系、24系、または26以降**を使用してください。ネイティブTypeScript読み込みを使い、外部APIは使用しません。

</details>

<details>
<summary><strong>プロジェクト構成</strong></summary>

```text
src/
  main.ts                 画面と操作
  style.css               スタジオのデザイン
  effects.ts              全244種類・カテゴリ・検索
  effect-names.json       日本語名
  curated-effects.json    初期32種類の順序・日本語説明
  preview.ts              表示範囲と公式プレイヤー
  renderer.ts             単一RAF・再生・停止・コマ送り
  viewport.ts             Fit・倍率・ドラッグ範囲
  export-png.ts           PNG保存とリソース解放
  pixelfx.d.ts             確認済み公開APIの型定義
  __tests__/              6ファイルのテスト
scripts/
  generate-thumbnails.mjs 実描画サムネイルの生成
public/
  thumbnails/             全244種類の画像
  THIRD_PARTY_NOTICES.txt  依存元のライセンスとNOTICE
docs/
  assets/                 README用バナー・スクリーンショット
  EFFECT_CATALOG.md       全エフェクトのカタログ
  MVP_SPEC.md             仕様
  TEST_PLAN.md            テスト計画・検証結果
  WORK_LOG.md             開発記録
vite.config.ts            コア・カテゴリ別のビルド分割
```

エンジンはpixelfxの公開APIをそのまま使い、Canvas 2Dで描画します。依存取得時にはネットワーク接続が必要です。GIF/動画出力、スプライトシート生成、パレット編集、AI生成は実装していません。

</details>

## Credits

エフェクトは **[patch-gg/pixelfx](https://github.com/patch-gg/pixelfx)** によるものです。

- pixelfx **0.3.1**、確認済みcommit [`044e12a`](https://github.com/patch-gg/pixelfx/commit/044e12a45dc9cc312cec50ee606dfc98afe5adc2) をHTTPS依存として固定。
- MIT License · Copyright (c) 2026 Patch / Hugo Duprez。一部はSprite FusionやHollow CrownのOSSコード由来です。
- 元のライセンスとNOTICEは [THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt) に同梱し、ビルド時に `dist/` へコピーします。

---

<p align="center"><strong>MADE OF PIXELS. READY FOR IDEAS.</strong><br><sub>Pixel FX Studio — a little workspace for your next big idea.</sub></p>
