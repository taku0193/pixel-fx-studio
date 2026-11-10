export type Zoom = 'fit' | '2' | '4';

export function getViewportScale(zoom: Zoom, width: number, height: number, effectWidth: number, effectHeight: number) {
  if (zoom !== 'fit') return Number(zoom);
  return Math.max(0.1, Math.min(4, (width - 48) / effectWidth, (height - 48) / effectHeight));
}

export function clampPan(offset: number, content: number, viewport: number) {
  const limit = Math.max(0, (content - viewport) / 2);
  return Math.max(-limit, Math.min(limit, offset));
}
