# Pixel FX Studio

[pixelfx](https://github.com/patch-gg/pixelfx)の既存エフェクト32種類（18カテゴリ）を選択・再生し、表示中のフレームをPNGとして保存するローカルWebアプリです。

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

1. カテゴリで絞り込むか、一覧をスクロールして32種類から選びます。キーボードではTabで選択欄に移動し、矢印キーで切り替えられます。スマートフォンでは3列の一覧をスクロールできます。
2. 選択したエフェクトが1枚のCanvas上で自動再生されます。単発エフェクトは終了後に再生成して繰り返します。
3. **一時停止**を押すと、その瞬間のフレームを固定できます。**再生**で続きから再開します。
4. **PNGを保存**を押すと、表示中のCanvasをダウンロードします。一時停止中も保存できます。

一時停止中にエフェクトを切り替えると、新しいエフェクトの最初のフレームを停止状態で表示します。**再生**を押すと動き始めます。停止していた時間は、再開後のアニメーションに加算されません。

カテゴリを変更して現在のエフェクトが対象外になった場合は、そのカテゴリの最初のエフェクトを表示します。一時停止状態は維持されます。件数は「4/32」のように表示され、**すべてのカテゴリ**で全件に戻せます。

保存画像は**320×288px**、プレビューと同じ暗色背景です。CSSで拡大した画面全体ではなく、元のCanvas画像を保存します。ファイル名の例は `pixelfx-ice-frost-nova.png` です。保存できなかった場合は画面内にエラーが表示されます。

| エフェクト | 確認済みのpixelfxインポート | 元の再生時間 |
| --- | --- | --- |
| Frost nova | `pixelfx/fx/ice/frost-nova` | 3.4秒 |
| Campfire | `pixelfx/fx/fire/campfire` | 3秒・ループ |
| Lightning strike | `pixelfx/fx/lightning/lightning-strike` | 3秒 |
| Fire tornado | `pixelfx/fx/fire/fire-tornado` | 2秒・ループ |
| Waterfall | `pixelfx/fx/water/waterfall` | 2秒・ループ |
| Water orb | `pixelfx/fx/water/water-orb` | 3秒・ループ |
| Firework burst | `pixelfx/fx/explosions/firework-burst` | 3.6秒 |
| Portal | `pixelfx/fx/arcane/portal` | 2.4秒・ループ |
| Halo | `pixelfx/fx/holy/halo` | 2秒・ループ |
| Black hole | `pixelfx/fx/shadow/black-hole` | 4秒・ループ |
| Leaf storm | `pixelfx/fx/nature/leaf-storm` | 2.4秒・ループ |
| Rain | `pixelfx/fx/weather/rain` | 8秒・ループ |
| Aurora | `pixelfx/fx/weather/aurora` | 12秒・ループ |
| Energy core | `pixelfx/fx/scifi/energy-core` | 2.4秒・ループ |
| Gem spin | `pixelfx/fx/pickups/gem-spin` | 2.4秒・ループ |
| Butterfly | `pixelfx/fx/critters/butterfly` | 3.2秒・ループ |
| Meteor | `pixelfx/fx/fire/meteor` | 5秒 |
| Spirit flame | `pixelfx/fx/fire/spirit-flame` | 3秒・ループ |
| Ice crystal | `pixelfx/fx/ice/ice-crystal` | 3秒・ループ |
| Ball lightning | `pixelfx/fx/lightning/ball-lightning` | 4秒・ループ |
| Geyser | `pixelfx/fx/water/geyser` | 5秒 |
| Plasma explosion | `pixelfx/fx/explosions/plasma-explosion` | 1.7秒 |
| Rune circle | `pixelfx/fx/arcane/rune-circle` | 4秒・ループ |
| Heal | `pixelfx/fx/holy/heal` | 1.9秒 |
| Tornado | `pixelfx/fx/nature/tornado` | 2秒・ループ |
| Cherry blossoms | `pixelfx/fx/weather/cherry-blossoms` | 10秒・ループ |
| Ghost | `pixelfx/fx/critters/ghost` | 2.4秒・ループ |
| Sword slash | `pixelfx/fx/melee/sword-slash` | 0.75秒 |
| Magic missile | `pixelfx/fx/projectiles/magic-missile` | 1.9秒 |
| Respawn beam | `pixelfx/fx/spawn/respawn-beam` | 2.5秒 |
| Poisoned | `pixelfx/fx/status/poisoned` | 1.6秒・ループ |
| Confetti | `pixelfx/fx/ui/confetti` | 3.4秒 |

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

- Vitest: 4ファイル、57テスト成功。全32種類の実描画と時間によるピクセル変化、カテゴリ絞り込みもテスト。
- TypeScriptの型検査とViteの本番ビルド成功。
- 空の一時フォルダでも `npm ci` → `npm test` → `npm run build` が成功。依存検査は0件。
- 実ブラウザ: 全32種類の選択を確認。前回までの16種類に続き、追加16種類のアニメーション・一時停止・PNG保存・ファイル名も確認。矢印キー操作と保存失敗時の表示も確認済み。
- 一時停止中にフレームが変わらないこと、再開すると動くこと、停止中の効果切り替え、Spaceキーでの再開を確認。
- 計32種類のPNGをダウンロードしてデコードし、画像サイズ・描画ピクセル数・比較値がクリック時のCanvasと一致することを確認。保存画像も目視確認。
- 全18カテゴリで、表示対象・件数・選択状態・一時停止の維持を確認。絞り込みを解除しても選択中のカードが見えることを確認。
- 画面幅1024/800/760/375/320pxで横方向にはみ出さず、スクロールして一覧下部のエフェクトも選べることを確認。

詳細は [docs/TEST_PLAN.md](docs/TEST_PLAN.md) と [docs/WORK_LOG.md](docs/WORK_LOG.md) を参照してください。MVPの未実装項目はありません。Safari / Firefox固有の動作は未検証です。

## 構成

- `src/main.ts`: 選択UI、保存操作、エラー表示。
- `src/effects.ts`: 実在確認済みの32モジュールの登録とカテゴリ絞り込み。
- `src/renderer.ts`: pixelfxからCanvasへの描画、単一のrequestAnimationFrameループ、一時停止・再開。
- `src/export-png.ts`: 現在のフレームのPNG化、ファイル名、ダウンロードと解放。
- `src/pixelfx.d.ts`: 実ソースで確認した使用APIの型定義。
- `src/__tests__/`: 登録・カテゴリ絞り込み・全32種類の実描画・描画ライフサイクル・PNG保存のテスト。

Vite + vanilla TypeScript + pixelfx + Vitestで構成しています。エフェクトエンジンはpixelfxをそのまま使い、ブラウザ内のCanvas 2Dで処理します。アプリの再生・保存にはバックエンドや外部APIは不要です。依存取得時のみネットワーク接続が必要です。

## 依存元とライセンス

- [pixelfx公式README](https://github.com/patch-gg/pixelfx#use-one) の `createFrame` / `createFx` / `clearFrame` / `composite` を利用。
- pixelfx 0.3.1、確認済みcommit `044e12a45dc9cc312cec50ee606dfc98afe5adc2` をGitHubのHTTPS依存として固定。
- pixelfxはMIT License、Copyright (c) 2026 Patch / Hugo Duprez。一部はSprite FusionのOSSエフェクト由来です。
- 元のライセンスとNOTICEは [public/THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt) に同梱し、ビルド時に `dist/` へコピーされます。pixelfxのギャラリー用フォントは使用していません。

GitHub: [taku0193/pixel-fx-studio](https://github.com/taku0193/pixel-fx-studio)（非公開）。
