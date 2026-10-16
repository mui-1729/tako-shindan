/** Nicknames are optional and visible to the survey owner only, never public. */
export function normalizeRespondentNickname(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') throw new Error('ニックネームが正しくありません。');
  const nickname = value.trim();
  if (!nickname) return null;
  if (nickname.length > 20 || /[\u0000-\u001f\u007f]/.test(nickname)) {
    throw new Error('ニックネームは20文字以内で入力してください。');
  }
  return nickname;
}
