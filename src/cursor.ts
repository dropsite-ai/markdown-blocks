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
): CursorTagMatch {
  const parseTags = createTagParser(supportedTypes);
  const blocks = parseTags(input);

  let currentIndex = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockText =
      typeof block === 'string'
        ? block
        : `${block.type}:${block.name}`;

    const start = currentIndex;
    const end = currentIndex + blockText.length;

    if (cursorIndex >= start && cursorIndex <= end) {
      if (typeof block !== 'string') {
        return { blocks, keywordIndex: i };
      } else {
        return { blocks, keywordIndex: null };
      }
    }

    currentIndex = end;
  }

  return { blocks, keywordIndex: null };
}
