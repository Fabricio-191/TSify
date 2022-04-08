/* eslint-disable no-confusing-arrow */
/* eslint-disable no-console */
import { writeFileSync } from 'fs';
import { joinKeys, TypesCache, removeDuplicates, indent } from './utils';

function main(cache: TypesCache, ...things: unknown[]): string {
	let types: string[] = things.map(x => x === null ? 'null' : typeof x);
	if(!types.includes('object')){
		return removeDuplicates(types).join(' | ');
	}

	types = types.filter(x => x !== 'object');
	const arrays: unknown[][] = things.filter(x => Array.isArray(x)) as unknown[][];
	const objs: object[] = things.filter(x => !(
		// @ts-expect-error https://github.com/microsoft/TypeScript/issues/26255
		types.includes(x) || arrays.includes(x)
	)) as object[];

	if(objs.length !== 0){
		const keys = joinKeys(...objs);
		if(keys.length === 0) return '{}';

		let str = '';
		for(const key of keys){
			const end = key === keys[keys.length - 1] ? '' : '\n';
			const optional = objs.every(obj => key in obj) ? '' : '?';
			const needsQuotes = key.includes('.');

			const typesInKey = main(
				cache,
				...objs.filter(obj => key in obj).map(obj => obj[key] as unknown)
			);

			str += `${needsQuotes ? `'${key}'` : key}${optional}: ${cache.main(typesInKey, key)};${end}`;
		}

		return '{\n' + indent(str) + '\n}';
	}

	if(arrays.length !== 0){
		for(let arr of arrays){
			arr = arr.map(x => main(cache, x));
			const a = removeDuplicates(arr);

			if(a.length === 1 || a.length <= arr.length / 2){
				types.push(`Array<${a.join(' | ')}>`);
			}else{
				types.push(`[\n${
					indent(arr.map(x => main(cache, x)).join(',\n'))
				}\n]`);
			}
		}
	}

	return removeDuplicates(types).join(' | ');
}

export default function TSify(...things: unknown[]): string {
	const cache = new TypesCache();
	const string = main(cache, ...things);

	return cache.end(string);
}

export function toFile(file: string, ...things: unknown[]): void {
	writeFileSync(file, TSify(...things));
}

console.log(
	TSify({
		service: 'CSI',
		params: {
			key: 'c',
			value: 'WEB',
		},
		asd: {
			params2: {
				key: '231',
				value: 'str',
			},
		},
	}, {
		service: null,
	})
);

import { readFileSync } from 'fs';
toFile('raw.d.ts', JSON.parse(
	readFileSync(__dirname + '/raw.json').toString()
));

console.log(
	readFileSync(__dirname + '/../raw.d.ts').toString().includes('ᴤᴧ')
);