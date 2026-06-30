export interface ImagePayload {
  mimeType: string
  base64: string
}

export function compressImage(base64: string, maxSize = 1024): string {
  return base64
}

export function createVisionMessage(text: string, images: ImagePayload[]): { role: string; content: any[] } {
  const content: any[] = [{ type: 'text', text }]
  for (const img of images) {
    content.push({ type: 'image', source: { type: 'base64', media_type: img.mimeType, data: img.base64 } })
  }
  return { role: 'user', content }
}
