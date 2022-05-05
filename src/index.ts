import { parse, joinParsed } from './parse';
import stringify, { stringifyObj } from './stringify';
import makeDeclarations from './declarations/';
import { writeFileSync } from 'fs';

export default function TSify(...things: unknown[]): string {
	const parsed = joinParsed(...things.map(parse));
	const declarations = makeDeclarations(parsed);
	return declarations.map(x => stringifyObj(x.type)).join('\n\n') +
		'\ntype FinalData = ' + stringify(parsed) +
		'\n\nexport default FinalData;\n';
}

export function toFile(file: string, ...things: unknown[]): void {
	writeFileSync(file, TSify(...things));
}
