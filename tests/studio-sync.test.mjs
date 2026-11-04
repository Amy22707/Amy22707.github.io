import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, relative, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { syncStudio, git, allowedStudioPath, parseStatus, shouldSyncPush, cleanGitEnvironment, githubRemote } from '../scripts/studio-sync-core.mjs';
import { compareProjects, comparePosts } from '../src/utils/contentOrder.mjs';

function fixture(t) {
  const temporary=mkdtempSync(resolve(tmpdir(),'amy-studio-sync-'));
  t.after(()=>{
    const path=relative(resolve(tmpdir()),temporary);
    assert.ok(!path.startsWith('..')&&!isAbsolute(path)&&path.startsWith('amy-studio-sync-'));
    rmSync(temporary,{recursive:true,force:true});
  });
  const root=resolve(temporary,'homepage'),studio=resolve(root,'.studio-workspace/amy-studio'),remote=resolve(temporary,'remote.git');
  mkdirSync(studio,{recursive:true});git(temporary,['init','--bare',remote]);git(studio,['init','-b','main']);
  git(studio,['config','user.name','Studio Sync Test']);git(studio,['config','user.email','test@example.invalid']);
  mkdirSync(resolve(studio,'scripts'),{recursive:true});mkdirSync(resolve(studio,'site'),{recursive:true});
  writeFileSync(resolve(studio,'scripts/build.mjs'),"import{mkdirSync,writeFileSync}from'node:fs';mkdirSync('dist',{recursive:true});writeFileSync('dist/index.html','ok');");
  writeFileSync(resolve(studio,'site/index.html'),'<h1>Studio</h1>');writeFileSync(resolve(studio,'README.md'),'Initial\n');writeFileSync(resolve(studio,'.gitignore'),'dist/\n');
  git(studio,['add','.']);git(studio,['commit','-m','Initial website']);git(studio,['remote','add','origin',remote]);git(studio,['push','-u','origin','main']);
  const options={root,validateRemote:value=>value===remote,log:()=>{}};
  return {root,studio,remote,temporary,options,head:()=>git(studio,['rev-parse','HEAD']).stdout.trim(),remoteHead:()=>git(temporary,['--git-dir',remote,'rev-parse','refs/heads/main']).stdout.trim()};
}
test('file scope excludes installers, saves, unrelated scripts and traversal',()=>{
  for(const file of ['site/jizhi/index.html','site/jizhi/guide.css','site/jizhi/guide.js'])assert.ok(allowedStudioPath(file));
  for(const file of ['site/i18n/blocks/blog.json','site/images/朋友 头像.webp','scripts/serve.mjs','site/data/studio.json'])assert.ok(allowedStudioPath(file));
  for(const file of ['game.apk','site/images/game.exe','site/games/client.js','backups/state.json','scripts/release-game.mjs','../secrets.txt','site/.env'])assert.equal(allowedStudioPath(file),false);
  assert.deepEqual(parseStatus(' M README.md\0R  site/images/new.png\0site/images/old.png\0?? site/images/朋友 头像.webp\0'),['README.md','site/images/new.png','site/images/old.png','site/images/朋友 头像.webp']);
  assert.equal(shouldSyncPush('refs/heads/main abc refs/heads/main def\n','other'),true);
  assert.equal(shouldSyncPush('(delete) 0000 refs/heads/main def\n','main'),false);
  assert.equal(shouldSyncPush('refs/heads/dev abc refs/heads/dev def\n','main'),false);
  assert.equal(githubRemote('git@github.com:Amy22707/amy-studio.git','amy-studio'),true);
  assert.equal(githubRemote('https://example.com/Amy22707/amy-studio.git','amy-studio'),false);
  assert.equal(cleanGitEnvironment({GIT_DIR:'wrong',GIT_INDEX_FILE:'wrong',PATH:'ok'}).GIT_DIR,undefined);
});
test('check is read-only; normal sync commits and pushes only website changes',t=>{
  const f=fixture(t),before=f.head();writeFileSync(resolve(f.studio,'README.md'),'Updated website\n');
  const check=syncStudio({...f.options,check:true});assert.equal(check.committed,false);assert.equal(f.head(),before);assert.equal(f.remoteHead(),before);
  const result=syncStudio(f.options);assert.equal(result.committed,true);assert.notEqual(f.head(),before);assert.equal(f.head(),f.remoteHead());
  assert.equal(git(f.studio,['status','--porcelain']).stdout,'');
});
test('unsafe files stop synchronization without a commit or push',t=>{
  const f=fixture(t),before=f.head();writeFileSync(resolve(f.studio,'game.apk'),'not an installer to publish');
  assert.throws(()=>syncStudio(f.options),/non-website/);assert.equal(f.head(),before);assert.equal(f.remoteHead(),before);
});
test('failed builds do not commit or push',t=>{
  const f=fixture(t),before=f.head();writeFileSync(resolve(f.studio,'scripts/build.mjs'),"throw new Error('build failed');");
  assert.throws(()=>syncStudio(f.options),/build failed/i);assert.equal(f.head(),before);assert.equal(f.remoteHead(),before);
});
test('installer blobs in unpublished history are rejected even after deletion',t=>{
  const f=fixture(t),before=f.remoteHead();const bad=resolve(f.studio,'game.apk');writeFileSync(bad,'private package');git(f.studio,['add','.']);git(f.studio,['commit','-m','Not public']);
  rmSync(bad);git(f.studio,['add','-u']);git(f.studio,['commit','-m','Remove package']);
  assert.throws(()=>syncStudio(f.options),/unpushed Studio commit/);assert.equal(f.remoteHead(),before);
});
test('a newer remote commit stops synchronization rather than merging or forcing',t=>{
  const f=fixture(t),before=f.head(),peer=resolve(f.temporary,'peer');
  git(f.temporary,['clone',f.remote,peer]);git(peer,['switch','main']);
  git(peer,['config','user.name','Studio Peer Test']);git(peer,['config','user.email','peer@example.invalid']);
  writeFileSync(resolve(peer,'README.md'),'Remote update');git(peer,['add','.']);git(peer,['commit','-m','Remote update']);git(peer,['push','origin','main']);
  const remote=f.remoteHead();assert.throws(()=>syncStudio(f.options),/newer or divergent/);assert.equal(f.head(),before);assert.equal(f.remoteHead(),remote);
});
test('Git dry-run hooks can identify push intent without publishing',t=>{
  const f=fixture(t),result=resolve(f.temporary,'intent.json');
  const core=pathToFileURL(resolve('scripts/studio-sync-core.mjs')).href;
  const probe=resolve(f.temporary,'probe.mjs');writeFileSync(probe,`import{writeFileSync}from'node:fs';import{inspectGitPush}from${JSON.stringify(core)};writeFileSync(${JSON.stringify(result)},JSON.stringify(inspectGitPush()));`);
  const quote=value=>"'"+value.replaceAll("'","'\\''")+"'";
  writeFileSync(resolve(f.studio,'.git/hooks/pre-push'),`#!/bin/sh\nexec ${quote(process.execPath.replaceAll('\\','/'))} ${quote(probe.replaceAll('\\','/'))}\n`,{mode:0o755});
  writeFileSync(resolve(f.studio,'README.md'),'Dry-run change');git(f.studio,['add','.']);git(f.studio,['commit','-m','Dry-run test']);
  const before=f.remoteHead();git(f.studio,['push','--dry-run','origin','main']);assert.deepEqual(JSON.parse(readFileSync(result,'utf8')),{dryRun:true});assert.equal(f.remoteHead(),before);
  git(f.studio,['push','origin','main']);assert.deepEqual(JSON.parse(readFileSync(result,'utf8')),{dryRun:false});
  writeFileSync(result,'stale');git(f.studio,['push','--dry-run','origin','main']);assert.deepEqual(JSON.parse(readFileSync(result,'utf8')),{dryRun:true});
});
test('pins precede dates; ordered pins and undated projects behave predictably',()=>{
  const project=(id,date,pinned=false,pinOrder=100)=>({id,data:{date,pinned,pinOrder}});
  const values=[project('old','2025-01-01'),project('new','2026-01-01'),project('undated'),project('pin2','2026-01-01',true,2),project('pin1','2024-01-01',true,1)];
  assert.deepEqual(values.sort(compareProjects).map(x=>x.id),['pin1','pin2','new','old','undated']);
  const posts=values.filter(x=>x.data.date).map(x=>({...x,data:{...x.data,publishedAt:new Date(x.data.date)}}));
  assert.deepEqual(posts.sort(comparePosts).map(x=>x.id),['pin1','pin2','new','old']);
});
