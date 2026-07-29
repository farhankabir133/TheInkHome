export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
}
