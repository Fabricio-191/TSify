/* eslint-disable no-else-return */
import type { Prop, Obj } from './utils';
import { logAll } from './utils'; logAll();
import { joinObjects } from './parse';
import { stringifyObj } from './stringify';

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

function sharesOneKey(a: object, b: object): boolean {
	const keysA = Object.keys(a);
	return Object.keys(b).some(k => keysA.includes(k));
}

class TypeDeclaration {
	constructor(name: string){
		this.name = name;
		// Object.defineProperty(this, 'references', { enumerable: false });
	}
	public name: string;
	public type!: Obj;
	public declare?: true;
	public readonly references: Obj[] = [];

	public get uses(): number {
		return this.references.length;
	}

	public add(reference: Obj): string {
		this.references.push(reference);
		this.type = joinObjects(...this.references);
		return this.name;
	}

	public similarity(otherType: Obj): number {
		return objectSimilarity(this.type, otherType);
	}
}

class Types {
	public readonly cache: TypeDeclaration[] = [];

	private manageObj(type: Obj, name: string): string {
		const sameType = this.cache.find(entry =>
			deepStrictEqual(entry.type, entry) ||
			entry.references.some(ref => deepStrictEqual(ref, type))
		);
		if(sameType) return sameType.add(type);

		const sameName = this.cache.find(entry => entry.name === name);
		if(sameName && sharesOneKey(sameName.type, type)){
			return sameName.add(type);
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
			stringSimilarity(similiarName.name, name) > 0.6 &&
			sharesOneKey(similiarName.type, type)
		){
			return similiarName.add(type);
		}

		const t = new TypeDeclaration(name + (sameName ? this.cache.length.toString() : ''));
		this.cache.push(t);

		return t.add(type);
	}

	public add(prop: Prop, name: string): void {
		for(let i = 0; i < prop.types.length; i++){
			const type = prop.types[i];
			if(isObject(type)){
				for(const key in type){
					this.add(type[key] as Prop, key);
				}

				prop.types[i] = this.manageObj(type, name);
			}else if(isArray(type)){
				type.forEach(p => this.add(p, name));
			}
		}
	}

	public replaceInObj(obj: Obj): void {
		for(const key in obj){
			this.replace(obj[key] as Prop);
		}
	}

	public replace(prop: Prop): void {
		for(let i = 0; i < prop.types.length; i++){
			const type = prop.types[i];
			if(isArray(type)){
				type.forEach(p => this.replace(p));
			}
			const entry = this.cache.find(e => e.name === type);

			if(entry && entry.uses === 1){
				prop.types[i] = entry.type;

				this.replaceInObj(entry.type);
			}
		}
	}
}

function order(a: TypeDeclaration, b: TypeDeclaration): number {
	if(stringSimilarity(a.name, b.name) > 0.6){
		if(a.name < b.name){
		  return -1;
		}
		if(a.name > b.name){
		  return 1;
		}
		return 0;
	}else return b.uses - a.uses;
}

export default function makeDeclarations(parsed: Prop): string {
	const types = new Types();

	types.add(parsed, 'FinalData');

	const declarations = [
		'/* eslint-disable @typescript-eslint/ban-types */\n',
	];
	for(const entry of types.cache.sort(order)){
		types.replaceInObj(entry.type);

		if(entry.uses !== 1){
			declarations.push(`interface ${entry.name} ${stringifyObj(entry.type)};\n`);
		}
	}

	types.replace(parsed);

	return declarations.join('\n');
}
