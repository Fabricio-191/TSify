/* eslint-disable no-confusing-arrow */
/* eslint-disable no-console */
import { writeFileSync } from 'fs';
import { readFileSync } from 'fs';

const indent = (str: string, indentation = '\t'): string => str.replace(/^/gm, indentation);

function removeDuplicates(arr: unknown[]): unknown[] {
	const set = new Set();

	for(const elem of arr){
		set.add(elem);
	}

	return Array.from(set);
}
const joinArrays = (...arrays: unknown[]): unknown[] =>
	removeDuplicates(([] as unknown[]).concat(...arrays));

const joinKeys = (...objs: object[]): string[] => joinArrays(
	...objs.map(Object.keys)
) as string[];

function TSify(...things: unknown[]): string {
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

			const typesInKey = TSify(...objs.filter(obj => key in obj).map(obj => obj[key] as unknown));

			str += `${needsQuotes ? `'${key}'` : key}${optional}: ${typesInKey};${end}`;
		}

		return '{\n' + indent(str) + '\n}';
	}

	if(arrays.length !== 0){
		for(const arr of arrays){
			const a = removeDuplicates(arr.map(x => TSify(x)));
			if(a.length === 0) return '[]';

			if(a.length === 1 || a.length <= arr.length / 2){
				types.push(`Array<${a.join(' | ')}>`);
			}else{
				types.push(`[\n${
					indent(arr.map(x => TSify(x)).join(',\n'))
				}\n]`);
			}
		}
	}

	return removeDuplicates(types).join(' | ');
}

console.log(
	TSify({
		service: 'CSI',
		params: [
			{
				key: 'c',
				value: 'WEB',
			},
			{
				value: '2.20220405.00.00',
			},
			{
				key: 'yt_li',
				value: '0',
			},
			{
				key: 'GetWatchNext_rid',
				value: '0x8aa8c632e6a8b64c',
			},
		],
	}, {
		service: null,
	})
);

TSify.toFile = (file: string, thing: unknown) => {
	const str = `/* eslint-disable @typescript-eslint/ban-types */
export default interface Data ${TSify(thing)}`;
	writeFileSync(file, str);
};

TSify.toFile('raw.ts', JSON.parse(
	readFileSync('../raw.json').toString()
));