/* eslint-disable no-else-return */
import type { Prop, Obj } from './utils';
import { logAll } from './utils'; logAll();
import { joinObjects } from './parse';
import { stringifyObj } from './stringify';

import { compareTwoStrings as stringSimilarity } from 'string-similarity';
const { isArray } = Array;

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
		const typeKeys = Object.keys(type);

		for(const reference of this.references) {
			const referenceKeys = Object.keys(reference);

			if(typeKeys.length !== referenceKeys.length) continue;
		}
	}
}

class Types {
	public readonly cache: TypeDeclaration[] = [];

	private findSameType(type: Obj): TypeDeclaration | null {
		const typeKeys = Object.keys(type);

		return this.cache.find(entry => {
			const entryKeys = Object.keys(entry.type);

			if(entryKeys.length !== typeKeys.length) return false;

			for(const key of typeKeys){
				if(entry.type[key] !== type[key]) return false;
			}

			return true;
		}) ?? null;
	}

	private manageObj(type: Obj, name: string): string {
		const sameName = this.getByName(name);
		if(sameName?.references.some(ref => sharesOneKey(ref, type))){
			return sameName.add(type);
		}

		const sameType = this.findSameType(type);
		if(sameType) return sameType.add(type);

		const similiarName = this.findSimilar(entry => stringSimilarity(entry.realName, name));
		if(similiarName?.references.some(ref => sharesOneKey(ref, type))){
			return similiarName.add(type);
		}

		const similiarType = this.findSimilar(entry => entry.similarity(type));
		if(similiarType) return similiarType.add(type);

		const t = new TypeDeclaration(
			name,
			name + (sameName ? this.cache.length.toString() : ''),
			type
		);
		this.cache.push(t);

		return t.name;
	}

	public getByName(name: string): TypeDeclaration | null {
		return this.cache.find(entry => entry.realName === name) ?? null;
	}

	private findSimilar(similarityFn: (entry: TypeDeclaration) => number): TypeDeclaration | null {
		if(this.cache.length === 0) return null;

		const mostSimilar = this.cache.slice(1).reduce<{
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
			similarity: similarityFn(this.cache[0] as TypeDeclaration),
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

	types.add(parsed, 'FinalData1');

	for(const t of types.cache){
		t.type = joinObjects(...t.references);
		types.countUses(t);
	}

	const declarations = [];
	for(const t of types.cache.sort(order)){
		types.replaceInObj(t.type);
		if(t.uses <= 1) continue;

		declarations.push(`export interface ${t.name} ${stringifyObj(t.type)};\n`);
	}

	types.replace(parsed);

	return declarations.join('\n');
}
