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

	const arr = utils.filterDuplicates(type);
	const stringified = arr.map(stringifyProp);

	if(arr.length === 1 || utils.filterDuplicates(stringified).length === 1){
		return `${stringified[0] as string}[]`; // type[]
	}else if(arr.length <= type.length / 2){
		return `Array<${stringified.join(' | ')}>`; // Array<type1 | type2>
	}else return `[\n${
		utils.indent(type.map(prop => {
			if(prop.optional){
				return (
					prop.types.length > 1 ?
						`(${stringifyProp(prop)})` :
						stringifyProp(prop)
				) + '?';
			}else return stringifyProp(prop);
		}).join(',\n'))
	}\n]`; // [type1, type2, type3, ...]
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