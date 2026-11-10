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
