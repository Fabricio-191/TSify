import * as deepStrictEqual from 'fast-deep-equal/es6';
import { inspect } from 'util';
export function logAll(...args: unknown[]): void {
	// eslint-disable-next-line no-console
	console.log(...args.map(x => inspect(x, { depth: null, colors: true })));
}

export function filterDuplicates<T>(arr: T[]): T[] {
	const result: T[] = [];

	for(const item of arr){
		if(!result.some(x => deepStrictEqual(x, item))){
			result.push(item);
		}
	}

	return result;
}

export function joinArrays<T>(...arrays: T[][]): T[] {
	return filterDuplicates(([] as T[]).concat(...arrays));
}

export function joinKeys(...objs: object[]): string[] {
	return joinArrays(...objs.map(Object.keys));
}

export function arrayHasOneValue(arr: unknown[]): boolean {
	return arr.every(x => x === arr[0]);
}

export function indent(str: string, indentation = '\t'): string {
	return str.replace(/^/gm, indentation);
}

export function linesCount(str: string): number {
	return str.split('\n').length;
}

export function objectSimilarity(a: object, b: object): number {
	if(deepStrictEqual(a, b)) return 1;
	let similarity = 0;

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if(deepStrictEqual(keysA, keysB)){
		similarity += 0.5;
	}

	const keyunknown = 1 / (keysA.length + keysB.length) / 4;
	for(const key of keysA){
		if(key in b){
			if(deepStrictEqual(a[key], b[key])){
				similarity += keyunknown * 4;
				continue;
			}

			const typeA = typeof a[key];
			const typeB = typeof b[key];

			if(typeA === typeB){
				if(typeA === 'object'){
					similarity += keyunknown * 10 * objectSimilarity(a[key], b[key]);
				}else{
					similarity += keyunknown * 2;
				}
			}else{
				similarity += keyunknown;
			}
		}else{
			similarity -= keyunknown;
		}
	}

	return similarity > 1 ? 1 : similarity;
}

/*
function arrayIsHomogeneous(arr: unknown[]): boolean {
	return arrayHasOneValue(arr.map(typeof2));
}

function indentInner(str: string, indentation = '\t'): string {
	const lines = str.split('\n');

	for(let i = 1; i < lines.length - 1; i++){
		lines[i] = indentation + (lines[i] as string);
	}

	return lines.join('\n');
}


function parse(cache: TypesCache, things: unknown[]): Prop {
	const types = utils.filterDuplicates(things.map(utils.typeof2));
	const prop: Prop = {
		types: types.filter(x => x !== 'object' && x !== 'array') as PropType[],
	};

	if(types.includes('object')){
		const objs: object[] = things.filter(x =>
			typeof x === 'object' && x !== null && !Array.isArray(x)
		) as object[];

		const result: Record<string, Prop> = {};

		const allKeys = utils.joinKeys(...objs);
		for(const key of allKeys){
			const objsWithKey = objs.filter(x => key in x).map(x => x[key] as unknown);
			result[key] = parse(cache, objsWithKey);

			if(objsWithKey.length !== objs.length){
				(result[key] as Prop).optional = true;
			}
		}

		prop.types.push(cache.manage(result));
	}

	if(types.includes('array')){
		const arrays = things.filter(x => Array.isArray(x)) as unknown[][];

		// eslint-disable-next-line no-confusing-arrow
		const maxLength = arrays.reduce<number>((acc, arr) =>
			acc > arr.length ? acc : arr.length, 0
		);

		const result: Prop[] = [];

		for(let i = 0; i < maxLength; i++){
			const things = arrays.filter(arr => i in arr).map(arr => arr[i]);
			result[i] = parse(cache, things);

			if(things.length !== arrays.length){
				(result[i] as Prop).optional = true;
			}
		}

		prop.types.push(cache.manage(result));
	}

	if(types.length === 1 && things.length !== 1 && utils.arrayHasOneValue(things)){
		let thing = things[0] as bigint | boolean | number | string | null | undefined;
		if(thing === null) thing = 'null';
		if(typeof thing === 'undefined') thing = 'undefined';

		return {
			types: [thing.toString()],
		};
	}

	return prop;
}
*/
