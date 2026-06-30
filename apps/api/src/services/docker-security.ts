export interface ContainerLimits {
  memory: string
  cpu: number
  timeoutMs: number
  networkEnabled: boolean
}

export class DockerSecurity {
  getLimits(phase: 'install' | 'build' | 'run'): ContainerLimits {
    switch (phase) {
      case 'install':
        return { memory: '2GB', cpu: 2, timeoutMs: 120000, networkEnabled: true }
      case 'build':
        return { memory: '1GB', cpu: 1, timeoutMs: 300000, networkEnabled: false }
      case 'run':
        return { memory: '512MB', cpu: 0.5, timeoutMs: 60000, networkEnabled: false }
    }
  }

  sanitizeImage(image: string): string {
    if (image.includes(':')) return image
    return `${image}:latest`
  }
}
