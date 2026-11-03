import test from 'node:test';
import assert from 'node:assert/strict';
import { compareProjects, projectPublishedAt, formatProjectDate } from '../src/utils/contentOrder.mjs';
const entry=(id,publishedAt,updatedAt,pinned=false,pinOrder=100)=>({id,data:{publishedAt,updatedAt,pinned,pinOrder}});
test('publication date, not update time, determines project order',()=>{
  const old=entry('old','2025-01-01','2026-11-03'),fresh=entry('fresh','2026-09-07','2026-09-08');
  assert.deepEqual([old,fresh].sort(compareProjects).map(x=>x.id),['fresh','old']);
});
test('pins retain their manual order before publication dates',()=>{
  const a=entry('pin-first','2024-01-01','2026-11-03',true,1),b=entry('pin-second','2026-10-09','2026-10-24',true,2),c=entry('new','2026-11-03');
  assert.deepEqual([c,b,a].sort(compareProjects).map(x=>x.id),['pin-first','pin-second','new']);
});
test('publishedAt takes priority over legacy date; missing dates stay last',()=>{
  const a=entry('a','2026-01-10');a.data.date='2030-01-01';
  const b=entry('b','2026-09-07');
  assert.deepEqual([entry('none'),a,b].sort(compareProjects).map(x=>x.id),['b','a','none']);
  assert.equal(projectPublishedAt(a).toISOString().slice(0,10),'2026-01-10');
});
test('GitHub UTC timestamps display as Beijing calendar dates',()=>{
  assert.equal(formatProjectDate(new Date('2026-07-07T16:58:14Z')),'2026.07.08');
});
