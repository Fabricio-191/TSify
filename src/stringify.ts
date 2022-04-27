/* eslint-disable no-else-return */
import type { Prop, Obj, Arr } from './utils';
import * as utils from './utils';

export function stringifyObj(type: Obj): string {
	const keys = Object.keys(type);
	if(keys.length === 0) return '{}';

	let str = '';
	for(const key of keys){
		const prop = type[key] as Prop;

		str += key.includes('.') ? `'${key}'` : key;
		if(prop.optional) str += '?';

		str += `: ${stringifyProp(prop)};`;
		if(key !== keys[keys.length - 1]) str += '\n';
	}

	return '{\n' + utils.indent(str) + '\n}';
}

function stringifyArr(type: Arr): string {
	if(type.length === 0) return '[]';

	const stringifiedArr = utils.filterDuplicates(type.map(stringifyProp));

	if(stringifiedArr.length === 1){
		return `${stringifiedArr[0] as string}[]`; // type[]
	}else if(stringifiedArr.length <= type.length / 2){
		return `Array<${stringifiedArr.join(' | ')}>`; // Array<type1 | type2>
	}else{
		const strArr = type.map(prop => {
			if(!prop.optional){
				return stringifyProp(prop);
			}

			return (
				prop.types.length > 1 ?
					`(${stringifyProp(prop)})` : stringifyProp(prop)
			) + '?';
		}).join(',\n');

		return `[\n${utils.indent(strArr)}\n]`; // [type1, type2, type3, ...]
	}
}

export default function stringifyProp(prop: Prop): string {
	return prop.types.map(type => {
		if(typeof type === 'string') return type;

		if(Array.isArray(type)){
			return stringifyArr(type);
		}else{
			return stringifyObj(type);
		}
	}).join(' | ');
}