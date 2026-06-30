export interface CompressedFile {
  imports: string[]
  types: string[]
  signatures: string[]
  originalLength: number
  compressedLength: number
}

export class ASTCompressor {
  compress(source: string, _language: string = 'typescript'): CompressedFile {
    const imports: string[] = []
    const types: string[] = []
    const signatures: string[] = []
    const lines = source.split('\n')
    let i = 0
    while (i < lines.length) {
      const line = lines[i]
      const trimmed = line.trimStart()
      if (trimmed.startsWith('import ')) {
        imports.push(line)
      } else if (
        trimmed.startsWith('interface ') ||
        trimmed.startsWith('type ') ||
        trimmed.startsWith('enum ')
      ) {
        types.push(line)
        if (line.includes('{')) {
          i++
          let braceCount = 1
          while (i < lines.length && braceCount > 0) {
            types.push(lines[i])
            braceCount += (lines[i].match(/{/g) ?? []).length
            braceCount -= (lines[i].match(/}/g) ?? []).length
            i++
          }
          continue
        }
      } else if (
        trimmed.startsWith('export default function ') ||
        trimmed.startsWith('export default class ') ||
        trimmed.startsWith('export default async function ') ||
        trimmed.startsWith('export function ') ||
        trimmed.startsWith('export async function ') ||
        trimmed.startsWith('function ') ||
        trimmed.startsWith('async function ') ||
        trimmed.startsWith('function* ') ||
        trimmed.startsWith('async function* ') ||
        trimmed.startsWith('export class ') ||
        trimmed.startsWith('class ') ||
        trimmed.startsWith('export const ') ||
        trimmed.startsWith('export abstract class ')
      ) {
        const sig = this.extractSignature(lines, i)
        signatures.push(sig.text)
        i = sig.endLine + 1
        continue
      }
      i++
    }
    const compressed = [...imports, ...types, ...signatures].join('\n')
    return {
      imports,
      types,
      signatures,
      originalLength: source.length,
      compressedLength: compressed.length,
    }
  }

  private extractSignature(lines: string[], start: number): { text: string; endLine: number } {
    let text = lines[start]
    let i = start + 1
    while (i < lines.length) {
      const trimmed = lines[i]
      if (trimmed.includes('{')) {
        text = text.replace(/\s*{[\s\S]*$/, ' { /* ... */ }')
        return { text, endLine: i }
      }
      if (trimmed.includes(')') || trimmed.includes('=>')) {
        text += ' ' + trimmed
        if (trimmed.includes('{') || trimmed.trim().startsWith('=>')) {
          text = text.replace(/\s*\{[\s\S]*$/, ' { /* ... */ }')
          return { text, endLine: i }
        }
        return { text, endLine: i }
      }
      text += '\n' + trimmed
      i++
    }
    return { text, endLine: i - 1 }
  }

  selectiveContext(
    files: Map<string, string>,
    activeFilePath: string,
  ): Map<string, string> {
    const result = new Map<string, string>()
    for (const [path, content] of files) {
      if (path === activeFilePath) {
        result.set(path, content)
      } else {
        const compressed = this.compress(content)
        result.set(path, compressed.imports.join('\n') + '\n' + compressed.types.join('\n') + '\n' + compressed.signatures.join('\n'))
      }
    }
    return result
  }
}
