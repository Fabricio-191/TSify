/* eslint-disable no-else-return */
import type { Prop, Arr, Obj, PropType } from './utils';
import { joinArrays, joinObjects } from './parse';
import * as utils from './utils';
import * as deepStrictEqual from 'fast-deep-equal/es6';
const { isArray } = Array;

function isObj(thing: unknown): thing is Obj {
	return typeof thing === 'object' &&
		!isArray(thing) && thing !== null;
}
/*
https://www.npmjs.com/package/nearest-neighbor
https://www.npmjs.com/package/fuzzy-equal
https://www.npmjs.com/package/alike
*/
function objectSimilarity(a: object, b: object): number {
	if(typeof a !== 'object' || typeof b !== 'object') return 0;
	if(deepStrictEqual(a, b)) return 1;
	if(isArray(a) !== isArray(b)) return 0;
	let similarity = 0;

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if(deepStrictEqual(keysA, keysB)){
		similarity += 0.6;
	// eslint-disable-next-line @typescript-eslint/require-array-sort-compare
	}else if(deepStrictEqual(keysA.sort(), keysB.sort())){
		similarity += 0.4;
	}

	const keyValue = 1 / (keysA.length + keysB.length) / 2;
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

class TypeDeclaration {
	constructor(id: string, name: string){
		this.id = id;
		this.realName = name;
	}
	public id: string;
	public realName: string;
	public type!: Arr | Obj;
	public declared?: true;
	public readonly references: Array<Arr | Obj> = [];

	public add(reference: Arr | Obj): void {
		this.references.push(reference);
		this.type = isArray(this.references[0]) ?
			joinArrays(...this.references as Arr[]) :
			joinObjects(...this.references as Obj[]);
	}

	public get uses(): number {
		return this.references.length;
	}

	public get name(): string {
		if(this.realName.endsWith('[]')){
			return this.realName.slice(0, -2);
		}else return this.realName;
	}

	public isEqual(otherType: Arr | Obj): boolean {
		return deepStrictEqual(this.type, otherType);
	}

	public similarity(otherType: Arr | Obj): number {
		return objectSimilarity(this.type, otherType);
	}

	public isSimilar(otherType: Arr | Obj): boolean {
		return this.similarity(otherType) > 0.8;
	}
}

function manage(cache: TypeDeclaration[], type: PropType, name: string): string {
	if(typeof type === 'string') return type;

	const sameType = cache.find(entry => entry.isEqual(type));
	if(sameType){
		sameType.add(type);
		return sameType.id;
	}

	const sameName = cache.find(entry => entry.realName === name);
	if(sameName && objectSimilarity(sameName.type, type) > 0.3){
		sameName.add(type);
		return sameName.id;
	}

	const [similarType] = cache.sort((a, b) => a.similarity(type) - b.similarity(type));
	if(similarType && objectSimilarity(similarType.type, type) > 0.4){
		similarType.add(type);
		return similarType.id;
	}

	const t = new TypeDeclaration('\xFF' + cache.length.toString(), name);
	cache.push(t);
	t.add(type);

	return t.id;
}

function cacheProp(cache: TypeDeclaration[], prop: Prop, name: string): void {
	for(let i = 0; i < prop.types.length; i++){
		const type = prop.types[i];
		if(isArray(type)){
			for(const subType of type){
				cacheProp(cache, subType, name + '[]');
			}
			// manage<Arr>(cache, type, name);
		}else if(isObj(type)){
			for(const key in type){
				cacheProp(cache, type[key] as Prop, key);
			}
			prop.types[i] = manage(cache, type, name);
		}
	}
}

function stringifyPropType(cache: TypeDeclaration[], type: PropType): string {
	if(typeof type === 'string') return type;

	const t = findType(cache, type);
	if(t !== null) return stringifyPropType(cache, t);

	if(isArray(type)){
		if(type.length === 0) return '[]';

		const arr = utils.filterDuplicates(type);
		const stringified = arr.map(a => stringifyProp(cache, a));

		if(arr.length === 1 || utils.filterDuplicates(stringified).length === 1){
			return `${stringified[0] as string}[]`; // type[]
		}else if(arr.length <= type.length / 2){
			return `Array<${stringified.join(' | ')}>`; // Array<type1 | type2>
		}else return `[\n${
			utils.indent(type.map(prop =>
				stringifyProp(cache, prop) + (prop.optional ? '?' : '')
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

			str += `: ${stringifyProp(cache, prop)};`;
			if(key !== keys[keys.length - 1]) str += '\n';
		}

		return '{\n' + utils.indent(str) + '\n}';
	}
}

function stringifyProp(cache: TypeDeclaration[], prop: Prop): string {
	return prop.types.map(a => stringifyPropType(cache, a)).join(' | ');
}

function findType(cache: TypeDeclaration[], type: Arr | Obj): Arr | Obj | null {
	const entry = cache.find(t => t.references.includes(type));

	return entry ? entry.type : null;
}

export default function stringify(parsed: Prop): string {
	const cache: TypeDeclaration[] = [];
	cacheProp(cache, parsed, '');

	const declarations = [];
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


/*

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

*/
