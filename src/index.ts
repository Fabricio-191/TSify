import { parse, joinParsed } from './parse';
import stringifyProp from './stringify';
import makeDeclarations from './declarations';
import { writeFileSync } from 'fs';

export default function TSify(...things: unknown[]): string {
	const parsed = joinParsed(...things.map(parse));
	const str = stringifyProp(parsed);

	const declarations = makeDeclarations(parsed);

	return `${declarations}\ntype FinalData = ${str}\n\nexport default FinalData;\n`;
}

export function toFile(file: string, ...things: unknown[]): void {
	writeFileSync(file, TSify(...things));
}
