// Minimal about endpoint for Vercel: /api/about
export default async function handler(req, res) {
  // For now return a small static about payload mirroring fallbackAbout
  const payload = {
    editors: [
      { name: 'Elena Rostov', role: 'Editor-in-Chief', avatar: 'https://i.pravatar.cc/150?img=12' },
    ],
    writers: [
      { name: 'Devon Vance', role: 'Writer', avatar: 'https://i.pravatar.cc/150?img=25' },
    ],
    description: 'The Ink Home is a curated publication exploring spatial typography, code shaders, and cyber-philosophical stories.',
    officialWebsite: 'https://medium.com/the-ink-home'
  };
  res.status(200).json(payload);
}
