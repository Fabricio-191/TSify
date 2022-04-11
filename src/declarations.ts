// @ts-nocheck
import type { PropType, Obj, Arr, Prop } from './parse';
import stringifyProp from './stringify';
import * as deepStrictEqual from 'fast-deep-equal/es6';
import { compareTwoStrings as stringSimilarity } from 'string-similarity';
import * as utils from './utils';
const { isArray } = Array;

function isObj(thing: unknown): thing is Obj {
	return typeof thing === 'object' &&
		!Array.isArray(thing) &&
		thing !== null;
}

/*
https://www.npmjs.com/package/nearest-neighbor
https://www.npmjs.com/package/fuzzy-equal
https://www.npmjs.com/package/alike
*/
function objectSimilarity(a: object, b: object): number {
	if(deepStrictEqual(a, b)) return 1;
	let similarity = 0;

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if(deepStrictEqual(keysA, keysB)){
		similarity += 0.6;
	// eslint-disable-next-line @typescript-eslint/require-array-sort-compare
	}else if(deepStrictEqual(keysA.sort(), keysB.sort())){
		similarity += 0.4;
	}

	const keyValue = 1 / (keysA.length + keysB.length) / 4;
	for(const key of keysA){
		if(key in b){
			if(deepStrictEqual(a[key], b[key])){
				similarity += keyValue * 4;
				continue;
			}

			const typeA = typeof a[key];
			const typeB = typeof b[key];

			if(typeA === typeB){
				if(typeA === 'object'){
					similarity += keyValue * 10 * objectSimilarity(a[key], b[key]);
				}else{
					similarity += keyValue * 2;
				}
			}else{
				similarity += keyValue;
			}
		}else{
			similarity -= keyValue;
		}
	}

	return similarity > 1 ? 1 : similarity;
}

function typeSimilarity(obj1: Prop, obj2: Prop): number {
	const a = obj1.types, b = obj2.types;
	if(Array.isArray(a) !== Array.isArray(b)) return 0;
	if(deepStrictEqual(a, b)) return 1;

	if(Array.isArray(a)){

	}else{

	}
}

type cacheFn = (cache: CacheEntry[], type: Prop, key: string) => string;

const manage: cacheFn = (type, key) => {
	if(typeof type === 'string') return type;

	const sameType = cache.find(x => deepStrictEqual(x, type));
	const sameKey = cache.find(x => x.key === key);

	if(sameType === sameKey && sameType){
		sameType.uses++;
		return sameType.key;
	}else if(sameType && compareTwoStrings(sameType.key, key) > 0.5){
		sameType.uses++;
		return sameType.key;
	}else if(sameKey){
		if(
			isArray(sameKey) === isArray(type) &&
			Object.keys(sameKey.type).some(k => k in type)
		){
			if(isArray(type)){
				sameKey.type = joinArrays(sameKey.type as Arr, type);
			}else{
				sameKey.type = joinObjects(sameKey.type as Obj, type);
			}
		}else{}




		sameKey.uses++;
		return sameKey.key;
	}

	const similarType = cache.find(x =>
		isArray(x.type) === isArray(type) &&
		utils.objectSimilarity(x.type, type) > 0.7
	);
	const similarKey = cache.find(x => key.length > 5 && compareTwoStrings(x.key, key) > 0.8);

	if(similarType === similarKey){

	}else if(similarType){

	}else if(similarKey){

	}

	if(sameKey && isArray(sameKey) === isArray(type)){
		if(isArray(type)){
			sameKey.type = joinArrays(sameKey.type as Arr, type);
		}else{
			sameKey.type = joinObjects(sameKey.type as Obj, type);
		}


		sameKey.uses++;
		return sameKey.key;
	}

	const entry: CacheEntry = {
		key,
		type,
		uses: 0,
		declared: false,
	};

	cache.push(entry);
	return entry.key;
};

function cachePropType(cache: CacheEntry[], type: PropType[]): string {

}

function cacheProp(cache: CacheEntry[], type: Prop): string {

}

interface TypeDeclaration {
	name: string;
	prop: Prop;
	uses: number;
}

export default function makeDeclarations(parsed: Prop): string {
	const cache: TypeDeclaration[] = [];

	cacheProp(cache, parsed);

	let result = '';
	for(const entry of cache){
		if(entry.uses > 2) result += `type ${entry.name} = ${stringifyProp(entry.prop)};\n`;
	}

	return result;
}