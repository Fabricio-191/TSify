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

/*
export function arrayHasOneValue(arr: unknown[]): boolean {
	return arr.every(x => x === arr[0]);
}
*/

export function indent(str: string, indentation = '\t'): string {
	return str.replace(/^/gm, indentation);
}

export type Obj = Record<string, Prop>;
export type Arr = Prop[];

export type PropType = Arr | Obj | string | 'bigint' | 'boolean' | 'null' | 'number' | 'string' | 'undefined';
export interface Prop {
	types: PropType[];
	optional?: true;
}