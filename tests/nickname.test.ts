import { describe, expect, it } from 'vitest';
import { normalizeRespondentNickname } from '../src/shared/nickname';

describe('optional respondent nickname', () => {
  it('is optional and defaults to anonymous', () => {
    expect(normalizeRespondentNickname(undefined)).toBeNull();
    expect(normalizeRespondentNickname(null)).toBeNull();
    expect(normalizeRespondentNickname('')).toBeNull();
    expect(normalizeRespondentNickname('   ')).toBeNull();
  });
  it('trims and preserves Unicode nicknames', () => {
    expect(normalizeRespondentNickname(' りん ')).toBe('りん');
    expect(normalizeRespondentNickname('🐱')).toBe('🐱');
  });
  it('limits names and rejects control characters or wrong types', () => {
    expect(normalizeRespondentNickname('あ'.repeat(20))).toBe('あ'.repeat(20));
    expect(() => normalizeRespondentNickname('あ'.repeat(21))).toThrow();
    expect(() => normalizeRespondentNickname('bad\nname')).toThrow();
    expect(() => normalizeRespondentNickname({ nickname: 'alice' })).toThrow();
  });
});
