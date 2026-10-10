import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const config=JSON.parse(readFileSync('docs.json','utf8'));
const contract=JSON.parse(readFileSync('openapi.json','utf8'));
const pages=config.navigation.tabs.flatMap(tab=>tab.groups.flatMap(group=>group.pages));
for(const page of pages){
  assert.ok(existsSync(`${page}.mdx`),`Missing navigation page: ${page}`);
  const content=readFileSync(`${page}.mdx`,'utf8');
  const operation=content.match(/^openapi:\s*['"]?(GET|POST|PATCH|DELETE)\s+([^\s'"]+)/m);
  if(operation)assert.ok(contract.paths[operation[2]]?.[operation[1].toLowerCase()],`Unknown operation in ${page}`);
  for(const [,target] of content.matchAll(/\]\(\/(?!\/)([^)#]+)(?:#[^)]*)?\)/g))assert.ok(existsSync(`${target}.mdx`),`Broken local link in ${page}: ${target}`);
}
console.log(`Validated ${pages.length} navigation pages and their API/local references.`);
