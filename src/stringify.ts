/* eslint-disable no-else-return */
import * as utils from './utils';
import type { Prop, PropType } from './utils';
const { isArray } = Array;

function stringifyPropType(type: PropType): string {
	if(typeof type === 'string') return type;

	if(isArray(type)){
		if(type.length === 0) return '[]';

		const arr = utils.filterDuplicates(type);
		const stringified = arr.map(stringifyProp);

		if(arr.length === 1){
			return `${stringified[0] as string}[]`; // type[]
		}else if(arr.length <= type.length / 2){
			return `Array<${stringified.join(' | ')}>`; // Array<type1 | type2>
		}else return `[\n${
			utils.indent(type.map(prop =>
				stringifyProp(prop) + (prop.optional ? '?' : '')
			).join(',\n'))
		}\n]`; // [type1, type2, type3, ...]
	}else{
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
}

export default function stringifyProp(prop: Prop): string {
	return prop.types.map(stringifyPropType).join(' | ');
}