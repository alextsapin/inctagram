import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const skip = new Set(['node_modules', '.next', '.git', 'dist', 'build']);

const walk = (dir, acc = []) => {
    for (const name of readdirSync(dir)) {
        if (skip.has(name)) continue;

        const fullPath = join(dir, name);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            walk(fullPath, acc);
            continue;
        }

        if (name.endsWith('.module.scss')) {
            acc.push({ name, fullPath });
        }
    }

    return acc;
};

const invalid = walk(root).filter(({ name }) => name !== name.toLowerCase());

if (invalid.length > 0) {
    console.error('*.module.scss filenames must be lowercase:\n');
    for (const file of invalid) {
        console.error(`  ${relative(root, file.fullPath)}`);
    }
    process.exit(1);
}

console.log('All *.module.scss filenames are lowercase.');
