export type TagToken = string | { type: string; name: string };

export function createTagParser(supportedTypes: string[]) {
  const typesPattern = supportedTypes.map(escapeRegex).join('|');
  const tagRegex = new RegExp(`\\b(${typesPattern}):([a-zA-Z0-9_-]+)\\b`, 'g');

  return function parseTags(input: string): TagToken[] {
    const tokens: TagToken[] = [];
    let lastIndex = 0;

    for (const match of input.matchAll(tagRegex)) {
      const matchStart = match.index!;
      const matchEnd = matchStart + match[0].length;

      if (matchStart > lastIndex) {
        tokens.push(input.slice(lastIndex, matchStart));
      }

      const [, type, name] = match;
      tokens.push({ type, name });

      lastIndex = matchEnd;
    }

    if (lastIndex < input.length) {
      tokens.push(input.slice(lastIndex));
    }

    return tokens;
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
