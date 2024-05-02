import * as util from 'node:util';

export const inspectObject = (obj: Record<any, any>) =>
  util.inspect(obj, {
    showHidden: false,
    depth: 3,
    colors: false,
    breakLength: Infinity,
    compact: true,
  });
