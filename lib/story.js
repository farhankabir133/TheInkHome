export function mapRssItemToStory(it) {
  const title = it.title || 'Untitled';
  const link = it.link || '';
  const author = it.author || it.creator || 'The Ink Home';
  const pubDate = it.pubDate || new Date().toUTCString();
  const content = it.content || it.description || '';
  const coverMatch = (content || '').match(/<img[^>]+src=["']([^"']+)["']/i);
  const cover = coverMatch && coverMatch[1] ? coverMatch[1] : undefined;
  let slug = '';
  if (link) {
    const parts = link.split('/');
    const last = parts[parts.length - 1];
    slug = last ? last.split('?')[0] : '';
  }
  if (!slug) slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    title,
    link,
    author,
    role: '',
    pubDate,
    categories: Array.isArray(it.categories) ? it.categories : ['Editorial'],
    description: (content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 180) + '...',
    content,
    cover,
    slug,
    avatar: undefined,
  };
}
