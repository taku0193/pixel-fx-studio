# TDDテスト計画 — Pixel FX Studio

**各段階は Red → Green → Refactor。** すべてを一度に作らない。

1. `effects.test.ts`: 3種類が重複せず登録され、有効IDだけを選択できる。実際のOSSインポートパスはインストール後に確認する。
2. `renderer.test.ts`: 切り替えで前のアニメーションが停止し、1つのループのみ動く。`requestAnimationFrame` と Canvas をモック化する。
3. `renderer.test.ts`: dispose時には以後の描画が走らない。フレーム更新の時間差が扱える。
4. `export-png.test.ts`: エフェクト名から安全なファイル名を作り、PNGの保存処理を呼べる。未作成Canvasや `toBlob` 失敗にも対処する。
5. 手動検証: 3種類の視覚差がある、選択連打でも描画が止まらない、PNGが正しい。

成功していないテストを成功したことにしない。
