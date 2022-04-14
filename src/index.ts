import { parse, joinParsed } from './parse';
import stringify from './stringify';
import { writeFileSync } from 'fs';

export default function TSify(...things: unknown[]): string {
	const parsed = joinParsed(...things.map(parse));
	return stringify(parsed);
}

export function toFile(file: string, ...things: unknown[]): void {
	writeFileSync(file, TSify(...things));
}
