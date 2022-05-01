/* eslint-disable no-else-return */
import type { Cache, TypeDeclaration } from './cache';
import type { Prop, Obj } from '../utils';
import { joinObjects } from '../parse';
import { stringifyObj } from '../stringify';
import { compareTwoStrings as stringSimilarity } from 'string-similarity';
const { isArray } = Array;

function countUses(cache: Cache, entry: TypeDeclaration): void {
	for(const key in entry.type){
		const { types } = entry.type[key] as Prop;

		for(const type of types as string[]){
			const e = cache.find(x => x.name === type);
			if(e) e.uses++;
		}
	}
}

function replaceInObj(cache: Cache, obj: Obj): void {
	for(const key in obj) replace(cache, obj[key] as Prop);
}

function replace(cache: Cache, prop: Prop): void {
	for(let i = 0; i < prop.types.length; i++){
		const type = prop.types[i];
		if(isArray(type)){
			type.forEach(p => replace(cache, p));
		}
		const entry = cache.find(e => e.name === type);
		if(!entry) continue;

		if(entry.uses <= 1){
			prop.types[i] = entry.type;

			replaceInObj(cache, entry.type);
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

export default function makeDeclarations(cache: Cache, parsed: Prop): string {
	for(const t of cache){
		t.type = joinObjects(...t.references);
		countUses(cache, t);
	}

	const declarations = [];
	for(const t of cache.sort(order)){
		replaceInObj(cache, t.type);
		if(t.uses <= 1) continue;

		declarations.push(`export interface ${t.name} ${stringifyObj(t.type)};\n`);
	}

	replace(cache, parsed);

	return declarations.join('\n');
}