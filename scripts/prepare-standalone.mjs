import { cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const standalone = join(root, '.next', 'standalone');

if (!existsSync(join(standalone, 'server.js'))) {
    throw new Error('Standalone build not found. Run pnpm build first.');
}

const directories = [
    ['public', 'public'],
    ['.next/static', '.next/static'],
];

for (const [source, target] of directories) {
    const from = join(root, source);
    const to = join(standalone, target);

    if (existsSync(from)) {
        cpSync(from, to, { recursive: true, force: true });
    }
}
