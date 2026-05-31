/**
 * Deterministic Likes Counter and Social Link Generators
 * for The Ink Home editorial interactions.
 */

/**
 * Calculates a predictable baseline likes count for any story title.
 * This guarantees populated social counters (e.g. 52 likes, 126 likes)
 * rather than displaying non-organic 0s on startup.
 */
export function getLikesCount(title: string, isLikedByUser: boolean): number {
  if (!title) return 24 + (isLikedByUser ? 1 : 0);
  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseline = Math.abs(hash % 150) + 24; // Range 24 to 173
  return baseline + (isLikedByUser ? 1 : 0);
}

/**
 * Social Sharing URL builder
 */
export function getShareUrl(platform: "twitter" | "linkedin" | "facebook", title: string, url: string): string {
  const cleanUrl = url || "https://medium.com/the-ink-home";
  const text = `Read "${title}" on The Ink Home — Spatial Editorial Universe.`;
  
  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(cleanUrl)}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cleanUrl)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`;
    default:
      return cleanUrl;
  }
}
