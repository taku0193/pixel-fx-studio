# Pixel FX Studio — Codex Desktop 用スターター

**これは未実装の出発点です。** GitHub の `patch-gg/pixelfx` を使い、3種類のエフェクトを Canvas に表示してPNG保存する小さなアプリをCodexで作ります。

## Codexデスクトップでの開始方法

1. このフォルダ（`pixel-fx-studio-codex`）をMacの任意の場所に保存する。
2. Codexデスクトップアプリでこのフォルダをプロジェクトとして開く。
3. 新しいセッションを作り、次のメッセージを送る。
   **「このフォルダの `CODEX_START.md` を読み、`AGENTS.md` と `docs/MVP_SPEC.md` に従ってTDDで実装を開始してください。」**
4. Codexに `npm install` と動作確認を実行させる。Node.js 22.12以降推奨。
5. `npm run dev` で `http://localhost:5173/` を開く。

### 初期状態の動作

初期ファイルはViteで起動できる画面のみです。エフェクトやPNG出力はCodexが実装します。Node/npmパッケージはZIPに同梱していません。

## 参照元

- [pixelfx](https://github.com/patch-gg/pixelfx)（MIT）
- 公式READMEのブラウザ向けサンプル：`createFrame`, `clearFrame`, `createFx`, `composite`
- GitHubからのインストール：`npm install github:patch-gg/pixelfx`

**このプロジェクト専用のセッションで開発してください。** Stack Diagram Makerとは別フォルダ・別Git履歴です。
