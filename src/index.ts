import peek from 'peek-stream';
import { Duplex } from 'stream';
import through from 'through2';
import zlib, { BrotliOptions } from 'zlib';

// https://stackoverflow.com/a/39032023/4397028
function isBrotli(buf: Buffer | string) {
  if (!buf || buf.length < 4) {
    return false;
  }
  return (
    buf[0] === 0xce && buf[1] === 0xb2 && buf[2] === 0xcf && buf[3] === 0x81
  );
}

export function unbrotli(options?: BrotliOptions): Duplex {
  return peek({ newline: false, maxBuffer: 10 }, function(
    data: Buffer | string,
    swap: (err: Error | undefined, parser: Duplex) => void
  ) {
    if (isBrotli(data)) {
      return swap(undefined, zlib.createBrotliDecompress(options));
    }

    return swap(undefined, through());
  });
}
