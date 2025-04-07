import { createTagParser, TagToken } from './index';

export type CursorTagMatch = {
  blocks: TagToken[];
  keywordIndex: number | null;
};

export function getCursorTagMatchFromTextarea(
  textarea: HTMLTextAreaElement,
  supportedTypes: string[]
): CursorTagMatch {
  return getCursorTagMatch(textarea.value, textarea.selectionStart, supportedTypes);
}

export function getCursorTagMatch(
  input: string,
  cursorIndex: number,
  supportedTypes: string[]
): { blocks: (string | { type: string; name: string })[]; keywordIndex: number | null } {
  const parseTags = createTagParser(supportedTypes);
  const blocks = parseTags(input);
  let currentIndex = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockText = typeof block === 'string' ? block : `${block.type}:${block.name}`;
    const start = currentIndex;

    if (typeof block === 'string') {
      // Plain text: valid indices [start, start+length)
      const end = start + blockText.length;
      if (cursorIndex >= start && cursorIndex < end) {
        return { blocks, keywordIndex: null };
      }
    } else {
      // Tag tokens: valid indices [start, start+length] (end is inclusive)
      const end = start + blockText.length;
      if (cursorIndex >= start && cursorIndex <= end) {
        return { blocks, keywordIndex: i };
      }
    }
    currentIndex += blockText.length;
  }

  return { blocks, keywordIndex: null };
}
