// Node loader hook: redirect "@kabelsalat/web" to a local stub so the strudel
// bundles can be imported headlessly.
//
//   node --import ./tools/register-loader.mjs tools/check-strudel.mjs beat2.strudel.js
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

register(pathToFileURL(path.join(import.meta.dirname, 'kabelsalat-loader.mjs')));
