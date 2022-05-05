/* eslint-disable no-else-return */
import type { Obj } from '../utils';

import { sharesOneKey, deepStrictEqual, objectSimilarity, stringSimilarity } from './utils';

type NonEmptyArray<T> = [T, ...T[]];
export type Cache = TypeDeclaration[];

export class TypeDeclaration {
	constructor(realName: string, name: string, first: Obj){
		this.realName = realName;
		this.name = name;
		this.references = [first];
	}
	public name: string;
	public realName: string;
	public readonly references: NonEmptyArray<Obj>;

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

	public isEqual(type: Obj): boolean {
		return this.references.some(ref => deepStrictEqual(ref, type));
	}
}

function findSimilar(
	cache: Cache,
	similarityFn: (entry: TypeDeclaration) => number
): TypeDeclaration | null {
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

	if(mostSimilar.similarity < 0.6) return null;

	return mostSimilar.entry;
}

export default function manageObj(cache: Cache, type: Obj, name: string): string {
	const sameName = cache.find(x => x.realName === name);
	if(sameName && (
		name.length > 5 ||
		sameName.references.some(ref => sharesOneKey(ref, type))
	)) return sameName.add(type);

	const sameType = cache.find(x => x.isEqual(type));
	if(sameType) return sameType.add(type);

	const similiarName = findSimilar(cache, entry => stringSimilarity(entry.realName, name));
	if(similiarName?.references.some(ref => sharesOneKey(ref, type))){
		return similiarName.add(type);
	}

	const similiarType = findSimilar(cache, entry => entry.similarity(type));
	if(similiarType) return similiarType.add(type);

	cache.push(new TypeDeclaration(
		name,
		name + (sameName ? cache.length.toString() : ''),
		type
	));

	return name;
}
