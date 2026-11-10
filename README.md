# Pixel FX Studio

[pixelfx](https://github.com/patch-gg/pixelfx)の既存エフェクトを選択・再生し、表示中のフレームをPNGとして保存するローカルWebアプリです。

## 起動

Node.js **22.12以降の22系、24系、または26以降**とnpmが必要です。開発時はNode 26.13.0 / npm 11.20.0で確認しました。

```bash
npm ci
npm run dev
```

[http://localhost:5173/](http://localhost:5173/) を開きます。5173が使用中の場合は、空いているポートを指定してください。

```bash
npm run dev -- --host 127.0.0.1 --port 5180
```

この場合は [http://127.0.0.1:5180/](http://127.0.0.1:5180/) を開きます。開発時は5173/5174が既存のSSH転送で使用されていたため、5180で動作確認しました。

## 使い方

1. 左側の3種類からエフェクトを選びます。キーボードではTabで選択欄に移動し、矢印キーで切り替えられます。
2. 選択したエフェクトが1枚のCanvas上で自動再生されます。氷・雷の単発エフェクトは終了後に再生成して繰り返します。
3. **PNGを保存**を押すと、その瞬間のCanvasをダウンロードします。

保存画像は**320×288px**、プレビューと同じ暗色背景です。CSSで拡大した画面全体ではなく、元のCanvas画像を保存します。ファイル名の例は `pixelfx-ice-frost-nova.png` です。保存できなかった場合は画面内にエラーが表示されます。

| エフェクト | 確認済みのpixelfxインポート | 元の再生時間 |
| --- | --- | --- |
| Frost nova | `pixelfx/fx/ice/frost-nova` | 3.4秒 |
| Campfire | `pixelfx/fx/fire/campfire` | 3秒・ループ |
| Lightning strike | `pixelfx/fx/lightning/lightning-strike` | 3秒 |

雷の元サイズが240×264pxのため、共通Canvasを320×288pxにしています。各モジュールの `meta.size` と `meta.origin` を使い、エフェクト全体が収まるように配置しています。

## テストとビルド

```bash
npm test
npm run build
```

ビルド結果は `dist/` に出力されます。

```bash
npm run preview -- --host 127.0.0.1
```

プレビューは [http://127.0.0.1:4173/](http://127.0.0.1:4173/) です。

2026-11-10の検証結果:

- Vitest: 3ファイル、16テスト成功。
- TypeScriptの型検査とViteの本番ビルド成功。
- 空の一時フォルダでも `npm ci` → `npm test` → `npm run build` が成功。依存検査は0件。
- 実ブラウザ: 3種類の選択・アニメーション・30回連続切り替え・矢印キー操作・保存失敗時の表示を確認。
- 3種類のPNGをダウンロードしてデコードし、画像サイズ・描画ピクセル数・比較値がクリック時のCanvasと一致することを確認。保存画像も目視確認。
- 画面幅760/375/320pxで横方向にはみ出さないことを確認。

詳細は [docs/TEST_PLAN.md](docs/TEST_PLAN.md) と [docs/WORK_LOG.md](docs/WORK_LOG.md) を参照してください。MVPの未実装項目はありません。Safari / Firefox固有の動作は未検証です。

## 構成

- `src/main.ts`: 選択UI、保存操作、エラー表示。
- `src/effects.ts`: 実在確認済みの3モジュールの登録。
- `src/renderer.ts`: pixelfxからCanvasへの描画と単一のrequestAnimationFrameループ。
- `src/export-png.ts`: 現在のフレームのPNG化、ファイル名、ダウンロードと解放。
- `src/pixelfx.d.ts`: 実ソースで確認した使用APIの型定義。
- `src/__tests__/`: 登録・描画ライフサイクル・PNG保存のテスト。

Vite + vanilla TypeScript + pixelfx + Vitestで構成しています。エフェクトエンジンはpixelfxをそのまま使い、ブラウザ内のCanvas 2Dで処理します。アプリの再生・保存にはバックエンドや外部APIは不要です。依存取得時のみネットワーク接続が必要です。

## 依存元とライセンス

- [pixelfx公式README](https://github.com/patch-gg/pixelfx#use-one) の `createFrame` / `createFx` / `clearFrame` / `composite` を利用。
- pixelfx 0.3.1、確認済みcommit `044e12a45dc9cc312cec50ee606dfc98afe5adc2` をGitHubのHTTPS依存として固定。
- pixelfxはMIT License、Copyright (c) 2026 Patch / Hugo Duprez。一部はSprite FusionのOSSエフェクト由来です。
- 元のライセンスとNOTICEは [public/THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt) に同梱し、ビルド時に `dist/` へコピーされます。pixelfxのギャラリー用フォントは使用していません。

GitHub: [taku0193/pixel-fx-studio](https://github.com/taku0193/pixel-fx-studio)（非公開）。
