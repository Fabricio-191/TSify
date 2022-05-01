/* eslint-disable no-else-return */
import type { Obj } from '../utils';
import { compareTwoStrings as stringSimilarity } from 'string-similarity';
const { isArray } = Array;
// import * as deepStrictEqual from 'fast-deep-equal';

function sharesOneKey(a: object, b: object): boolean {
	for(const key in a){
		if(key in b) return true;
	}

	return false;
}

function deepStrictEqual(a: object, b: object): boolean {
	if(a === b) return true;

	if(a && b && typeof a === 'object' && typeof b === 'object'){
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);

		if(keysA.length !== keysB.length) return false;

		for(const key of keysA){
			if(!keysB.includes(key)) return false;
			if(!deepStrictEqual(a[key], b[key])) return false;
		}
	}

	// eslint-disable-next-line no-self-compare
	return a !== a && b !== b;
}

function objectSimilarity(a: object, b: object): number {
	if(typeof a !== 'object' || typeof b !== 'object' || isArray(a) !== isArray(b)) return 0;
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

type NotEmptyArray<T> = [T, ...T[]];

export class TypeDeclaration {
	constructor(realName: string, name: string, first: Obj){
		this.realName = realName;
		this.name = name;
		this.references = [first];
	}
	public name: string;
	public realName: string;
	public readonly references: NotEmptyArray<Obj>;

	public uses = 0;
	public type!: Obj;

	public add(type: Obj): string {
		this.references.push(type);
		return this.name;
	}

	public similarity(type: Obj): number {
		return this.references.reduce<number>((acc, cur) => {
			const similarity = objectSimilarity(cur, type);
			if(similarity > acc) return similarity;

			return acc;
		}, 0);
	}
}

export type Cache = TypeDeclaration[];

function findSimilar(cache: Cache, similarityFn: (entry: TypeDeclaration) => number): TypeDeclaration | null {
	if(cache.length === 0) return null;

	const mostSimilar = cache.slice(1).reduce<{
		similarity: number;
		entry: TypeDeclaration;
	}>((acc, entry) => {
		const similarity = similarityFn(entry);
		if(similarity > acc.similarity){
			acc.similarity = similarity;
			acc.entry = entry;
		}
		return acc;
	}, {
		similarity: similarityFn(cache[0] as TypeDeclaration),
		entry: cache[0] as TypeDeclaration,
	});

	if(mostSimilar.similarity > 0.6){
		return mostSimilar.entry;
	}else return null;
}

export default function manageObj(cache: Cache, type: Obj, name: string): string {
	const sameName = cache.find(x => x.realName === name);
	if(sameName && (name.length > 5 || sameName.references.some(ref => sharesOneKey(ref, type)))){
		return sameName.add(type);
	}

	const sameType = cache.find(x => x.references.some(ref => deepStrictEqual(ref, type)));
	if(sameType) return sameType.add(type);

	const similiarName = findSimilar(cache, entry => stringSimilarity(entry.realName, name));
	if(similiarName?.references.some(ref => sharesOneKey(ref, type))){
		return similiarName.add(type);
	}

	const similiarType = findSimilar(cache, entry => entry.similarity(type));
	if(similiarType) return similiarType.add(type);

	const t = new TypeDeclaration(
		name,
		name + (sameName ? cache.length.toString() : ''),
		type
	);
	cache.push(t);

	return t.name;
}
