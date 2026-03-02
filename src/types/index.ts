export interface MediaItem {
  url: string;
  type: "image" | "video";
  name: string;
  file?: File;
}

export interface StorySlide {
  title: string;
  prose: string;
  caption: string;
  emotion: "joy" | "love" | "gratitude" | "wonder" | "peace" | "tenderness";
  media?: MediaItem;
}

export interface Story {
  storyTitle: string;
  openingLine: string;
  slides: StorySlide[];
  closingMessage: string;
}

export interface StoryTheme {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface Recipient {
  id: string;
  label: string;
}
