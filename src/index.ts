// import { compareTwoStrings } from 'string-similarity';
import * as deepStrictEqual from 'fast-deep-equal/es6';

import { inspect } from 'util';
function logAll(...args: unknown[]): void {
	// eslint-disable-next-line no-console
	console.log(...args.map(x => inspect(x, { depth: null, colors: true })));
}


type Type = 'array' | 'bigint' | 'boolean' | 'null' | 'number' | 'object' | 'string' | 'undefined';
interface Prop {
	values: Value[];
	types: Parsed[];
	optional: boolean;
}

type Parsed = Prop[] | Record<string, Prop> | 'bigint' | 'boolean' | 'null' | 'number' | 'string' | 'undefined';
type Value = Array<unknown> | bigint | boolean | number | object | string | null | undefined;

// #region parse
const typeof2 = (thing: unknown): Type => {
	if(thing === null) return 'null';
	if(Array.isArray(thing)) return 'array';
	const type = typeof thing;

	if(type === 'symbol' || type === 'function'){
		throw new Error(`Typeof ${type} is not supported`);
	}

	return type;
};

function parse(thing: Value): Prop {
	const type = typeof2(thing);

	if(type === 'array'){
		return {
			values: [thing],
			types: [(thing as Value[]).map(parse)],
			optional: false,
		};
	}
	if(type === 'object'){
		const obj = {};

		for(const key in thing as object){
			obj[key] = parse((thing as object)[key]);
		}

		return {
			values: [thing],
			types: [obj],
			optional: false,
		};
	}

	return {
		values: [thing],
		types: [type],
		optional: false,
	};
}
// #endregion

// #region joining types
function filterDuplicates<T>(arr: T[]): T[] {
	const final: T[] = [];

	for(const item of arr){
		if(!final.some(x => deepStrictEqual(x, item))){
			final.push(item);
		}
	}

	return final;
}

function joinArrays<T>(...arrays: T[][]): T[] {
	return filterDuplicates(([] as T[]).concat(...arrays));
}

function joinKeys(...objs: object[]): string[] {
	return joinArrays(...objs.map(Object.keys));
}

function join(things: Prop[]): Prop {

}
// #endregion

// #region stringify
function indent(str: string, indentation = '\t'): string {
	return str.replace(/^/gm, indentation);
}

function stringify(prop: Prop): string {

}
// #endregion

export default function TSify(...things: Value[]): string {
	const parsed = things.map(parse);
	const final = join(parsed);

	return final.types.map(stringify).join(' | ');
}

logAll(parse({
	a: 123,
	b: {
		c: 'hello',
	},
	d: [false, true],
}));

/*


{
	a: 123,
	b: {
		c: 'hello',
	},
	d: [false, true]
}
{
	a: 'asd',
	b: {
		c: 'hello',
	},
	d: [false, true]
}

*/

