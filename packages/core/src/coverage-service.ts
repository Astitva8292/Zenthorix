export interface CoverageResult {
  totalLines: number
  coveredLines: number
  branches: number
  coveredBranches: number
  functions: number
  coveredFunctions: number
  statements: number
  coveredStatements: number
  files: CoverageFile[]
}

export interface CoverageFile {
  path: string
  totalLines: number
  coveredLines: number
  coverage: number
}

export class CoverageService {
  calculate(coverageData: Record<string, { total: number; covered: number }>): CoverageResult {
    const files: CoverageFile[] = Object.entries(coverageData).map(([path, data]) => ({
      path,
      totalLines: data.total,
      coveredLines: data.covered,
      coverage: data.total > 0 ? (data.covered / data.total) * 100 : 0,
    }))

    const totals = files.reduce((acc, f) => ({
      totalLines: acc.totalLines + f.totalLines,
      coveredLines: acc.coveredLines + f.coveredLines,
    }), { totalLines: 0, coveredLines: 0 })

    return {
      totalLines: totals.totalLines,
      coveredLines: totals.coveredLines,
      branches: 0,
      coveredBranches: 0,
      functions: 0,
      coveredFunctions: 0,
      statements: totals.totalLines,
      coveredStatements: totals.coveredLines,
      files,
    }
  }
}
