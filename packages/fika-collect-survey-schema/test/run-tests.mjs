import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { glob } from 'glob';
import path from 'node:path';

await register('ts-node/esm', pathToFileURL('./'));

for (const file of await glob('test/**/*.test.ts')) {
  await import(pathToFileURL(path.resolve(file)).href);
}
