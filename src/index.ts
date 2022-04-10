import * as utils from './utils';
// import { compareTwoStrings } from 'string-similarity';

type PropType = Prop[] | Record<string, Prop> | string | 'bigint' | 'boolean' | 'null' | 'number' | 'string' | 'undefined';
interface Prop {
	types: PropType[];
	optional?: true;
}

function parseObj(objs: object[]): Record<string, Prop> {
	const result: Record<string, Prop> = {};

	const allKeys = utils.joinKeys(...objs);
	for(const key of allKeys){
		const objsWithKey = objs.filter(x => key in x).map(x => x[key] as unknown);
		result[key] = parse(objsWithKey);

		if(objsWithKey.length !== objs.length){
			(result[key] as Prop).optional = true;
		}
	}
	return result;
}

function parseArr(arrs: unknown[][]): Prop[] {
	// eslint-disable-next-line no-confusing-arrow
	const maxLength = arrs.reduce<number>((acc, arr) =>
		acc > arr.length ? acc : arr.length, 0
	);

	const result: Prop[] = [];

	for(let i = 0; i < maxLength; i++){
		const things = arrs.filter(arr => i in arr).map(arr => arr[i]);
		result[i] = parse(things);

		if(things.length !== arrs.length){
			(result[i] as Prop).optional = true;
		}
	}

	return result;
}

function parse(things: unknown[]): Prop {
	const types = utils.filterDuplicates(things.map(utils.typeof2));
	const prop: Prop = {
		types: types.filter(x => x !== 'object' && x !== 'array') as PropType[],
	};

	if(types.includes('object')){
		const objs: object[] = things.filter(x =>
			typeof x === 'object' && x !== null && !Array.isArray(x)
		) as object[];

		prop.types.push(parseObj(objs));
	}

	if(types.includes('array')){
		const arrays = things.filter(x => Array.isArray(x)) as unknown[][];

		prop.types.push(parseArr(arrays));
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
// #endregion

/*
{
  types: [
    [
      { types: [ '1' ] },
      { types: [ '2' ] },
      { types: [ '3' ] },
      { types: [ 'number' ], optional: true }
    ]
  ]
}
{
  types: [
    {
      a: { types: [ 'number', 'string' ] },
      b: {
        types: [
          { c: { types: [ 'string' ] } }
        ],
        optional: true
      },
      d: {
        types: [
          [ { types: [ 'false' ] }, { types: [ 'true' ] } ]
        ]
      }
    }
  ]
}
*/

function stringify(type: Prop | PropType): string {
	if(typeof type === 'string') return type;
	if('types' in type && Array.isArray(type.types)){
		return (type as Prop).types.map(stringify).join(' | ');
	}

	if(Array.isArray(type)){
		return `[${type.map(t => stringify(t) + (t.optional ? '?' : '')).join(', ')}]`;
	}

	let str = '';
	const keys = Object.keys(type);
	for(const key in type){
		const end = key === keys[keys.length - 1] ? '' : '\n';
		const needsQuotes = key.includes('.');
		const t = type[key] as Prop;

		str += `${needsQuotes ? `'${key}'` : key}${t.optional ? '?' : ''}: ${stringify(t)};${end}`;
	}

	return `{\n${utils.indent(str)}\n}`;
}
// #endregion

export default function TSify(...things: unknown[]): string {
	const parsed = parse(things);

	return parsed.types.map(stringify).join(' | ');
}

import { writeFileSync } from 'fs';

export function toFile(file: string, ...things: unknown[]): void {
	writeFileSync(file, TSify(...things));
}
/*
import { readFileSync } from 'fs';
toFile('raw.d.ts', JSON.parse(
	readFileSync(__dirname + '/raw.json').toString()
));
*/