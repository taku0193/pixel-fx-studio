# 開発ログ

Codexは各段階で日付、変更点、テストコマンド、結果、未解決事項を追記する。

- 初期状態：Viteスターターと引き継ぎドキュメントのみ。実装・依存パッケージのインストール未実施。

## 2026-11-10 — 作業環境とGitHub

- 添付スターターを空の作業ディレクトリ `/Users/takumayamane/pixel-fx-studio` へコピー。Downloadsの原本は変更していない。
- `AGENTS.md`、`CODEX_START.md`、MVP仕様、テスト計画を確認。
- `node --version`: v26.13.0、`npm --version`: 11.20.0。
- `git init -b main` とスターターのcommitを実施。
- 利用者の新規作成指示に従い、`gh repo create taku0193/pixel-fx-studio --private --source=. --remote=origin --push` を実行。非公開リポジトリ作成と初回pushが成功。
- 制限環境内のnpm取得は名前解決に失敗。ネットワーク接続を許可して再試行したがGitHubのSSH取得が進まないため中断し、このinstallプロセスだけHTTPSへ置換して再試行。ユーザー全体のGit設定は変更していない。

## 2026-11-10 — 段階1: OSS確認・最初のCanvas描画

- `npm install` 完了。pixelfx 0.3.1のインストール済みREADME、`package.json`のexports、`src/core/fx.js`、候補3種類の実ファイルを確認。
- GitHubの確認済みcommit `044e12a45dc9cc312cec50ee606dfc98afe5adc2` をHTTPS依存として固定。lockfileのGit取得URLもHTTPSに統一。
- 型定義が提供されていないため、利用する実APIと3つの具体的なインポートだけを型定義。
- `npm audit --json`: 初期Vitest 3系と間接依存に3件検出。Node/Vite互換性を確認してVitest 5.1.0へ更新し、インストール結果で0件になった。
- `effects.test.ts` を先に作成し、未実装モジュールで失敗することを確認後、3種類の登録とID検証を実装。2テスト成功。
- `renderer.test.ts` も未実装での失敗を確認後、公式のcreateFrame/createFx/clearFrame/compositeを使って実装。即時描画、切り替え時の停止、古いコールバック無効化、dispose、秒単位の経過時間、長時間復帰時の上限、単発効果の再生成、描画エラーを確認。
- 雷の元サイズが240×264のため共通Canvasを320×288とし、各エフェクトのmeta.size/originで中央に配置。まずUIではFrost novaだけを再生。
- `npm test`: 2ファイル・9テスト成功。`npm run build`: 型検査とViteビルド成功。
- 5173/5174は既存のSSH転送が使用中のため停止せず、`npm run dev -- --host 127.0.0.1 --port 5180` で検証用サーバー起動。
- PlaywrightでFrost novaを1秒再生し、背景以外のピクセル9,639個を検出。スクリーンショットで氷の結晶の実描画を確認。

## 2026-11-10 — 段階2: 3種類の選択UI

- 選択用radioが3つ存在するブラウザ検証を先に実行し、0件で失敗することを確認してからUIを実装。
- ネイティブradioで3種類を選択でき、選択名・説明・Canvasのアクセシブル名が更新される。失敗時は画面内にエラーを表示。
- 暗色のプレビュー画面、選択状態、キーボードフォーカス、狭い画面向けレイアウトを追加。アイコンはローカルSVGで外部通信しない。
- ページ離脱とVite HMRでループを解放。ブラウザの戻るキャッシュで保存される場合は再開可能な状態を保つ。
- `npm test`: 9テスト成功。`npm run build`: 成功。
- Playwright: 3種類の選択、表示名、1秒間でのピクセル変化、30回連続切り替え後の再生を確認。背景以外のピクセルは氷9,584、炎11,837、雷15,959。3枚の画面を目視確認し、それぞれの視覚差と雷の全体表示を確認。
- ブラウザ検証でgetImageDataを繰り返したことによる性能ヒントは発生したが、アプリの実行エラーはない。開発中のfavicon 404はローカルfavicon追加で解消。

## 2026-11-10 — 段階3: PNG保存

- `export-png.test.ts` を先に作り、未実装モジュールで失敗することを確認してから実装。
- クリック時にCanvas.toBlobを同期的に呼び、現在の描画をPNG化。選択変更と非同期保存が重なっても、呼び出し時の効果名をファイル名に使う。
- 安全なファイル名、未準備Canvas、null/空Blob、エンコーダ例外、保存失敗をテスト。ダウンロード用リンクを削除し、ブラウザの取得開始後にObject URLを解放。
- UIに保存ボタン、準備中/ダウンロード開始の案内、失敗時のエラー表示を追加。処理中の重複保存を防止。
- `npm test`: 3ファイル・16テスト成功。`npm run build`: 成功。
- Playwrightで3種類のPNGを実際に保存。PillowでPNGをデコードし、320×288、背景以外のピクセル数、RGBAからの比較値がクリック時のCanvasと3種類とも一致することを確認。保存画像を開き、氷・焚き火・雷が含まれることを目視確認。
  - Frost nova: 9,717ピクセル、比較値532676666。
  - Campfire: 11,837ピクセル、比較値813489144。
  - Lightning strike: 25,234ピクセル、比較値818388369。
