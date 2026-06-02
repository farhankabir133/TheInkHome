import { describe, it, expect } from 'vitest';
import { mapRssItemToStory } from '../lib/story.js';

describe('mapRssItemToStory', () => {
  it('maps minimal item', () => {
    const item = { title: 'Hello', link: 'https://x.com/hello', content: '<p>Hi</p>' };
    const s = mapRssItemToStory(item);
    expect(s.title).toBe('Hello');
    expect(s.link).toBe('https://x.com/hello');
    expect(s.slug).toBe('hello');
  });
});
