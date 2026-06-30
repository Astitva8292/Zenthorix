export interface MergeConflict {
  filePath: string
  base: string
  ours: string
  theirs: string
}

export type ConflictResolution = 'ours' | 'theirs' | 'manual'

export class ConflictResolver {
  resolve(conflict: MergeConflict, strategy: ConflictResolution): string {
    switch (strategy) {
      case 'ours':
        return conflict.ours
      case 'theirs':
        return conflict.theirs
      case 'manual':
        return `<<<<<<< ours\n${conflict.ours}\n=======\n${conflict.theirs}\n>>>>>>> theirs`
    }
  }

  detectConflicts(base: string, ours: string, theirs: string): MergeConflict[] {
    const conflicts: MergeConflict[] = []
    if (base !== ours && base !== theirs && ours !== theirs) {
      conflicts.push({ filePath: 'unknown', base, ours, theirs })
    }
    return conflicts
  }
}
