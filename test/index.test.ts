import { describe, it, expect } from 'vitest';
import { createTagParser } from '../src';

describe('parseTags (with dashes and underscores)', () => {
  const parseTags = createTagParser(['ai', 'var', 'doc']);

  it('parses mixed tags with dashes and underscores', () => {
    const input = `ai:title-case
var:snake_case
doc:section-1_2`;

    const expected = [
      { type: 'ai', name: 'title-case' },
      '\n',
      { type: 'var', name: 'snake_case' },
      '\n',
      { type: 'doc', name: 'section-1_2' }
    ];

    expect(parseTags(input)).toEqual(expected);
  });

  it('handles text between tags', () => {
    const input = 'Hello var:user_name! Welcome to doc:chapter-3.';
    const expected = [
      'Hello ',
      { type: 'var', name: 'user_name' },
      '! Welcome to ',
      { type: 'doc', name: 'chapter-3' },
      '.'
    ];
    expect(parseTags(input)).toEqual(expected);
  });

  it('ignores unsupported types', () => {
    const input = 'meta:tag var:ok';
    const expected = ['meta:tag ', { type: 'var', name: 'ok' }];
    expect(parseTags(input)).toEqual(expected);
  });

  it('returns full string if no valid tags exist', () => {
    expect(parseTags('Nothing here!')).toEqual(['Nothing here!']);
  });
});
