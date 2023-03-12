import { readFileSync } from 'fs';

export const readJsonFile = (path: string) => {
  const file = readFileSync(path, { encoding: 'utf8' });
  return JSON.parse(file);
};
