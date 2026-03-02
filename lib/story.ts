export interface Story {
  id: string;
  recipientName: string;
  authorName: string;
  title: string;
  chapters: { title: string; narration: string; mediaIndex: number }[];
  mediaUrls: string[];
  shareToken?: string;
  createdAt: string;
}

export function createShareUrl(token: string, baseUrl: string): string {
  return `${baseUrl}/shared/${token}`;
}
