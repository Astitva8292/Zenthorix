export interface AssetGeneratorPlugin {
  readonly name: string
  readonly type: 'image' | '3d' | 'video'
  generate(prompt: string, options?: Record<string, unknown>): Promise<{ url?: string; data?: Buffer; mimeType: string }>
}
