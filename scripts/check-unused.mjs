import {build} from 'esbuild';
import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
async function walk(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):path.join(dir,entry.name)))).flat();}
const result=await build({entryPoints:['src/main.jsx'],bundle:true,write:false,metafile:true,packages:'external',external:['/static/*'],outdir:'unused-audit-output',logLevel:'silent'});
const active=new Set(Object.keys(result.metafile.inputs).map(file=>file.split(path.sep).join('/')));
const sourceFiles=await walk('src');
const unused=sourceFiles.filter(file=>!active.has(file.split(path.sep).join('/')));
// Every public asset must occur in the reachable application, HTML, or another
// public text asset. Runtime data records count: WILL can display them by ID.
const textFiles=['index.html',...active,...(await walk('public')).filter(file=>/\.(?:js|css|svg|html|json)$/.test(file))];
const text=(await Promise.all([...new Set(textFiles)].map(file=>readFile(file,'utf8')))).join('\n');
const referenced=new Set([...text.matchAll(/\/(?:static\/[^\s'"`<>\)]+|favicon\.ico(?:[?#][^\s'"`<>\)]+)?)/g)].map(match=>match[0].split(/[?#]/,1)[0]));
const unusedPublic=(await walk('public')).filter(file=>!referenced.has('/'+path.relative('public',file).split(path.sep).join('/'))&&!/^google[a-f0-9]+\.html$/.test(path.basename(file)));
await mkdir('test-results',{recursive:true});
await writeFile('test-results/unused-files.json',JSON.stringify({runtimeInputs:active.size,unusedSource:unused,unusedPublic},null,2)+'\n');
assert.deepEqual(unused,[],'Unreachable source files require review; do not delete automatically.');
assert.deepEqual(unusedPublic,[],'Unreferenced public assets require review; do not delete automatically.');
console.log(`${active.size} reachable runtime inputs; no unused source or public assets.`);
