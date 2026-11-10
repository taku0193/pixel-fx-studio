import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { exportPng, pngFilename } from '../export-png';

const png = new Blob(['encoded-png'], { type: 'image/png' });
let canvas: HTMLCanvasElement;
let link: { href: string; download: string; hidden: boolean; click: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> };
let appendChild: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.useFakeTimers();
  link = { href: '', download: '', hidden: false, click: vi.fn(), remove: vi.fn() };
  appendChild = vi.fn();
  vi.stubGlobal('document', { createElement: vi.fn(() => link), body: { appendChild } });
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:current-frame');
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  canvas = {
    width: 320, height: 288,
    toBlob: vi.fn((callback: BlobCallback) => callback(png)),
  } as unknown as HTMLCanvasElement;
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('PNG export', () => {
  it('creates safe, bounded filenames from the selected effect', () => {
    expect(pngFilename('ice/frost-nova')).toBe('pixelfx-ice-frost-nova.png');
    expect(pngFilename('FIRE/Campfire')).toBe('pixelfx-fire-campfire.png');
    expect(pngFilename('../../evil<> name\n')).toBe('pixelfx-evil-name.png');
    expect(pngFilename('日本語')).toBe('pixelfx-effect.png');
    expect(pngFilename('a'.repeat(300)).length).toBeLessThanOrEqual(92);
  });

  it('encodes the current Canvas immediately and downloads the PNG', async () => {
    const exporting = exportPng(canvas, 'fire/campfire');
    expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');
    await exporting;
    expect(URL.createObjectURL).toHaveBeenCalledWith(png);
    expect(link.download).toBe('pixelfx-fire-campfire.png');
    expect(link.href).toBe('blob:current-frame');
    expect(appendChild).toHaveBeenCalledWith(link);
    expect(link.click).toHaveBeenCalledOnce();
    expect(link.remove).toHaveBeenCalledOnce();
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:current-frame');
  });

  it('rejects a missing or zero-sized Canvas', async () => {
    await expect(exportPng(null, 'ice/frost-nova')).rejects.toThrow('Canvas');
    canvas.width = 0;
    await expect(exportPng(canvas, 'ice/frost-nova')).rejects.toThrow('Canvas');
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it('reports a failed encoder instead of downloading an empty frame', async () => {
    vi.mocked(canvas.toBlob).mockImplementation((callback) => callback(null));
    await expect(exportPng(canvas, 'ice/frost-nova')).rejects.toThrow('PNG');
    expect(link.click).not.toHaveBeenCalled();
  });

  it('rejects empty PNG data', async () => {
    vi.mocked(canvas.toBlob).mockImplementation((callback) => callback(new Blob([], { type: 'image/png' })));
    await expect(exportPng(canvas, 'ice/frost-nova')).rejects.toThrow('PNG');
    expect(link.click).not.toHaveBeenCalled();
  });

  it('reports security or encoding exceptions in user-facing language', async () => {
    vi.mocked(canvas.toBlob).mockImplementation(() => { throw new Error('Tainted canvas'); });
    await expect(exportPng(canvas, 'ice/frost-nova')).rejects.toThrow('PNG');
    expect(link.click).not.toHaveBeenCalled();
  });

  it('releases the URL and temporary link even when a download fails', async () => {
    link.click.mockImplementation(() => { throw new Error('Download failed'); });
    await expect(exportPng(canvas, 'lightning/lightning-strike')).rejects.toThrow('PNG');
    expect(link.remove).toHaveBeenCalledOnce();
    vi.runAllTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:current-frame');
  });
});
