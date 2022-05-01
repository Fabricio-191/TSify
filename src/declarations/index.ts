/* eslint-disable no-else-return */
import type { Prop } from '../utils';
import type { TypeDeclaration, Cache } from './cache';
import manageObj from './cache';
import { logAll } from '../utils'; logAll();
import replacer from './replacer';
const { isArray } = Array;

function add(cache: Cache, prop: Prop, name: string): void {
	for(let i = 0; i < prop.types.length; i++){
		const type = prop.types[i];
		if(isArray(type)){
			type.forEach(p => add(cache, p, name));
		}else if(typeof type === 'object' && type !== null){
			for(const key in type){
				add(cache, type[key] as Prop, key);
			}

			prop.types[i] = manageObj(cache, type, name);
		}
	}
}

export default function makeDeclarations(parsed: Prop): string {
	const cache: TypeDeclaration[] = [];

	add(cache, parsed, 'FinalData1');

	return replacer(cache, parsed);
}