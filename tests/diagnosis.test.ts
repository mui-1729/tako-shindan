import { describe, expect, it } from 'vitest';
import { axes, axesForVersion, characterFromScores, characterIndex, characters, isValidAnswers, legacyQuestions, questions, questionsForVersion, scoreAnswers } from '../src/shared/diagnosis';
import { animalSvg, characterImage } from '../src/shared/characterArt';

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

describe('redesign and legacy compatibility', () => {
  it('preserves v1 questions and scoring on old links', () => {
    expect(questionsForVersion(1)).toBe(legacyQuestions);
    expect(axesForVersion(1)[0].name).toBe('かかわり方');
    const oldAnswers = legacyQuestions.map(q => q.options.findIndex(x => x.value === 100));
    expect(scoreAnswers(oldAnswers, 1)).toEqual([100, 100, 100, 100]);
    expect(characterFromScores([0, 0, 0, 0], 1).title).toBe('ひらめきのムードメーカー');
  });

  it('keeps distinct, observable v2 questions and animal mascots', () => {
    expect(axes.map(a => a.name)).toEqual([
      '会話の入り方', '物事の進め方', '物事の選び方', '助けるときの初動',
    ]);
    expect(questions).toHaveLength(8);
    expect(characters).toHaveLength(16);
    expect(new Set(characters.map(c => c.title)).size).toBe(16);
    expect(new Set(characters.map(c => c.emoji)).size).toBe(16);
    expect(characterFromScores([0, 100, 0, 100]).title).toBe('未来を組むドラゴン');
  });

  it('provides inline vector animal artwork for every new character', () => {
    characters.forEach((_, i) => {
      expect(animalSvg(i)).toContain('<svg');
      expect(animalSvg(i)).toContain('</svg>');
      expect(characterImage(i, 2)).toContain('data:image/svg+xml');
      expect(characterImage(i, 1)).toContain('data:image/svg+xml');
    });
    expect(animalSvg(0)).not.toEqual(animalSvg(15));
  });
});
