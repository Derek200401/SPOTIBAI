import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const audioPath = join(process.cwd(), 'backend', 'Muling Pagbigyan by osas.mp3');

export async function GET(request: Request) {
  let audio: Buffer;

  try {
    audio = await readFile(audioPath);
  } catch {
    return new Response('Audio file not found', { status: 404 });
  }

  const size = audio.byteLength;
  const headers = new Headers({
    'Accept-Ranges': 'bytes',
    'Content-Type': 'audio/mpeg',
    'Cache-Control': 'public, max-age=3600',
    'Content-Length': String(size),
  });
  const range = request.headers.get('range');

  if (!range) {
    return new Response(new Uint8Array(audio), { headers });
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) {
    headers.set('Content-Range', `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  const start = match[1]
    ? Number(match[1])
    : Math.max(size - Number(match[2]), 0);
  const end = match[2] && match[1]
    ? Math.min(Number(match[2]), size - 1)
    : size - 1;

  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || start > end) {
    headers.set('Content-Range', `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  const chunk = audio.subarray(start, end + 1);
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(chunk.byteLength));

  return new Response(new Uint8Array(chunk), { status: 206, headers });
}