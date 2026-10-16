import { describe, expect, it } from 'vitest';
import { characters } from '../src/shared/diagnosis';
import { animalStories, observedTendencies, resultSampleNote, storyFromScores } from '../src/shared/resultNarrative';

describe('richer v2 personality results', () => {
  it('provides a distinctive, complete story for each of the 16 animals', () => {
    expect(animalStories).toHaveLength(16);
    const taglines = new Set<string>();
    for (let index = 0; index < characters.length; index++) {
      const scores = [3, 2, 1, 0].map(position => (index & (1 << position)) ? 100 : 0);
      const story = storyFromScores(scores, 2);
      expect(story).toBeDefined();
      expect(story?.tags).toHaveLength(3);
      expect(story!.impression.length).toBeGreaterThan(20);
      expect(story!.scene.length).toBeGreaterThan(15);
      expect(story!.surprise.length).toBeGreaterThan(15);
      taglines.add(story!.tagline);
    }
    expect(taglines.size).toBe(16);
  });

  it('does not apply new animals to old v1 responses', () => {
    expect(storyFromScores([0, 0, 0, 0], 1)).toBeNull();
    expect(observedTendencies([0, 0, 0, 0], 1)).toEqual([]);
  });

  it('describes midpoint as mixed rather than assigning a strong personality', () => {
    const tendencies = observedTendencies([50, 48, 53, 52]);
    expect(tendencies).toHaveLength(4);
    expect(tendencies.every(t => t.phrase.includes('両方の面'))).toBe(true);
  });

  it('highlights the most distinct observed dimensions in descending order', () => {
    const tendencies = observedTendencies([15, 65, 50, 95]);
    expect(tendencies.map(t => t.axis)).toEqual([
      '助けるときの初動', '会話の入り方', '物事の進め方', '物事の選び方',
    ]);
    expect(tendencies[0].phrase).toContain('具体策');
    expect(observedTendencies([0, 50, 101, 0])).toEqual([]);
  });

  it('warns about small sample counts', () => {
    expect(resultSampleNote(2)).toContain('3人');
    expect(resultSampleNote(3)).toContain('少人数');
    expect(resultSampleNote(5)).toContain('少人数');
    expect(resultSampleNote(6)).toContain('集まってきました');
    expect(resultSampleNote(20)).toContain('断定するものではありません');
  });
});
