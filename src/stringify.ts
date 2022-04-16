/* eslint-disable no-else-return */
import type { Prop, PropType } from './utils';
import * as utils from './utils';
import { findType, cacheProp, type TypeDeclaration } from './cache';

function stringifyPropType(cache: TypeDeclaration[], type: PropType, check = true): string {
	if(typeof type === 'string') return type;

	if(check){
		const t = findType(cache, type);
		if(t !== null) return stringifyPropType(cache, t, false);
	}

	if(Array.isArray(type)){
		if(type.length === 0) return '[]';

		const arr = utils.filterDuplicates(type);
		const stringified = arr.map(a => stringifyProp(cache, a));

		if(arr.length === 1 || utils.filterDuplicates(stringified).length === 1){
			return `${stringified[0] as string}[]`; // type[]
		}else if(arr.length <= type.length / 2){
			return `Array<${stringified.join(' | ')}>`; // Array<type1 | type2>
		}else return `[\n${
			utils.indent(type.map(prop => {
				if(prop.optional){
					return (
						prop.types.length > 1 ?
							`(${stringifyProp(cache, prop)})` :
							stringifyProp(cache, prop)
					) + '?';
				}else return stringifyProp(cache, prop);
			}).join(',\n'))
		}\n]`; // [type1, type2, type3, ...]
	}else{
		const keys = Object.keys(type);
		if(keys.length === 0) return '{}';

		let str = '';
		for(const key of keys){
			const prop = type[key] as Prop;

			str += key.includes('.') ? `'${key}'` : key;
			if(prop.optional) str += '?';

			str += `: ${stringifyProp(cache, prop)};`;
			if(key !== keys[keys.length - 1]) str += '\n';
		}

		return '{\n' + utils.indent(str) + '\n}';
	}
}

function stringifyProp(cache: TypeDeclaration[], prop: Prop): string {
	return prop.types.map(a => stringifyPropType(cache, a)).join(' | ');
}

export default function stringify(parsed: Prop): string {
	const cache: TypeDeclaration[] = [];
	cacheProp(cache, parsed, '');

	const declarations: string[] = [
		'/* eslint-disable @typescript-eslint/ban-types */\n',
	];
	for(const entry of cache){
		if(entry.uses < 2) continue;

		entry.declared = true;
		declarations.push(`type ${entry.name} = ${stringifyPropType(cache, entry.type)};\n`);
	}

	const string = stringifyProp(cache, parsed);

	let finalString = `${declarations.join('\n')}\ntype FinalData = ${string}\n\nexport default FinalData;\n`;

	while(finalString.includes('\xFF')){
		for(const entry of cache){
			if(entry.declared){
				finalString = finalString.replaceAll(entry.id, entry.name);
			}else{
				finalString = finalString.replaceAll(entry.id, stringifyPropType(cache, entry.type));
			}
		}
	}

	return finalString;
}
