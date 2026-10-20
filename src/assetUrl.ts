declare global {
  interface Window { __WALENZA_PREVIEW_ASSETS__?: Record<string, string> }
}
// The standalone review file embeds the same assets; normal Vite builds use base.
export const assetUrl = (path: string) => {
  const key = path.replace(/^\/+/, '');
  return window.__WALENZA_PREVIEW_ASSETS__?.[key] || `${import.meta.env.BASE_URL}${key}`;
};
