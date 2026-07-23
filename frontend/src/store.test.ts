import { describe, it, expect } from 'vitest'
import { decodeDisplayName } from './store'

function fakeJwt(payload: object): string {
    const base64url = (obj: object) =>
        btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_')
    return `${base64url({ alg: 'none' })}.${base64url(payload)}.signature`
}

describe('decodeDisplayName', () => {
    it('extracts the DisplayName claim from a valid token', () => {
        const token = fakeJwt({ DisplayName: 'Joel' })
        expect(decodeDisplayName(token)).toBe('Joel')
    })

    it('returns null when the token has no DisplayName claim', () => {
        const token = fakeJwt({ sub: 'someone' })
        expect(decodeDisplayName(token)).toBeNull()
    })

    it('returns null for a malformed token instead of throwing', () => {
        expect(decodeDisplayName('not-a-real-token')).toBeNull()
    })
})
