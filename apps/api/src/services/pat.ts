import { randomBytes, createHash } from 'crypto'

export class PersonalAccessTokenService {
  generate(userId: string): { token: string; hash: string } {
    const token = `zenthorix_${randomBytes(24).toString('hex')}`
    const hash = createHash('sha256').update(token).digest('hex')
    return { token, hash }
  }

  verify(token: string, hash: string): boolean {
    return createHash('sha256').update(token).digest('hex') === hash
  }
}
