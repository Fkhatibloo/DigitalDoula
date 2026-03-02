export async function uploadMedia(file: File, storyId: string): Promise<string> {
  // Production: use @vercel/blob
  // import { put } from '@vercel/blob';
  // const blob = await put(`stories/${storyId}/${file.name}`, file, { access: 'public' });
  // return blob.url;
  return URL.createObjectURL(file);
}

export async function uploadBatch(files: File[], storyId: string): Promise<string[]> {
  return Promise.all(files.map((f) => uploadMedia(f, storyId)));
}
