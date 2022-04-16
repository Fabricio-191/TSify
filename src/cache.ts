import type { Prop, Obj } from './utils';
import { joinObjects } from './parse';
import * as deepStrictEqual from 'fast-deep-equal/es6';
import { compareTwoStrings as stringSimilarity } from 'string-similarity';
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
					similarity += keyValue * 4 * objectSimilarity(a[key], b[key]);
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

export class TypeDeclaration {
	constructor(id: string, name: string){
		this.id = id;
		this.realName = name;
	}
	public id: string;
	public realName: string;
	public type!: Obj;
	public declared?: true;
	public readonly references: Obj[] = [];

	public add(reference: Obj): string {
		this.references.push(reference);
		this.type = joinObjects(...this.references);

		return this.id;
	}

	public get uses(): number {
		return this.references.length;
	}

	public get name(): string {
		if(this.realName.includes('[]')){
			return this.realName.replace('[]', '');
		}
		return this.realName;
	}

	public isEqual(otherType: Obj): boolean {
		return deepStrictEqual(this.type, otherType) || this.references.some(ref => deepStrictEqual(ref, otherType));
	}

	public similarity(otherType: Obj): number {
		return objectSimilarity(this.type, otherType);
	}

	public isSimilar(otherType: Obj): boolean {
		return this.similarity(otherType) > 0.8 || this.references.some(ref => objectSimilarity(ref, otherType) > 0.8);
	}
}

function manage(cache: TypeDeclaration[], type: Obj, name: string): string {
	if(typeof type === 'string') return type;

	const sameType = cache.find(entry => entry.isEqual(type));
	if(sameType) return sameType.add(type);

	const sameName = cache.find(entry => entry.realName === name);
	if(sameName){
		if(objectSimilarity(sameName.type, type) > 0.1){
			return sameName.add(type);
		}

		const t = new TypeDeclaration('\xFF' + cache.length.toString() + '\xFF', name + cache.length.toString());
		cache.push(t);

		return t.add(type);
	}

	const [similarType] = cache.sort((a, b) => a.similarity(type) - b.similarity(type));
	if(similarType && objectSimilarity(similarType.type, type) > 0.4){
		return similarType.add(type);
	}

	const [similiarName] = cache.sort((a, b) => stringSimilarity(a.name, name) - stringSimilarity(b.name, name));
	if(
		similiarName &&
		stringSimilarity(similiarName.name, name) > 0.7 &&
		objectSimilarity(similiarName.type, type) > 0.3
	){
		return similiarName.add(type);
	}

	const t = new TypeDeclaration('\xFF' + cache.length.toString() + '\xFF', name);
	cache.push(t);

	return t.add(type);
}

export function cacheProp(cache: TypeDeclaration[], prop: Prop, name: string): void {
	for(let i = 0; i < prop.types.length; i++){
		const type = prop.types[i];
		if(isArray(type)){
			for(const subType of type){
				cacheProp(cache, subType, name + '[]');
			}
			// manage<Arr>(cache, type, name);
		}else if(isObj(type)){
			const keys = Object.keys(type);
			for(const key of keys){
				cacheProp(cache, type[key] as Prop, key);
			}

			if(keys.length !== 0){
				prop.types[i] = manage(cache, type, name);
			}
		}
	}
}

export function findType(cache: TypeDeclaration[], type: unknown): Obj | null {
	const entry = cache.find(t =>
		// @ts-expect-error https://github.com/microsoft/TypeScript/issues/26255
		t.references.includes(type)
	);

	return entry ? entry.type : null;
}

export default function makeDeclarations(parsed: Prop): string {
	
}