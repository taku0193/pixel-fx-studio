# Codexデスクトップへの最初の指示 — Pixel FX Studio

このプロジェクトの `AGENTS.md`、`docs/MVP_SPEC.md`、`docs/TEST_PLAN.md`、`README.md` を読み、以下の順に自律的に作業してください。

## 今回の到達目標

`patch-gg/pixelfx` の既存エフェクトを3つ選択でき、Canvasで再生され、現在の表示フレームをPNGとして保存できるローカルWebアプリを完成させる。

## 作業順序

1. 現在のNode/npm環境とファイルを確認。`npm install` を実行し、`pixelfx`のREADME・実際のexports・エフェクト名を確認する。
2. まず1個だけ実表示（`ice/frost-nova` 等の実在を確認）。Canvas描画が動くようにする。
3. エフェクト選択UI・切り替え処理をTDDで実装。3種類の名前は存在を確認してから確定する。
4. PNG保存処理をテスト先行で実装。ファイル名と例外処理も確認する。
5. `npm test`、`npm run build`、可能ならブラウザでの手動動作確認を実施する。
6. READMEと `docs/WORK_LOG.md` を実装結果に合わせて更新する。

## 制約

- Vite + vanilla TypeScript + pixelfx + Vitestのみ（必要なら型定義を補う）。
- ライブラリ内部のエフェクトエンジンは再実装しない。
- GPU、バックエンド、LLM、外部APIは使わない。
- 要件にない機能を勝手に追加しない。
- 必要な外部のインストールや権限が拒否された場合は事実を記録し、その範囲でできる作業を続ける。

作業終了時は「実装済み機能、変更ファイル、実行したテストと結果、起動方法、未完事項」を日本語で報告してください。