- ブラウザで矢印キーによる選択と、toBlob失敗時のユーザー向けエラーを確認。
- 幅760/375/320pxで横方向のはみ出しがないことを確認。デスクトップと375pxの画面を保存し目視確認。

## 2026-11-10 — 段階4: ドキュメント・再現確認

- READMEを完成状態の起動方法、操作、保存サイズ、実API、検証結果に更新。TEST_PLANに実施結果を追記。
- pixelfxのLICENSEとNOTICE原文を `public/THIRD_PARTY_NOTICES.txt` に同梱。ビルド先にも配置される。ギャラリー用フォントは未使用。
- モバイルで選択インジケーターの横幅が細くならないよう修正し、再度目視確認。
- 空の一時フォルダへソースとlockfileをコピーし、`npm ci --cache /private/tmp/pixel-fx-npm-cache --fetch-retries=0` → `npm test` → `npm run build` がすべて成功。35パッケージ導入、依存検査0件、16テスト成功。本番ビルド成功。
- ブラウザ検証後はテスト時計を通常再生に戻した。確認用アプリは `http://127.0.0.1:5180/`。
- `git diff --check`: 成功。
- 実装段階ごとにmainへcommit・GitHubへpush。MVPの未実装項目はなし。Safari / Firefox固有の動作は未検証。

### 変更ファイル

- 実装: `src/main.ts`, `src/effects.ts`, `src/renderer.ts`, `src/export-png.ts`, `src/pixelfx.d.ts`, `src/style.css`。
- テスト: `src/__tests__/effects.test.ts`, `src/__tests__/renderer.test.ts`, `src/__tests__/export-png.test.ts`。
- 配布・依存: `index.html`, `public/favicon.svg`, `public/THIRD_PARTY_NOTICES.txt`, `package.json`, `package-lock.json`, `.gitignore`。
- 説明・記録: `README.md`, `docs/TEST_PLAN.md`, `docs/WORK_LOG.md`。
- 元の指示書・仕様・AGENTSはスターターの内容を維持。

## 2026-11-10 — 追加機能: 一時停止・再開（描画処理）

- 利用者の追加機能の依頼に対し、仕様書P2の追加候補だった一時停止・再開を実装。
- 先に6テストを追加し、pause未実装による6件の失敗を確認してから実装。
- pauseは現在のインスタンスとCanvasを維持して描画予約を解除し、resumeは同じインスタンスを新しい時計で再開。停止中の時間はシミュレーションへ加算しない。
- 停止前の古いコールバック、30回の停止・再開、停止中の効果切り替え、破棄後の操作を検証。効果を切り替えても一時停止状態を保つ。
- `npm test`: 3ファイル・22テスト成功。`npm run build`: 型検査と本番ビルド成功。`git diff --check`: 成功。

## 2026-11-10 — 追加機能: 一時停止・再開（操作画面）

- ブラウザで一時停止ボタンの存在検証が失敗することを確認してから操作UIを実装。
- 一時停止／再生ボタン、停止状態の表示、キーボードフォーカスを追加。停止状態での効果切り替えとPNG保存に対応。
- 狭い幅ではボタンを折り返し、保存と再開の両方を操作できるように配置。
- `npm test`: 全22テスト成功。`npm run build`: 成功。`git diff --check`: 成功。
- Playwrightで3種類とも1秒再生→5秒停止を行い、停止前後のCanvasのPNGデータURLが完全に同じことを確認。再開して0.5秒後には変化することも確認。
- 3種類の停止中PNGを実際にダウンロード。Pillowでデコードして320×288と次の描画ピクセル数・比較値が固定Canvasと一致することを確認。
  - Frost nova: 9,717ピクセル、532676666。
  - Campfire: 11,642ピクセル、369214005。
  - Lightning strike: 15,905ピクセル、488290394。
- 停止状態で別効果へ切り替えた後も2秒間固定されること、Spaceキーで再開できることを確認。
- 幅1024/800/760/375/320pxで横にはみ出さないことを確認。`output/playwright/pause-desktop.png` と `pause-mobile.png` を目視確認。アプリのコンソールエラーなし。
- README・MVP仕様・テスト計画を実装済みの操作に合わせて更新。
