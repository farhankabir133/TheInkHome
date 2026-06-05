import { describe, it, expect } from 'vitest';
import { mapRssItemToStory } from '../lib/story.js';
import DOMPurify from 'isomorphic-dompurify';

describe('mapRssItemToStory', () => {
  it('maps minimal item', () => {
    const item = { title: 'Hello', link: 'https://x.com/hello', content: '<p>Hi</p>' };
    const s = mapRssItemToStory(item);
    expect(s.title).toBe('Hello');
    expect(s.link).toBe('https://x.com/hello');
    expect(s.slug).toBe('hello');
  });
});

describe('HTML Sanitization', () => {
  it('strips malicious script tags from content', () => {
    const dirty = '<div>Hello <script>alert("XSS")</script>world!</div>';
    const clean = DOMPurify.sanitize(dirty);
    expect(clean).toBe('<div>Hello world!</div>');
  });

  it('allows safe HTML elements', () => {
    const dirty = '<p>This is a <strong>safe</strong> link to <a href="https://example.com">Example</a></p>';
    const clean = DOMPurify.sanitize(dirty);
    expect(clean).toBe('<p>This is a <strong>safe</strong> link to <a href="https://example.com">Example</a></p>');
  });
});
