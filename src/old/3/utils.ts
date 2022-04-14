// import { compareTwoStrings } from 'string-similarity';

export function indent(str: string, indentation = '\t'): string {
	return str.replace(/^/gm, indentation);
}

export function removeDuplicates(arr: unknown[]): unknown[] {
	const set = new Set();

	for(const elem of arr){
		set.add(elem);
	}

	return Array.from(set);
}

export function joinArrays(...arrays: unknown[]): unknown[] {
	return removeDuplicates(([] as unknown[]).concat(...arrays));
}

export function joinKeys(...objs: object[]): string[] {
	return joinArrays(
		...objs.map(Object.keys)
	) as string[];
}

export class TypesCache{
	private readonly cache: {
		id: string;
		key: string;
		types: [string, ...string[]];
		uses: number;
		declared: boolean;
	}[] = [];

	private static readonly objectRegex = /\{|\[/;
	public main(type: string, key: string | null = null): string {
		if(!TypesCache.objectRegex.test(type)){
			return type;
		}

		const sameType = this.cache.find(x => x.types.includes(type)) ?? null;
		if(sameType){
			sameType.uses++;
			return sameType.id;
		}
		const sameKey = this.cache.find(x => x.key === key);
		if(sameKey){
			sameKey.types.push(type);
			sameKey.uses++;
			return sameKey.id;
		}

		const id = this.genID();
		if(key === null) key = id.slice(2, -2);

		this.cache.push({
			id, key,
			types: [type],
			uses: 1,
			declared: false,
		});

		return id;
	}

	public end(final: string): string {
		let str = '';

		while(final.includes('ᴤᴧ')){
			for(const entry of this.cache){
				if(entry.declared){
					final = final.replaceAll(entry.id, entry.key);
					continue;
				}

				if(
					!entry.declared &&
					(entry.uses > 2 || entry.types.length > 1) && !(entry.types.length === 1 && entry.types[0].length < 150)
				){
					entry.declared = true;
					str += `type ${entry.key} = ${entry.types.join(' | ')};\n\n`;
					final = final.replaceAll(entry.id, entry.key);
				}else{
					final = final.replaceAll(entry.id, entry.types[0]);
				}
			}
		}

		return '/* eslint-disable */\n' + str + '\nexport default interface Data ' + final;
	}

	private lastID = 0;
	private genID(): string {
		const ID = (this.lastID++).toString(36);
		return 'ᴤᴧ' + ID + 'ᴫᴅ';
	}
}