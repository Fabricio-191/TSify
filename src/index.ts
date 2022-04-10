/* eslint-disable no-else-return */
import * as utils from './utils';
// import * as deepStrictEqual from 'fast-deep-equal/es6';
// import { compareTwoStrings } from 'string-similarity';

type Obj = Record<string, Prop>;
type Arr = Prop[];

type PropType = Arr | Obj | string | 'bigint' | 'boolean' | 'null' | 'number' | 'string' | 'undefined';
interface Prop {
	types: PropType[];
	optional?: true;
}

function parse(thing: unknown): Prop {
	if(typeof thing === 'object'){
		if(thing === null){
			return { types: ['null'] };
		}else if(Array.isArray(thing)){
			return { types: [thing.map(parse)] };
		}else{
			const result: Record<string, Prop> = {};
			for(const key in thing){
				result[key] = parse(thing[key]);
			}

			return { types: [result] };
		}
	}

	return { types: [typeof thing] };
}

function joinParsed(...parsedThings: Prop[]): Prop {
	const types: PropType[] = [];

	const objs = [], arrs = [];
	for(const type of utils.joinArrays(...parsedThings.map(x => x.types))){
		if(typeof type === 'string'){
			types.push(type);
		}else if(Array.isArray(type)){
			arrs.push(type);
		}else{
			objs.push(type);
		}
	}

	if(objs.length !== 0){
		const keys = utils.joinKeys(...objs);
		const result: Record<string, Prop> = {};

		for(const key of keys){
			const withKey = objs.filter(x => key in x).map(x => x[key] as Prop);
			result[key] = joinParsed(...withKey);

			if(withKey.length !== objs.length){
				(result[key] as Prop).optional = true;
			}
		}

		types.push(result);
	}
	if(arrs.length !== 0){
		// eslint-disable-next-line no-confusing-arrow
		const maxLength = arrs.reduce<number>((acc, arr) =>
			acc > arr.length ? acc : arr.length, 0
		);

		const result: Prop[] = [];

		for(let i = 0; i < maxLength; i++){
			const withIndex = arrs.filter(arr => i in arr).map(arr => arr[i] as Prop);
			result[i] = joinParsed(...withIndex);

			if(withIndex.length !== arrs.length){
				(result[i] as Prop).optional = true;
			}
		}

		types.push(result);
	}

	return { types };
}

function propTypes(manage: cacheFn, types: PropType[]): string {
	return types.map(t => propType(manage, t)).join(' | '); // type1 | type2 | type3
}

function propType(manage: cacheFn, type: PropType): string {
	if(typeof type === 'string') return type;

	if(Array.isArray(type)){
		if(type.length === 0) return '[]';

		const arr = utils.filterDuplicates(type);
		const stringified = arr.map(x => propTypes(manage, x.types));

		if(arr.length === 1){
			return `${stringified[0] as string}[]`; // type[]
		}else if(arr.length <= type.length / 2){
			return `Array<${stringified.join(' | ')}>`; // Array<type1 | type2>
		}else return `[\n${
			utils.indent(type.map(prop =>
				propTypes(manage, prop.types) + (prop.optional ? '?' : '')
			).join(',\n'))
		}\n]`; // [type1, type2, type3, ...]
	}

	const keys = Object.keys(type);
	if(keys.length === 0) return '{}';

	let str = '';
	for(const key of keys){
		const end = key === keys[keys.length - 1] ? '' : '\n';
		const prop = type[key] as Prop;

		str += `${key.includes('.') ? `'${key}'` : key}${prop.optional ? '?' : ''}: ${propTypes(manage, prop.types)};${end}`;
	}

	return '{\n' + utils.indent(str) + '\n}';
}

type cacheFn = (type: PropType, key: string | null) => string;
interface CacheEntry {
	id: string;
	key: string | null;
	type: Arr | Obj;
	uses: number;
	declared: boolean;
}

export default function TSify(...things: unknown[]): string {
	let lastID = 0;
	const genID = (): string => 'ᴤᴧ' + (lastID++).toString(36) + 'ᴫᴅ';

	const cache: CacheEntry[] = [];
	const manage: cacheFn = (type, key = null) => {
		if(typeof type === 'string') return type;

		const sameType = cache.find(x => x.type === type) ?? null;
		if(sameType){
			sameType.uses++;
			return sameType.id;
		}

		const entry: CacheEntry = {
			id: genID(),
			key,
			type,
			uses: 0,
			declared: false,
		};

		cache.push(entry);
		return entry.id;
	};

	/*
	public main(type: string, key: string | null = null): string {
		if(!TypesCache.objectRegex.test(type)){
			return type;
		}

		const sameType = this.cache.find(x => x.types.includes(type)) ?? null;
		if(sameType){
			sameType.uses++;
			return sameType.id;
		}
		const sameKey = this.cache.find(x => x.key === key);
		if(sameKey){
			sameKey.types.push(type);
			sameKey.uses++;
			return sameKey.id;
		}

		const id = this.genID();
		if(key === null) key = id.slice(2, -2);

		this.cache.push({
			id,
			key,
			types: [type],
			uses: 1,
			declared: false,
		});

		return id;
	}
	*/

	const parsed = joinParsed(...things.map(parse));

	let declarations = '';
	let final = propTypes(manage, parsed.types);

	/*
	while(final.includes('ᴤᴧ')){
		for(const entry of cache){
			if(entry.declared){
				final = final.replaceAll(entry.id, entry.key);
				continue;
			}

			if(!entry.declared && entry.uses > 2){
				entry.declared = true;
				declarations += `type ${entry.key} = ${stringify(entry.type)};\n\n`;
				final = final.replaceAll(entry.id, entry.key);
			}else{
				final = final.replaceAll(entry.id, entry.types[0]);
			}
		}
	}
	*/

	return `${declarations}\ntype FinalData = ${final}\n\nexport default FinalData;\n`;
}

import { writeFileSync } from 'fs';

export function toFile(file: string, ...things: unknown[]): void {
	writeFileSync(file, TSify(...things));
}

console.log(TSify(
	{ a: 123 },
	{ b: 123 },
	false,
	['a', 'b', 'c']
));

/*
import { readFileSync } from 'fs';
toFile('raw.d.ts', JSON.parse(
	readFileSync(__dirname + '/raw.json').toString()
));
*/