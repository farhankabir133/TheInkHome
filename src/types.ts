export interface Story {
  title: string;
  link: string;
  author: string;
  role: string;
  pubDate: string;
  categories: string[];
  description: string;
  content: string;
  cover: string;
  slug: string;
  avatar: string;
}

export interface Author {
  name: string;
  role: string;
  avatar: string;
  storyCount: number;
  stories: Story[];
}
