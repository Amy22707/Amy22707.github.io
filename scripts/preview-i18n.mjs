import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
createServer(async (request,response) => {
  try {
    const pathname=decodeURIComponent(new URL(request.url,'http://127.0.0.1:4347').pathname);
    let file;
    if(pathname==='/__tests__/inline')file=resolve('tests/i18n-browser.html');
    else {
      const studio=pathname.startsWith('/amy-studio/');
      const root=resolve(studio?'.studio-workspace/amy-studio/dist':'dist');
      let path=studio?pathname.slice('/amy-studio/'.length):pathname.slice(1);
      if(!path||path.endsWith('/'))path+='index.html';
      file=resolve(root,path);
      if(!file.startsWith(root+sep)){response.writeHead(403);response.end();return;}
    }
    const data=await readFile(file);
    response.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});response.end(data);
  }catch{response.writeHead(404);response.end('Not found');}
}).listen(4347,'127.0.0.1',()=>console.log('Language QA: http://127.0.0.1:4347/__tests__/inline'));
