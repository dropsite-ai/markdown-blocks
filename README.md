# @dropsite/markdown-blocks

Ultra-lightweight Markdown tag parser for extracting inline tags like `var:user_id` or `ai:summary-section`. Define your supported tag types and get a fast, flexible parser that works client or server side with any bundler.

## ✨ Features

- ⚡ Ultra-fast zero-dependency parser
- 🪶 Clean, Markdown-friendly syntax
- 🔁 Works anywhere: browser, server, or edge runtimes
- 🧩 Define your own tag types (e.g. `var`, `ai`, `doc`)

## 📦 Installation

```bash
npm install @dropsite/markdown-blocks
```

## 🚀 Usage

```ts
import { createTagParser } from '@dropsite/markdown-blocks';

const parseTags = createTagParser(['ai', 'var']);

const input = `
Hello var:user_name!

ai:summary-section
`;

console.log(parseTags(input));
/*
[
  '\nHello ',
  { type: 'var', name: 'user_name' },
  '!\n\n',
  { type: 'ai', name: 'summary-section' },
  '\n'
]
*/
```

## 🧾 Tag Syntax

- Tags follow the format `type:name`
- `type` must be explicitly allowed (e.g. `'ai'`, `'var'`, `'doc'`)
- `name` supports letters, numbers, underscores `_`, and dashes `-`
- Tag must be followed by space, newline, or punctuation to be valid

### ✅ Valid Examples

```markdown
var:user_name
ai:summary-section
doc:chapter_3
```

### ❌ Invalid Examples

```markdown
foo:bar       # if 'foo' is not an allowed type
var:          # missing name
ai:some@thing # invalid character in name
```

## 🔍 Detecting Tag Under Cursor

Need to know if a user’s cursor is inside a tag (like `var:user_name`) in a `<textarea>`? Use `getCursorTagMatchFromTextarea`:

```ts
import { getCursorTagMatchFromTextarea } from '@dropsite/markdown-blocks';

const result = getCursorTagMatchFromTextarea(textareaElement, ['var', 'ai']);

if (result.keywordIndex !== null) {
  const tag = result.blocks[result.keywordIndex];
  console.log('Cursor is inside tag:', tag);
}
```

This returns:
- `blocks`: the parsed result from `createTagParser`
- `keywordIndex`: the index of the tag the cursor is inside (or `null`)

Perfect for smart editors, autocomplete, and inline tag awareness.

## 🧪 Testing

```bash
npm run test
```

Powered by [Vitest](https://vitest.dev).

## 🛠 Use Cases

- Smart markdown editors with LLMs
- Custom variable injection for templates
- Markdown pre-processing for document automation
- Structured content for AI agents and assistants

---

MIT License • Built by [Dropsite](https://github.com/dropsite)