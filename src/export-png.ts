export function pngFilename(effectId: string): string {
  const slug = effectId.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80).replace(/^-+|-+$/g, '');
  return `pixelfx-${slug || 'effect'}.png`;
}

export async function exportPng(canvas: HTMLCanvasElement | null, effectId: string): Promise<void> {
  if (!canvas || canvas.width <= 0 || canvas.height <= 0) {
    throw new Error('Canvasが準備できていません。エフェクトを選び直してください。');
  }
  try {
    // toBlob snapshots the displayed bitmap at this call, before any await or later frame.
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (!result || result.size === 0) reject(new Error('Empty PNG'));
        else resolve(result);
      }, 'image/png');
    });
    const url = URL.createObjectURL(blob);
    let link: HTMLAnchorElement | undefined;
    try {
      link = document.createElement('a');
      link.href = url;
      link.download = pngFilename(effectId);
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
    } finally {
      link?.remove();
      // Allow the browser to start consuming the URL before releasing it.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  } catch {
    throw new Error('PNGを保存できませんでした。もう一度お試しください。');
  }
}
