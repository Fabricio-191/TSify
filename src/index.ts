import { parse, joinParsed } from './parse';
import stringify from './stringify';
import makeDeclarations from './declarations/';
import { writeFileSync } from 'fs';

export default function TSify(...things: unknown[]): string {
	const parsed = joinParsed(...things.map(parse));
	return makeDeclarations(parsed) +
		'\ntype FinalData = ' + stringify(parsed) +
		'\n\nexport default FinalData;\n';
}

export function toFile(file: string, ...things: unknown[]): void {
	writeFileSync(file, TSify(...things));
}
