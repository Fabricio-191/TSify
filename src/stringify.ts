/* eslint-disable no-else-return */
import type { PropType, Obj, Arr, Prop } from './parse';
import { joinArrays, joinObjects } from './parse';
import * as utils from './utils';
import { compareTwoStrings } from 'string-similarity';
const { isArray } = Array;

function propTypes(types: PropType[]): string {
	return types.map(propType).join(' | '); // type1 | type2 | type3
}

function propType(type: PropType): string {
	if(typeof type === 'string') return type;

	if(isArray(type)){
		if(type.length === 0) return '[]';

		const arr = utils.filterDuplicates(type);
		const stringified = arr.map(x => propTypes(x.types));

		if(arr.length === 1){
			return `${stringified[0] as string}[]`; // type[]
		}else if(arr.length <= type.length / 2){
			return `Array<${stringified.join(' | ')}>`; // Array<type1 | type2>
		}else return `[\n${
			utils.indent(type.map(prop =>
				propTypes(prop.types) + (prop.optional ? '?' : '')
			).join(',\n'))
		}\n]`; // [type1, type2, type3, ...]
	}

	const keys = Object.keys(type);
	if(keys.length === 0) return '{}';

	let str = '';
	for(const key of keys){
		const end = key === keys[keys.length - 1] ? '' : '\n';
		const prop = type[key] as Prop;

		str += `${key.includes('.') ? `'${key}'` : key}${prop.optional ? '?' : ''}: ${
			propTypes(prop.types)
		};${end}`;
	}

	return '{\n' + utils.indent(str) + '\n}';
}

type cacheFn = (type: PropType, key: string) => string;
interface CacheEntry {
	id: string;
	key: string;
	type: Arr | Obj;
	uses: number;
	declared: boolean;
}

export default function stringify(parsed: Prop): string {
	let lastID = 0;
	const genID = (): string => 'ᴤᴧ' + (lastID++).toString(36) + 'ᴫᴅ';

	const cache: CacheEntry[] = [];
	// @ts-expect-error asd
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const manage: cacheFn = (type, key) => {
		if(typeof type === 'string') return type;

		const similar = cache.find(x => utils.objectSimilarity(x.type, type) > 0.7);
		if(similar && isArray(similar) === isArray(type)){
			if(isArray(type)){
				similar.type = joinArrays(similar.type as Arr, type);
			}else{
				similar.type = joinObjects(similar.type as Obj, type);
			}

			similar.uses++;
			return similar.id;
		}

		const sameKey = cache.find(x =>
			compareTwoStrings(x.key, key) > 0.8
		);
		if(sameKey && isArray(sameKey) === isArray(type)){
			if(isArray(type)){
				sameKey.type = joinArrays(sameKey.type as Arr, type);
			}else{
				sameKey.type = joinObjects(sameKey.type as Obj, type);
			}


			sameKey.uses++;
			return sameKey.id;
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

	let declarations = '';
	let final = propTypes(parsed.types);

	while(final.includes('ᴤᴧ')){
		for(const entry of cache){
			if(entry.declared){
				final = final.replaceAll(entry.id, entry.key);
				continue;
			}

			if(!entry.declared && entry.uses > 2){
				entry.declared = true;
				declarations += `type ${entry.key} = ${propType(entry.type)};\n\n`;
				final = final.replaceAll(entry.id, entry.key);
			}else{
				final = final.replaceAll(entry.id, propType(entry.type));
			}
		}
	}

	return `${declarations}\ntype FinalData = ${final}\n\nexport default FinalData;\n`;
}