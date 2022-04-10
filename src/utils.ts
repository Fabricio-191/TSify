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

function joinArrays<T>(...arrays: T[][]): T[] {
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

type Type = 'array' | 'bigint' | 'boolean' | 'null' | 'number' | 'object' | 'string' | 'undefined';
export function typeof2(thing: unknown): Type {
	if(thing === null) return 'null';
	if(Array.isArray(thing)) return 'array';
	const type = typeof thing;

	if(type === 'symbol' || type === 'function'){
		throw new Error(`Type ${type} is not supported`);
	}

	return type;
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

function objectSimilarity(a: object, b: object): number {
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
*/