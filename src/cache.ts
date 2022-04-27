/* eslint-disable no-else-return */
import type { Prop, Obj } from './utils';
import { logAll } from './utils'; logAll();
import { joinObjects } from './parse';
import { stringifyObj } from './stringify';

import * as deepStrictEqual from 'fast-deep-equal/es6';
import { compareTwoStrings as stringSimilarity } from 'string-similarity';
const { isArray } = Array;

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
	for(const key in a){
		if(key in b) return true;
	}

	return false;
}

class TypeDeclaration {
	constructor(realName: string, name: string, first: Obj){
		this.realName = realName;
		this.name = name;
		this.references = [first];
	}
	public name: string;
	public realName: string;
	public readonly references: [Obj, ...Obj[]];

	public uses = 0;
	public type!: Obj;

	public add(type: Obj): string {
		this.references.push(type);
		return this.name;
	}

	public similarity(type: Obj): number {
		return this.references.slice(1).reduce<{
			similarity: number;
			reference: Obj;
		}>((acc, reference) => {
			const similarity = objectSimilarity(reference, type);
			if(similarity > acc.similarity){
				acc.similarity = similarity;
				acc.reference = reference;
			}
			return acc;
		}, {
			similarity: objectSimilarity(this.references[0], type),
			reference: this.references[0],
		}).similarity;
	}

	public isEqual(type: Obj): boolean {
		return this.references.some(ref => deepStrictEqual(ref, type));
	}
}

class Types {
	public readonly cache: TypeDeclaration[] = [];

	private manageObj(type: Obj, name: string): string {
		const sameType = this.cache.find(entry => entry.isEqual(type));
		if(sameType) return sameType.add(type);

		const sameName = this.getByName(name);
		if(sameName?.references.some(ref => sharesOneKey(ref, type))){
			return sameName.add(type);
		}

		const similiarName = this.findSimilarName(name);
		if(similiarName?.references.some(ref => sharesOneKey(ref, type))){
			return similiarName.add(type);
		}

		const similarType = this.findSimilarType(type);
		if(similarType) return similarType.add(type);

		const t = new TypeDeclaration(
			name,
			name + (sameName ? this.cache.length.toString() : ''),
			type
		);
		this.cache.push(t);

		return t.name;
	}

	public getByName(name: string): TypeDeclaration | null {
		return this.cache.find(entry => entry.name === name) ?? null;
	}

	private findSimilarName(name: string): TypeDeclaration | null {
		if(this.cache.length === 0) return null;

		const mostSimilar = this.cache.reduce<{
			similarity: number;
			entry: TypeDeclaration;
		}>((acc, entry) => {
			const similarity = stringSimilarity(entry.name, name);
			if(similarity > acc.similarity){
				acc.similarity = similarity;
				acc.entry = entry;
			}
			return acc;
		}, {
			similarity: stringSimilarity(
				(this.cache[0] as TypeDeclaration).name, name
			),
			entry: this.cache[0] as TypeDeclaration,
		});

		if(mostSimilar.similarity > 0.6){
			return mostSimilar.entry;
		}else return null;
	}

	private findSimilarType(type: Obj): TypeDeclaration | null {
		if(this.cache.length === 0) return null;

		const mostSimilar = this.cache.slice(1).reduce<{
			similarity: number;
			entry: TypeDeclaration;
		}>((acc, entry) => {
			const similarity = entry.similarity(type);
			if(similarity > acc.similarity){
				acc.similarity = similarity;
				acc.entry = entry;
			}
			return acc;
		}, {
			similarity: objectSimilarity(this.cache[0] as TypeDeclaration, type),
			entry: this.cache[0] as TypeDeclaration,
		});

		if(mostSimilar.similarity > 0.6){
			return mostSimilar.entry;
		}else return null;
	}

	public add(prop: Prop, name: string): void {
		for(let i = 0; i < prop.types.length; i++){
			const type = prop.types[i];
			if(isArray(type)){
				type.forEach(p => this.add(p, name));
			}else if(typeof type === 'object' && type !== null){
				for(const key in type){
					this.add(type[key] as Prop, key);
				}

				prop.types[i] = this.manageObj(type, name);
			}
		}
	}

	public countUses(entry: TypeDeclaration): void {
		for(const key in entry.type){
			const { types } = entry.type[key] as Prop;

			for(const type of types as string[]){
				const e = this.getByName(type);
				if(e) e.uses++;
			}
		}
	}

	public replaceInObj(obj: Obj): void {
		for(const key in obj) this.replace(obj[key] as Prop);
	}

	public replace(prop: Prop): void {
		for(let i = 0; i < prop.types.length; i++){
			const type = prop.types[i];
			if(isArray(type)){
				type.forEach(p => this.replace(p));
			}
			const entry = this.cache.find(e => e.name === type);
			if(!entry) continue;

			if(entry.uses <= 1){
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
		}else if(a.name > b.name){
			return 1;
		}else return 0;
	}else return b.uses - a.uses;
}

export default function makeDeclarations(parsed: Prop): string {
	const types = new Types();

	// console.log('a');
	types.add(parsed, 'FinalData1');
	// console.log('b');
	for(const t of types.cache){
		t.type = joinObjects(...t.references);
		types.countUses(t);
	}
	// console.log('c');

	const declarations = [];
	for(const t of types.cache.sort(order)){
		types.replaceInObj(t.type);
		if(t.uses <= 1) continue;

		declarations.push(`export interface ${t.name} ${stringifyObj(t.type)};\n`);
	}
	// console.log('d');
	types.replace(parsed);
	// console.log('e');

	return declarations.join('\n');
}
