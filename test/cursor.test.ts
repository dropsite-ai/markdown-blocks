import { describe, it, expect } from 'vitest';
import { getCursorTagMatch } from '../src/cursor';

describe('getCursorTagMatch', () => {
  const supportedTypes = ['ai', 'var', 'doc'];

  it('finds tag when cursor is in the middle of it', () => {
    const input = 'Intro and then var:user_name followed by more.';
    const cursorIndex = input.indexOf('user_name') + 2; // inside "user_name"
    const result = getCursorTagMatch(input, cursorIndex, supportedTypes);

    expect(result.keywordIndex).not.toBeNull();
    const token = result.blocks[result.keywordIndex!];
    expect(token).toEqual({ type: 'var', name: 'user_name' });
  });

  it('returns null when cursor is in plain text', () => {
    const input = 'Just some text without tags.';
    const cursorIndex = input.indexOf('some');
    const result = getCursorTagMatch(input, cursorIndex, supportedTypes);

    expect(result.keywordIndex).toBeNull();
  });

  it('returns null when inside unsupported tag', () => {
    const input = 'meta:tag and var:real_tag';
    const cursorIndex = input.indexOf('meta:tag') + 2;
    const result = getCursorTagMatch(input, cursorIndex, supportedTypes);

    expect(result.keywordIndex).toBeNull();
  });

  it('returns correct index when tag is at the start', () => {
    const input = 'doc:intro followed by some text';
    const cursorIndex = 5; // inside "doc:intro"
    const result = getCursorTagMatch(input, cursorIndex, supportedTypes);

    expect(result.keywordIndex).not.toBeNull();
    const token = result.blocks[result.keywordIndex!];
    expect(token).toEqual({ type: 'doc', name: 'intro' });
  });

  it('returns correct result when cursor is at beginning tag boundary', () => {
    const input = 'test ai:title-case and more text';
    const supportedTypes = ['ai', 'var', 'doc']; // ✅ Ensure this
    const cursorIndex = input.indexOf('ai:title-case');
    
    const result = getCursorTagMatch(input, cursorIndex, supportedTypes);
  
    expect(result.keywordIndex).not.toBeNull();
    const token = result.blocks[result.keywordIndex!];
    expect(token).toEqual({ type: 'ai', name: 'title-case' });
  });

  it('returns correct result when cursor is at beginning tag boundary at start', () => {
    const input = 'ai:title-case and more text';
    const supportedTypes = ['ai', 'var', 'doc']; // ✅ Ensure this
    const cursorIndex = input.indexOf('ai:title-case');
    
    const result = getCursorTagMatch(input, cursorIndex, supportedTypes);
  
    expect(result.keywordIndex).not.toBeNull();
    const token = result.blocks[result.keywordIndex!];
    expect(token).toEqual({ type: 'ai', name: 'title-case' });
  });

  it('returns correct result when cursor is at end tag boundary', () => {
    const input = 'test ai:title-case and more text';
    const cursorIndex = input.indexOf('ai:title-case') + 'ai:title-case'.length;
    const result = getCursorTagMatch(input, cursorIndex, supportedTypes);

    expect(result.keywordIndex).not.toBeNull();
    const token = result.blocks[result.keywordIndex!];
    expect(token).toEqual({ type: 'ai', name: 'title-case' });
  });

  it('returns correct result when cursor is at end tag boundary at end', () => {
    const input = 'more text ai:title-case';
    const cursorIndex = input.indexOf('ai:title-case') + 'ai:title-case'.length;
    const result = getCursorTagMatch(input, cursorIndex, supportedTypes);

    expect(result.keywordIndex).not.toBeNull();
    const token = result.blocks[result.keywordIndex!];
    expect(token).toEqual({ type: 'ai', name: 'title-case' });
  });

  it('matches when cursor is over the type prefix (e.g. "ai:")', () => {
    const input = 'Check ai:title-case and go.';
    const cursorIndex = input.indexOf('ai:') + 1; // over the "i"
    const result = getCursorTagMatch(input, cursorIndex, supportedTypes);
  
    expect(result.keywordIndex).not.toBeNull();
    const token = result.blocks[result.keywordIndex!];
    expect(token).toEqual({ type: 'ai', name: 'title-case' });
  });  
});
