/* eslint-disable no-else-return */
import * as utils from './utils';
import type { Prop, PropType, Arr, Obj } from './utils';
const { isArray } = Array;

export function parse(thing: unknown): Prop {
	if(typeof thing === 'object'){
		if(thing === null){
			return { types: ['null'] };
		}else if(isArray(thing)){
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

export function joinObjects(...objs: Obj[]): Obj {
	const keys = utils.joinKeys(...objs);
	const result: Record<string, Prop> = {};

	for(const key of keys){
		const withKey = objs.filter(x => key in x).map(x => x[key] as Prop);
		result[key] = joinParsed(...withKey);

		if(withKey.length !== objs.length){
			(result[key] as Prop).optional = true;
		}
	}

	return result;
}

export function joinArrays(...arrs: Arr[]): Arr {
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
	return result;
}

export function joinParsed(...parsedThings: Prop[]): Prop {
	const types: PropType[] = [];

	const objs: Obj[] = [], arrs: Arr[] = [];
	for(const type of utils.joinArrays(...parsedThings.map(x => x.types))){
		if(typeof type === 'string'){
			types.push(type);
		}else if(isArray(type)){
			arrs.push(type);
		}else{
			objs.push(type);
		}
	}

	if(objs.length !== 0) types.push(joinObjects(...objs));
	if(arrs.length !== 0) types.push(joinArrays(...arrs));

	return { types };
}