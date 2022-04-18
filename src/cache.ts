/* eslint-disable no-else-return */
// @ts-expect-error asdasd
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Prop, Obj, Arr, PropType } from './utils';
import { logAll } from './utils'; logAll();
import { joinObjects } from './parse';
import { stringifyPropType } from './stringify';

import * as deepStrictEqual from 'fast-deep-equal/es6';
import { compareTwoStrings as stringSimilarity } from 'string-similarity';
const { isArray } = Array;
function isObject(thing: unknown): thing is Obj {
	return typeof thing === 'object' &&
		!isArray(thing) && thing !== null;
}

/*
https://www.npmjs.com/package/nearest-neighbor
https://www.npmjs.com/package/fuzzy-equal
https://www.npmjs.com/package/alike
*/
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

class TypeDeclaration {
	constructor(name: string){
		this.realName = name;
		// Object.defineProperty(this, 'references', { enumerable: false });
	}
	public realName: string;
	public type!: Obj;
	public declare?: true;
	public readonly references: Obj[] = [];

	public get uses(): number {
		return this.references.length;
	}

	public get name(): string {
		return this.realName.includes('[]') ?
			this.realName.replace('[]', '') :
			this.realName;
	}

	public add(reference: Obj): void {
		this.references.push(reference);
		this.type = joinObjects(...this.references);
	}

	public similarity(otherType: Obj): number {
		return objectSimilarity(this.type, otherType);
	}
}

class Types {
	public readonly cache: TypeDeclaration[] = [];

	private manageObj(type: Obj, name: string): void {
		const sameType = this.cache.find(entry =>
			deepStrictEqual(entry.type, entry) ||
			entry.references.some(ref => deepStrictEqual(ref, type))
		);
		if(sameType) return sameType.add(type);

		const sameName = this.cache.find(entry => entry.realName === name);
		if(sameName){
			if(objectSimilarity(sameName.type, type) > 0.3){
				return sameName.add(type);
			}
		}

		const [similarType] = this.cache.sort((a, b) => a.similarity(type) - b.similarity(type));
		if(similarType && objectSimilarity(similarType.type, type) > 0.4){
			return similarType.add(type);
		}

		const [similiarName] = this.cache.sort((a, b) =>
			stringSimilarity(a.name, name) -
			stringSimilarity(b.name, name)
		);
		if(
			similiarName &&
			stringSimilarity(similiarName.name, name) > 0.7 &&
			objectSimilarity(similiarName.type, type) > 0.3
		){
			return similiarName.add(type);
		}

		const t = new TypeDeclaration(name + (sameName ? this.cache.length.toString() : ''));
		this.cache.push(t);

		return t.add(type);
	}

	public add(prop: Prop, name: string): void {
		for(const type of prop.types){
			if(isObject(type)){
				for(const key in type){
					this.add(type[key] as Prop, key);
				}

				this.manageObj(type, name);
			}else if(isArray(type)){
				type.forEach(p => this.add(p, name));
			}
		}
	}

	public replaceTypes({ types }: Prop): void {
		for(let i = 0; i < types.length; i++){
			const type = types[i];

			if(Array.isArray(type)){
				type.forEach(t => this.replaceTypes(t));
			}else if(isObject(type)){
				for(const key in type){
					this.replaceTypes(type[key] as Prop);
				}

				const entry = this.cache.find(t => t.references.includes(type));

				if(entry && entry.uses >= 2){
					types[i] = entry.name;
				}
			}
		}
	}

	public replaceTypesInObj(type: Obj): void {
		for(const key in type){
			this.replaceTypes(type[key] as Prop);
		}
	}
}

export default function makeDeclarations(parsed: Prop): string {
	const types = new Types();

	types.add(parsed, 'FinalData');
	types.replaceTypes(parsed);

	let str = '';
	for(const entry of types.cache){
		types.replaceTypesInObj(entry.type);

		if(entry.uses >= 2){
			str += `interface ${entry.name} ${stringifyPropType(entry.type)};\n\n`;
		}
	}

	return str;
}