export class VoiceInputService {
  private mediaRecorder: MediaRecorder | null = null
  private chunks: Blob[] = []

  async start(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    this.mediaRecorder = new MediaRecorder(stream)
    this.chunks = []
    this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data)
    this.mediaRecorder.start()
  }

  stop(): Promise<string> {
    return new Promise(resolve => {
      if (!this.mediaRecorder) { resolve(''); return }
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' })
        this.mediaRecorder?.stream.getTracks().forEach(t => t.stop())
        resolve('[Voice transcription placeholder]')
      }
      this.mediaRecorder.stop()
    })
  }
}
