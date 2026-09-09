import { readFileSync, writeFileSync } from 'node:fs';

const filePath = 'src/lib/schema.ts';
let content = readFileSync(filePath, 'utf8');

// Fix the refine message - replace the function with a static string
content = content.replace(
  /message: \(v\) => `Unsupported language code "\\$\{v\}". Use one of: \$\{KNOWN_LANG_CODES\.join\(', '\)\}$.`/,
  'message: `Unsupported language code. Use one of: ${KNOWN_LANG_CODES.slice(0, 10).join(", ")}...`'
);

writeFileSync(filePath, content, 'utf8');
console.log('Fixed schema.ts refine message');
