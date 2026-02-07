const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'resources', 'js', 'components');
const exts = new Set(['.js', '.jsx', '.ts', '.tsx']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(walk(full));
    else if (exts.has(path.extname(e.name))) files.push(full);
  }
  return files;
}

function removeLineComments(src) {
  let out = '';
  const len = src.length;
  let i = 0;
  let inSingle = false, inDouble = false, inBack = false;
  let inBlock = false, inLine = false;

  while (i < len) {
    const ch = src[i];
    const next = src[i+1];

    if (inLine) {
      if (ch === '\n') {
        inLine = false;
        out += ch;
      }
      i++;
      continue;
    }

    if (inBlock) {
      out += ch;
      if (ch === '*' && next === '/') { out += next; i += 2; inBlock = false; continue; }
      i++;
      continue;
    }

    if (!inSingle && !inDouble && !inBack) {
      if (ch === '/' && next === '*') {
        inBlock = true;
        out += ch; // keep block start
        i++; // next loop will append '*' and continue
        continue;
      }
      if (ch === '/' && next === '/') {
        inLine = true;
        i += 2; // skip the //
        continue; // drop until newline
      }
    }

    // Strings and template literals
    if (!inSingle && !inDouble && ch === '`') {
      inBack = !inBack;
      out += ch; i++; continue;
    }
    if (!inBack && !inDouble && ch === "'") {
      inSingle = !inSingle;
      out += ch; i++; continue;
    }
    if (!inBack && !inSingle && ch === '"') {
      inDouble = !inDouble;
      out += ch; i++; continue;
    }

    // Escape inside strings
    if ((inSingle || inDouble || inBack) && ch === '\\') {
      out += ch;
      if (i+1 < len) { out += src[i+1]; i += 2; continue; }
    }

    out += ch;
    i++;
  }

  return out;
}

const files = walk(root);
console.log('Files to process:', files.length);
let changed = 0;
for (const f of files) {
  try {
    const src = fs.readFileSync(f, 'utf8');
    const cleaned = removeLineComments(src);
    if (cleaned !== src) {
      fs.writeFileSync(f, cleaned, 'utf8');
      changed++;
      console.log('Removed // comments:', f);
    }
  } catch (err) {
    console.error('Error processing', f, err);
  }
}
console.log(`Done. Files changed: ${changed}`);
