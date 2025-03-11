import { createHash } from 'node:crypto';

export function hashString(data: string) {
  const hash = createHash('sha256');
  return hash.update(data).digest('hex');
}
