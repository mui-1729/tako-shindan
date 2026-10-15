import { describe, expect, it } from 'vitest';
import { axes, characterFromScores, characterIndex, isValidAnswers, questions, scoreAnswers } from '../src/shared/diagnosis';

describe('diagnosis rules', () => {
  it('has 8 questions, 2 questions per axis, 16 character types', () => {
    expect(questions).toHaveLength(8);
    axes.forEach((_, i) => expect(questions.filter(q => q.axis === i)).toHaveLength(2));
  });
  it('returns 0s when selecting low-valued options, even for reversed questions', () => {
    const answers = questions.map(q => q.options.findIndex(option => option.value === 0));
    expect(scoreAnswers(answers)).toEqual([0, 0, 0, 0]);
    expect(characterIndex(scoreAnswers(answers))).toBe(0);
  });
  it('returns 100s when selecting high-valued options', () => {
    const answers = questions.map(q => q.options.findIndex(option => option.value === 100));
    expect(scoreAnswers(answers)).toEqual([100, 100, 100, 100]);
    expect(characterFromScores([100, 100, 100, 100]).code).toBe('1111');
  });
  it('allows two unanswered questions but not an empty axis', () => {
    const answers = [0, 0, 0, 0, 0, 0, -1, -1];
    expect(isValidAnswers(answers)).toBe(true);
    expect(isValidAnswers([-1, 0, 0, 0, -1, 0, 0, 0])).toBe(false);
    expect(isValidAnswers([-1, -1, -1, -1, -1, -1, -1, -1])).toBe(false);
  });
  it('rejects malformed answer shapes', () => {
    expect(isValidAnswers([0, 1, 2])).toBe(false);
    expect(isValidAnswers([0, 0, 0, 0, 0, 0, 0, 10])).toBe(false);
    expect(isValidAnswers('00000000')).toBe(false);
  });
});
