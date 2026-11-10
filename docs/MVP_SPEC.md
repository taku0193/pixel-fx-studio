# MVP仕様書 — Pixel FX Studio

## 目的

既存OSS `patch-gg/pixelfx` のエフェクトをローカルWebアプリで選択・再生・PNG保存する。研究用途やゲーム素材作りにつながる小さな成果物を作り、複雑な外部サービス統合を避ける。

## ユーザーストーリーと受け入れ条件

### P1. エフェクト選択
- スクロール可能な一覧から、**実在する16種類**のエフェクトを選べる（初期3種類から利用者の追加依頼で拡張）。件数は登録内容から自動表示する。
- 選択中の効果名を表示する。
- 初期の `ice/frost-nova`, `fire/campfire`, `lightning/lightning-strike` を維持し、水・花火・魔法・光・闇・自然・天候・SF・宝石・蝶など計13カテゴリを収録。追加するパスは実物で確認する。
- スマートフォンでは3列の一覧をスクロールできる。矢印キーで移動した選択項目も表示範囲に入る。

### P2. Canvasでアニメーション
- Canvas内で選択した効果が動く（画面解像度例 320×180、CSS拡大）。
- 切り替え時、前のアニメーション処理を停止・破棄し、新しい効果のみ描画する。
- `pixelfx` が提供する `createFrame` / `createFx` / `clearFrame` / `composite` をベースに、公式READMEのコードに沿って実装する。
- 一時停止・再開ボタンで、現在のフレームを固定し、続きから再開できる（追加候補から実装済み）。
- 停止中に別の効果を選んでも停止状態を維持する。停止時間は再開後の経過時間に加算しない。

### P3. PNG保存
- 現在のCanvas表示がPNGで保存できる。
- 一時停止中も、その表示フレームをPNGとして保存できる。
- 名前は `pixelfx-<effect-slug>.png` など安全な形式とする。
- 保存不可・Canvas未生成の場合はユーザー向けにエラーを示す。

## MVPの範囲外

GIF/動画出力、スプライトシート生成、エフェクト作成AI、パレット編集、バックエンド、ユーザーログイン、アップロード。

## 技術構成

- Node.js 22.12+、Vite、vanilla TypeScript
- `pixelfx` GitHub依存：`github:patch-gg/pixelfx`（事前にAPI互換を確認）
- テスト：Vitest（外部画面を必要としないユニットテスト中心）
- 想定URL：`http://localhost:5173/`

## 実装候補構成

```
src/
  main.ts              # UI・DOM制御
  effects.ts           # 検証済みエフェクト登録
  renderer.ts          # アニメーションライフサイクル
  export-png.ts        # PNGダウンロード処理
  style.css
src/__tests__/
  effects.test.ts
  renderer.test.ts
  export-png.test.ts
```

## 完了の定義

- 全16種類を切り替えたとき、1つのCanvas上で対応するアニメーションが見える。
- PNGが取得でき、空白ではなくエフェクトが含まれることを目視確認する。
- テストとビルドが通る。未検証事項は報告する。
- READMEに起動コマンドと参照したOSSを記載する。
